import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const BudgetModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    limit: '',
    userId: 1, // Replace with actual user ID from auth
  });

  const [categories, setCategories] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.accessToken}`, 
        },
        body: JSON.stringify({
          ...formData,
          userId: userInfo?.userId,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create budget');
      
      toast.success('Budget created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Set Budget</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
            <label className="block text-sm font-medium text-gray-700">Budget Limit</label>
            <input
              type="number"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Set Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;