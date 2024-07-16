import React, { useState, useEffect } from 'react';

const AddCategory = ({ fetchCategories, categories = [], categoryToEdit }) => {
  const initialCategoryState = {
    name: '',
    parent: '', // Initialize as an empty string
    isActive: true,
    showInNavbar: false,
  };

  const [category, setCategory] = useState(initialCategoryState);

  useEffect(() => {
    if (categoryToEdit) {
      setCategory({
        ...categoryToEdit,
        parent: categoryToEdit.parent || '', // Ensure parent is an empty string if null
      });
    } else {
      setCategory(initialCategoryState);
    }
  // eslint-disable-next-line
  }, [categoryToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove 'parent' field from category if it's an empty string
      const categoryData = {
        ...category,
        parent: category.parent || null, // Set parent to null if it's an empty string
      };

      let url = 'http://localhost:5000/categories';
      let method = 'POST';

      if (categoryToEdit) {
        url += `/${categoryToEdit._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        if (categoryToEdit) {
          alert('Category updated successfully!');
        } else {
          alert('Category added successfully!');
        }
        fetchCategories(); // Refresh categories after adding or updating
        setCategory(initialCategoryState); // Reset form state
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add or update category');
      }
    } catch (error) {
      console.error('Error adding or updating category:', error.message);
      // Handle error state or show error to the user
    }
  };

  return (
    <div className="add-category">
      <h2>{categoryToEdit ? 'Edit Category' : 'Add Category'}</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-start gap-3">
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          className='px-2'
        />
        <select
          name="parent"
          value={category.parent || ''} // Ensure value is an empty string if null
          onChange={handleChange}
          className='px-2'
        >
          <option value=''>No Parent</option>
          {categories.length > 0 && categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div>
          <label>
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={category.isActive}
              onChange={handleChange}
            />
          </label>
          <label>
            Show in Navbar:
            <input
              type="checkbox"
              name="showInNavbar"
              checked={category.showInNavbar}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className='btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500'>
          {categoryToEdit ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;