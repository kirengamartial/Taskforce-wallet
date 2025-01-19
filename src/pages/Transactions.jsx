import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  const formatDate = (date) => {
    return date.toISOString().split('.')[0]; // Removes milliseconds
  };  

  const { userInfo } = useSelector((state) => state.auth);

  const fetchTransactions = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      const response = await fetch(
        `/api/transactions/account/${userInfo.userId}?startDate=${formatDate(dateRange.startDate)}&endDate=${formatDate(dateRange.endDate)}`,
        {
          method: 'GET',
          headers,
        }
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {transaction.type === 'INCOME' ? (
                  <ArrowUpCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <ArrowDownCircle className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.dateTime), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Category: {transaction.categoryId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchTransactions}
        />
      )}
    </div>
  );
};

export default Transactions;