import React, { useState, useEffect } from 'react';
import './TaskForm.css';
import { toast } from 'react-toastify';

const TaskForm = ({ task, onSubmit, onCancel }) =>
{
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() =>
  {
    if (task)
    {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) =>
  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });
    toast.success(task ? 'Task updated successfully' : 'Task added successfully');
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 