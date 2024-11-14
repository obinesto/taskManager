import React, { useState } from 'react';
import axios from '../../Services/taskService';
import "./taskform.css"


const TaskForm = () => {
  const [task, setTask] = useState({ name: '', description: '', executedBySelf: true, assignedTo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/tasks', task);
    setTask({ name: '', description: '', executedBySelf: true, assignedTo: '' });
  };

  return (
    <form className="task-form-container" onSubmit={handleSubmit}>
      <input value={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} placeholder="Task Name" required />
      <textarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} placeholder="Description" />
      <label>
        <input type="checkbox" checked={task.executedBySelf} onChange={(e) => setTask({ ...task, executedBySelf: e.target.checked })} />
        Executed by Self
      </label>
      {!task.executedBySelf && <input value={task.assignedTo} onChange={(e) => setTask({ ...task, assignedTo: e.target.value })} placeholder="Assign to" />}
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;