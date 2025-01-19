import React, { useState, useEffect } from 'react';
import { PlusCircle, Wallet, CreditCard, Smartphone } from 'lucide-react';
import AccountModal from '../components/AccountModal';
import { useSelector } from 'react-redux';

const getAccountIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'BANK':
      return <CreditCard className="h-6 w-6 text-blue-500" />;
    case 'MOBILE_MONEY':
      return <Smartphone className="h-6 w-6 text-green-500" />;
    case 'CASH':
      return <Wallet className="h-6 w-6 text-yellow-500" />;
    default:
      return <Wallet className="h-6 w-6 text-gray-500" />;
  }
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);


  const { userInfo } = useSelector((state) => state.auth);


  const fetchAccounts = async () => {
    try {

       const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      const response = await fetch(`/api/accounts/user/${userInfo.userId}`, 
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Account
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Total Balance</h2>
        <p className="text-3xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              {getAccountIcon(account.type)}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500">{account.type}</p>
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">
              ${Number(account.balance).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <AccountModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchAccounts}
        />
      )}
    </div>
  );
};

export default Accounts;