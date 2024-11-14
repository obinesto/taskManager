import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "./taskService"

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/${id}`);
        setTask(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task:', error);
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);  

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(`/tasks/${id}`, { status: newStatus });
      setTask(response.data); // Update task with new status
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div className="task-details-container">
      <h2>Task Details</h2>
      <div className="task-details-item"><strong>Name:</strong> {task.name}</div>
      <div className="task-details-item"><strong>Description:</strong> {task.description}</div>
      <div className="task-details-item"><strong>Assigned To:</strong> {task.executedBySelf ? "Self" : task.assignedTo}</div>
      <div className="task-details-item"><strong>Status:</strong> {task.status}</div>

      <div className="task-details-actions">
        {task.executedBySelf ? (
          // Actions for self-assigned tasks
          task.status === 'In Progress' ? (
            <button onClick={() => handleUpdateStatus('Completed')}>Mark as Completed</button>
          ) : (
            <p>This task is already completed.</p>
          )
        ) : (
          // Actions for tasks assigned to others
          <>
            {task.status === 'Pending' && (
              <>
                <button className="accept-button" onClick={() => handleUpdateStatus('In Progress')}>Accept Task</button>
                <button className="reject-button" onClick={() => handleUpdateStatus('Rejected')}>Reject Task</button>
              </>
            )}
            {task.status === 'In Progress' && (
              <button className="complete-button" onClick={() => handleUpdateStatus('Completed')}>Mark as Completed</button>
            )}
            {task.status === 'Rejected' && <p>This task was rejected.</p>}
            {task.status === 'Completed' && <p>This task is completed.</p>}
          </>
        )}

        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default TaskDetails;
