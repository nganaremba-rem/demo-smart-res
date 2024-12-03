import React, { useState } from 'react';
import { useProduct } from '../../hooks/useProduct';
import ImageUpload from '../common/ImageUpload';

const ProductForm = ({ restaurantId, categoryId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: {
      short: '',
      long: '',
    },
    price: '',
    discountedPrice: '',
    attributes: {
      isVeg: false,
      spiceLevel: 'MEDIUM',
      allergens: [],
      calories: '',
      preparationTime: '',
    },
    availability: {
      isAvailable: true,
      stockCount: '',
      startTime: '',
      endTime: '',
      days: [],
    },
  });

  const [images, setImages] = useState([]);
  const { createProduct, loading, error } = useProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append basic fields
    data.append('name', formData.name);
    data.append('description', JSON.stringify(formData.description));
    data.append('price', formData.price);
    data.append('restaurantId', restaurantId);
    data.append('categoryId', categoryId);

    // Append images
    for (const image of images) {
      data.append('images', image);
    }

    // Append complex objects
    data.append('attributes', JSON.stringify(formData.attributes));
    data.append('availability', JSON.stringify(formData.availability));

    try {
      await createProduct(data);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'
        >
          Name
        </label>
        <input
          id='name'
          type='text'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        />
      </div>

      <ImageUpload label='Product Images' onChange={setImages} multiple />

      {error && <div className='text-red-500'>{error}</div>}

      <button
        type='submit'
        disabled={loading}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;
