import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  DollarSign,
  List,
  FileText
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Accounts', href: '/accounts', icon: CreditCard },
    { name: 'Transactions', href: '/transactions', icon: List },
    { name: 'Budget', href: '/budgets', icon: DollarSign },
    { name: 'Categories', href: '/categories', icon: PieChart },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-30`}>
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <span className="text-white text-2xl font-semibold">Wallet App</span>
          <button 
            onClick={() => setOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-6 py-4 text-gray-500 hover:bg-gray-100"
            >
              <item.icon className="h-6 w-6" />
              <span className="mx-4">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;