// ViewCategories.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewCategories = ({ categories, fetchCategories }) => {
  const navigate = useNavigate();

  const handleEdit = (category) => {
    navigate(`/admin/categories/edit/${category._id}`, { state: { category } });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/categories/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Category deleted successfully');
          fetchCategories();
        } else {
          if (response.status === 404) {
            alert('Category not found');
          } else {
            console.error('Failed to delete category');
          }
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="w-100">
      <h2 className="mb-4">View Categories</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Active</th>
              <th>Show in Navbar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.parent ? cat.parent.name : '-'}</td>
                <td>{cat.isActive ? 'Yes' : 'No'}</td>
                <td>{cat.showInNavbar ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(cat)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCategories;