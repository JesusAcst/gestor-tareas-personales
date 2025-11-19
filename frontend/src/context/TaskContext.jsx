import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { tasksApi, categoriesApi } from '../services/api';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: null,
    priority: null,
    tab: 'pending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tareas y categorías
  const refreshTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        tasksApi.list(),
        categoriesApi.list()
      ]);
      setTasks(tasksData || []);
      setCategories(categoriesData || []);
    } catch (e) {
      console.error(e);
      setError('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Filtrar tareas según los filtros activos
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filtrar por tab (completed)
    if (filters.tab === 'completed') {
      result = result.filter(t => t.completed === true);
    } else if (filters.tab === 'pending') {
      result = result.filter(t => t.completed === false);
    } else if (filters.tab === 'categories') {
      // En la pestaña de categorías, mostrar todas pero agrupadas
      // No filtramos por completed aquí
    }

    // Filtrar por categoría
    if (filters.categoryId && filters.categoryId !== 'all') {
      result = result.filter(t => {
        const taskCategoryId = t.category?._id || t.category;
        return taskCategoryId === filters.categoryId;
      });
    }

    // Filtrar por prioridad
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => {
        const taskPriority = t.priority || '';
        return taskPriority === filters.priority;
      });
    }

    return result;
  }, [tasks, filters]);

  // Agrupar tareas por categoría (para la pestaña de categorías)
  const tasksByCategory = useMemo(() => {
    if (filters.tab !== 'categories') return null;

    // Para la pestaña de categorías, no filtramos por completed
    let allTasks = [...tasks];
    
    // Aplicar filtros de categoría y prioridad si existen
    if (filters.categoryId && filters.categoryId !== 'all') {
      allTasks = allTasks.filter(t => {
        const taskCategoryId = t.category?._id || t.category;
        return taskCategoryId === filters.categoryId;
      });
    }

    if (filters.priority && filters.priority !== 'all') {
      allTasks = allTasks.filter(t => {
        const taskPriority = t.priority || '';
        return taskPriority === filters.priority;
      });
    }

    const grouped = {};
    
    // Tareas sin categoría
    const uncategorized = allTasks.filter(t => !t.category);
    if (uncategorized.length > 0) {
      grouped['sin-categoria'] = {
        name: 'Sin categoría',
        color: '#9ca3af',
        tasks: uncategorized
      };
    }

    // Tareas por categoría
    allTasks.forEach(task => {
      if (task.category) {
        const catId = task.category._id || task.category;
        const catName = task.category.name || 'Sin nombre';
        const catColor = task.category.color || '#9ca3af';
        
        if (!grouped[catId]) {
          grouped[catId] = {
            name: catName,
            color: catColor,
            tasks: []
          };
        }
        grouped[catId].tasks.push(task);
      }
    });

    return grouped;
  }, [tasks, filters.tab, filters.categoryId, filters.priority]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const value = {
    tasks,
    categories,
    filters,
    filteredTasks,
    tasksByCategory,
    isLoading,
    error,
    setTasks,
    setCategories,
    updateFilters,
    refreshTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de TaskProvider');
  }
  return context;
}

