import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './AdminPanel.css';
import AddCategory from './Categories/AddCategory';
import ViewCategories from './Categories/ViewCategories';
import ProductForm from './ProductForm/ProductForm';
import ViewProducts from './ViewProduct/ViewProduct';
import { getAllProducts, getParentCategories, getChildCategories } from '../Services/api';

const AdminPanel = ({ activeTab: initialTab }) => {
  const [products, setProducts] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const { productId, categoryId } = useParams();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (parentCategories.length === 0) fetchParentCategories();
    if (childCategories.length === 0) fetchChildCategories();

    if (productId) {
      setActiveTab('editProduct');
    } else if (categoryId) {
      if (categoryId.startsWith('p')) {
        setActiveTab('editParentCategory');
      } else {
        setActiveTab('editChildCategory');
      }
    }
  }, [productId, categoryId, products.length, parentCategories.length, childCategories.length]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const data = await getParentCategories();
      setParentCategories(data);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const fetchChildCategories = async () => {
    try {
      const data = await getChildCategories();
      setChildCategories(data);
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  };

  return (
    <div>
      {activeTab === 'addProduct' && (
        <ProductForm fetchProducts={fetchProducts} />
      )}
      {activeTab === 'editProduct' && (
        <ProductForm fetchProducts={fetchProducts} productId={productId} />
      )}
      {activeTab === 'viewProducts' && (
        <ViewProducts products={products} fetchProducts={fetchProducts} />
      )}
      {activeTab === 'addParentCategory' && (
        <AddCategory fetchCategories={fetchParentCategories} />
      )}
      {activeTab === 'editParentCategory' && (
        <AddCategory fetchCategories={fetchParentCategories} categoryToEdit={location.state?.category} />
      )}
      {activeTab === 'viewParentCategories' && (
        <ViewCategories
          categories={parentCategories}
          fetchCategories={fetchParentCategories}
        />
      )}
      {activeTab === 'addChildCategory' && (
        <AddCategory fetchCategories={fetchChildCategories} />
      )}
      {activeTab === 'editChildCategory' && (
        <AddCategory fetchCategories={fetchChildCategories} categoryToEdit={location.state?.category} />
      )}
      {activeTab === 'viewChildCategories' && (
        <ViewCategories
          categories={childCategories}
          fetchCategories={fetchChildCategories}
        />
      )}
    </div>
  );
};

export default AdminPanel;