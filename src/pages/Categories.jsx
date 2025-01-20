import React, { useState, useEffect } from 'react';
import { PlusCircle, ChevronRight, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategoryModal from '../components/CategoryModal';
import SubCategoryModal from '../components/SubCategoryModal';
import { useSelector } from 'react-redux';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalSub, setShowModalSub] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchCategories = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const organizedCategories = categories.reduce((acc, category) => {
    if (!category.parentId) {
      acc[category.id] = {
        ...category,
        children: categories.filter(c => c.parentId === category.id)
      };
    }
    return acc;
  }, {});

  // Action buttons for different screen sizes
  const ActionButtons = () => (
    <>
      {/* Desktop/Tablet View */}
      <div className="hidden sm:flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Category
        </button>
        <button
          onClick={() => setShowModalSub(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add SubCategory
        </button>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowModal(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowModalSub(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add SubCategory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Categories</h1>
        <ActionButtons />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {Object.values(organizedCategories).map((category) => (
          <div 
            key={category.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {category.name}
              </h3>
            </div>
              
            {category.children && category.children.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {category.children.map((subCategory) => (
                  <div 
                    key={subCategory.id}
                    className="p-3 sm:p-4 pl-6 sm:pl-8 flex items-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {subCategory.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Subcategory of {category.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 sm:p-4 text-sm text-gray-500 italic">
                No subcategories
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCategories}
        />
      )}

      {showModalSub && (
        <SubCategoryModal
          isOpen={showModalSub}
          onClose={() => setShowModalSub(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;