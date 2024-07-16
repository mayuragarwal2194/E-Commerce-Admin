import React from 'react';

const ProductTable = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Product Image</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className='vertical-align-middle'>
              <td>{prod.id}</td>
              <td>{prod.itemName}</td>
              <td>
                <img
                  src={`http://localhost:5000${prod.image}`}
                  alt={prod.itemName}
                  className='item-image object-cover'
                  width={'50px'}
                  height={'50px'}
                />
              </td>
              <td>${prod.new_price}</td>
              <td>${prod.old_price}</td>
              <td>{prod.category}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(prod)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;