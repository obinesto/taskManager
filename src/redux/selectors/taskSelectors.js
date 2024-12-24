export const selectUser = (state) => state.task.user;
export const selectTasks = (state) => state.task.tasks;
export const selectUsers = (state) => state.task.users;

export const selectIsLoading = (state) => state.task.loading;

export const selectTaskStats = (state) => {
  const tasks = state.task.tasks;
  return {
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    rejected: tasks.filter((task) => task.status === "Rejected").length,
  };
};

export const selectTaskById = (state, taskId) =>
  state.task.tasks.find((task) => task._id === taskId);
