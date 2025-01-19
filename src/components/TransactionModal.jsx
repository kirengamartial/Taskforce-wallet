import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar, 
  FileText, 
  Wallet, 
  Tag, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'EXPENSE',
    accountId: '',
    categoryId: '',
    dateTime: new Date().toISOString().slice(0, 16)
  });

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      setIsLoadingData(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.accessToken}`,
        };

        const [accountsRes, categoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/accounts/user/${userInfo.userId}`, { method: 'GET', headers }),
          fetch('/api/categories', { method: 'GET', headers })
        ]);
        
        if (!accountsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const accountsData = await accountsRes.json();
        const categoriesData = await categoriesRes.json();
        setAccounts(accountsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [isOpen, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
        body: JSON.stringify({ ...formData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && data.message) {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo?.accessToken}`,
            },
            body: JSON.stringify({
              userId: userInfo.userId,
              message: data.message
            })
          });
          
          toast.error(data.message);
        } else {
          throw new Error('Failed to create transaction');
        }
      } else {
        toast.success('Transaction created successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Add Transaction</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              disabled={isLoading || isLoadingData}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Loading data...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      {formData.type === 'EXPENSE' ? 
                        <ArrowDownCircle className="h-4 w-4 text-red-400" /> :
                        <ArrowUpCircle className="h-4 w-4 text-green-400" />
                      }
                    </div>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      disabled={isLoading}
                    >
                      <option value="EXPENSE">Expense</option>
                      <option value="INCOME">Income</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Wallet className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date & Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                      className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="pl-8 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter description"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-sm min-w-[100px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add Transaction'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;