import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import './ProductForm.css'

const ProductForm = ({ fetchProducts }) => {
  const { childCategories, parentCategories } = useContext(ShopContext);
  const [product, setProduct] = useState({
    id: '',
    itemName: '',
    newPrice: '',
    oldPrice: '',
    category: '',
    isPopular: false,
    tags: [],
    shortDescription: '',
    fullDescription: '',
    stockStatus: 'In Stock',
    variants: [],
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState('addProduct');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
      setActiveTab('editProduct');
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [name]: type === 'checkbox' ? checked : value,
      };
      return { ...prevProduct, variants: updatedVariants };
    });
  };

  const handleVariantImageChange = (index, e, field) => {
    const files = e.target.files;
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index][field] = field === 'gallery' ? [...files] : files[0];
      return { ...prevProduct, variants: updatedVariants };
    });
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    setGallery([...e.target.files]);
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: [value], // Store the selected value in an array
    }));
  };

  const resetForm = () => {
    setProduct({
      id: '',
      itemName: '',
      newPrice: '',
      oldPrice: '',
      category: '',
      isPopular: false,
      tags: [],
      shortDescription: '',
      fullDescription: '',
      stockStatus: 'In Stock',
      variants: [],
    });
    setFeaturedImage(null);
    setGallery([]);
    const fileInput = document.getElementById('productImage');
    if (fileInput) {
      fileInput.value = null;
    }
    const galleryInput = document.getElementById('productGallery');
    if (galleryInput) {
      galleryInput.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('itemName', product.itemName);
    formData.append('newPrice', product.newPrice);
    formData.append('oldPrice', product.oldPrice);
    formData.append('category', product.category);
    formData.append('isPopular', product.isPopular);
    formData.append('shortDescription', product.shortDescription);
    formData.append('fullDescription', product.fullDescription);
    formData.append('stockStatus', product.stockStatus);
    product.tags.forEach(tag => formData.append('tags', tag));
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }
    gallery.forEach((image, index) => {
      formData.append(`gallery`, image);
    });
    if (product.variants) {
      product.variants.forEach((variant, index) => {
        for (const key in variant) {
          if (key === 'gallery') {
            variant[key].forEach((image, i) => {
              formData.append(`variants[${index}][gallery][${i}]`, image);
            });
          } else {
            formData.append(`variants[${index}][${key}]`, variant[key]);
          }
        }
      });
    }

    try {
      let response;
      if (activeTab === 'editProduct') {
        response = await fetch(`http://localhost:5000/products/${product._id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:5000/products/add', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        resetForm();
        fetchProducts();
        navigate('/admin');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit form', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setGallery((prevGallery) => [...prevGallery, ...files]);
  };

  return (
    <div className="w-100">
      <h2 className="mb-4">{activeTab === 'addProduct' ? 'Add Product' : 'Edit Product'}</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        <div className="">
          <input
            name="id"
            value={product.id}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="ID"
          />
          <input
            name="itemName"
            value={product.itemName}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="Item Name"
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="newPrice"
            value={product.newPrice}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="New Price"
            required
          />
          <input
            type="number"
            name="oldPrice"
            value={product.oldPrice}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="Old Price"
          />
        </div>
        <div>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            required
          >
            <option value="">Select Category</option>
            {childCategories.map((child) => (
              <option key={child._id} value={child._id}>
                {`${child.name} (${child.parents.map(parent => parent.name).join(', ')})`}
              </option>
            ))}
          </select>
          <div className="mt-3">
            <div>
              <label htmlFor="productImage">Featured Image</label>
              <input type="file" id="productImage" onChange={handleImageChange} className="" />
            </div>
            <div className='mt-3'>
              <label htmlFor="productGallery">Gallery Images</label>
              <div
                className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input type="file" id="productGallery" onChange={handleGalleryChange} className="file-input" multiple />
                <p>Drag & drop files here, or click to select files</p>
              </div>
              <div className="gallery-preview mt-3">
                {gallery.map((file, index) => (
                  <div key={index} className="gallery-item">
                    <img src={URL.createObjectURL(file)} alt={`gallery-${index}`} className="gallery-image" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPopular"
            name="isPopular"
            checked={product.isPopular}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isPopular">
            Popular Product
          </label>
        </div>
        <div>
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="Short Description"
            required
          />
        </div>
        <div>
          <label htmlFor="fullDescription">Full Description</label>
          <textarea
            name="fullDescription"
            value={product.fullDescription}
            onChange={handleChange}
            className="px-3 py-1 me-3"
            placeholder="Full Description"
            required
          />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <select
            name="tags"
            value={product.tags[0] || ''} // Ensure this is a single value
            onChange={handleTagsChange}
            className="px-3 py-1 me-3"
          >
            <option value="">Select Tag</option>
            <option value="best seller white">Best Seller White</option>
            <option value="best seller black">Best Seller Black</option>
            <option value="new white">New White</option>
            <option value="new black">New Black</option>
          </select>
        </div>

        <div>
          <label htmlFor="stockStatus">Stock Status</label>
          <select
            name="stockStatus"
            value={product.stockStatus}
            onChange={handleChange}
            className="px-3 py-1 me-3"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out Of Stock">Out Of Stock</option>
          </select>
        </div>
        <h4>Variants</h4>
        {product.variants.map((variant, index) => (
          <div key={index} className="mb-4">
            <h5>Variant {index + 1}</h5>
            <input
              name="size"
              value={variant.size}
              onChange={(e) => handleVariantChange(index, e)}
              className="px-3 py-1 me-3"
              placeholder="Size"
            />
            <input
              name="color"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, e)}
              className="px-3 py-1 me-3"
              placeholder="Color"
            />
            <input
              name="newPrice"
              value={variant.newPrice}
              onChange={(e) => handleVariantChange(index, e)}
              className="px-3 py-1 me-3"
              placeholder="New Price"
              type="number"
            />
            <input
              name="oldPrice"
              value={variant.oldPrice}
              onChange={(e) => handleVariantChange(index, e)}
              className="px-3 py-1 me-3"
              placeholder="Old Price"
              type="number"
            />
            <input
              name="quantity"
              value={variant.quantity}
              onChange={(e) => handleVariantChange(index, e)}
              className="px-3 py-1 me-3"
              placeholder="Quantity"
              type="number"
              required
            />
            <input
              type="file"
              onChange={(e) => handleVariantImageChange(index, e, 'featuredImage')}
              className=""
            />
            <input
              type="file"
              onChange={(e) => handleVariantImageChange(index, e, 'gallery')}
              className=""
              multiple
            />
          </div>
        ))}
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                variants: [
                  ...prevProduct.variants,
                  {
                    size: '',
                    color: '',
                    newPrice: 0,
                    oldPrice: 0,
                    quantity: 0,
                    featuredImage: '',
                    gallery: [],
                  },
                ],
              }))
            }
          >
            Add Variant
          </button>
        </div>
        <div>
          <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500">
            {activeTab === 'editProduct' ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;