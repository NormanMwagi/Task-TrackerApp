import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './Dashboard.css';
import { toast } from 'react-toastify';

const Dashboard = () =>
{
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() =>
  {
    fetchTasks();
  }, []);

  const fetchTasks = async () =>
  {
    try
    {
      const userTasks = await tasksAPI.getTasks(user.id);
      setTasks(userTasks);
    } catch (error)
    {
      console.error('Error fetching tasks:', error);
    } finally
    {
      setLoading(false);
    }
  };

  const stats = useMemo(() =>
  {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(
      t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, overdue, pct };
  }, [tasks]);

  const handleAddTask = async (taskData) =>
  {
    try
    {
      const newTask = await tasksAPI.createTask({
        ...taskData,
        userId: user.id,
      });
      setTasks([...tasks, newTask]);
      setShowTaskForm(false);
    } catch (error)
    {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (taskId, taskData) =>
  {
    try
    {
      const updatedTask = await tasksAPI.updateTask(taskId, taskData);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      setEditingTask(null);
    } catch (error)
    {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) =>
  {
    try
    {
      await tasksAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error)
    {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (taskId, completed) =>
  {
    try
    {
      const updatedTask = await tasksAPI.toggleTask(taskId, completed);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (error)
    {
      console.error('Error toggling task:', error);
    }
  };

  const handleLogout = () =>
  {
    logout();
  };

  if (loading)
  {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {user.name}!</h1>
          <p>Manage your tasks efficiently</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="stats-overview">
          <div className="stat-card">
            <h2>{stats.total}</h2>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h2>{stats.completed}</h2>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h2>{stats.overdue}</h2>
            <p>Overdue</p>
          </div>
          <div className="stat-card">
            <h2>{stats.pct}%</h2>
            <p>Completion</p>
          </div>
        </div>
        <div className="task-controls">
          <button
            onClick={() => setShowTaskForm(true)}
            className="add-task-button"
          >
            + Add New Task
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={(taskData) => handleEditTask(editingTask.id, taskData)}
            onCancel={() => setEditingTask(null)}
          />
        )}

        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
        />
      </div>
    </div>
  );
};

export default Dashboard; 