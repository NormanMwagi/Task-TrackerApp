import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-content">
            <div className="task-header">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => onToggle(task.id, e.target.checked)}
                className="task-checkbox"
              />
              <h4 className="task-title">{task.title}</h4>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>
              <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
          
          <div className="task-actions">
            <button 
              onClick={() => onEdit(task)} 
              className="edit-button"
              title="Edit task"
            >
              ✏️
            </button>
            <button 
              onClick={() => onDelete(task.id)} 
              className="delete-button"
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 