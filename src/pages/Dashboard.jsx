import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import AccountModal from '../components/AccountModal';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

   const [dateRange, setDateRange] = useState({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date()
    });
  
    const formatDate = (date) => {
      return date.toISOString().split('.')[0]; 
    };  


  
  const { userInfo } = useSelector((state) => state.auth);

  const fetchData = async () => {
    try {
      // Use userInfo from the outer scope
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      // Fetch transactions with auth
      const transactionsResponse = await fetch(
        `/api/transactions/account/${userInfo.userId}?startDate=${formatDate(dateRange.startDate)}&endDate=${formatDate(dateRange.endDate)}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!transactionsResponse.ok) {
        throw new Error(`HTTP error! status: ${transactionsResponse.status}`);
      }
      
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
      
      // Fetch accounts with auth
      const accountsResponse = await fetch(
        `/api/accounts/user/${userInfo.userId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!accountsResponse.ok) {
        throw new Error(`HTTP error! status: ${accountsResponse.status}`);
      }

      const accountsData = await accountsResponse.json();
      setAccounts(accountsData);

      // Process data for charts
      processChartData(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.message.includes('401')) {
        console.log('Authentication error - please log in again');
      }
    }
  };

  // Add userInfo to the dependency array since we're using it in fetchData
  useEffect(() => {
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]); 

  const processChartData = (transactionsData) => {
    // Process category data for pie chart
    const categoryGroups = transactionsData.reduce((acc, transaction) => {
      const category = transaction.categoryId;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(transaction.amount);
      return acc;
    }, {});

    const categoryChartData = Object.entries(categoryGroups).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
    setCategoryData(categoryChartData);

    // Process monthly data for bar chart
    const monthlyGroups = transactionsData.reduce((acc, transaction) => {
      const month = new Date(transaction.dateTime).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (transaction.type === 'INCOME') {
        acc[month].income += Number(transaction.amount);
      } else {
        acc[month].expense += Number(transaction.amount);
      }
      return acc;
    }, {});

    const monthlyChartData = Object.entries(monthlyGroups).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense
    }));
    setMonthlyData(monthlyChartData);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowAccountModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Account
          </button>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <Wallet className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">Total Balance</h2>
            <p className="text-3xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${Number(account.balance).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{account.type}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Income vs Expense</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showTransactionModal && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showAccountModal && (
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Dashboard;