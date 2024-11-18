import { PieChart, Pie, Tooltip } from 'recharts';

const Dashboard = () => {
  const data = [
    { name: 'In Progress', value: 10 },
    { name: 'Completed', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-indigo-600 mb-4">Dashboard</h1>
        <p className="text-xl text-gray-600 mb-6">Welcome to your dashboard!</p>
        
        <div className="flex justify-center items-center">
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
    </div>
  );
};

export default Dashboard;
