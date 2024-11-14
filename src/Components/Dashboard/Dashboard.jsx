import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';
import './dashboard.css';

const Dashboard = () => {
  const data = [
    { name: 'In Progress', value: 10 },
    { name: 'Completed', value: 5 },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div className="dashboard-chart">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
