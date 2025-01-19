// pages/Budgets.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import BudgetModal from '../components/BudgetModal';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchBudgets = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets/user/${userInfo.userId}`,
        {
          method: 'GET',
          headers,
        }
      );
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const getBudgetUtilization = (budget) => {
    return (budget.currentAmount / budget.limit) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Set Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="limit"
                  nameKey="categoryId"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {budgets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Details</h2>
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-900 font-medium">{budget.category?.name}</h3>
                  <span className="text-gray-500">
                    ${budget.currentAmount} / ${budget.limit}
                  </span>
                </div>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width: `${Math.min(getBudgetUtilization(budget), 100)}%`,
                        backgroundColor: getBudgetUtilization(budget) > 90 ? '#EF4444' : '#10B981',
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <BudgetModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchBudgets}
        />
      )}
    </div>
  );
};

export default Budgets;