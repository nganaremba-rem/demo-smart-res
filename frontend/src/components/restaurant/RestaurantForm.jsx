import React, { useState } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import ImageUpload from '../common/ImageUpload';

const RestaurantForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    logo: null,
    coverImage: null,
    contact: {
      email: '',
      phone: '',
      address: '',
    },
  });

  const { createRestaurant, loading, error } = useRestaurant();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'contact') {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] instanceof File) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await createRestaurant(data);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create restaurant:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label>Name</label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      <ImageUpload
        label='Restaurant Image'
        onChange={(file) =>
          setFormData((prev) => ({
            ...prev,
            image: file,
          }))
        }
      />

      {error && <div className='text-red-500'>{error}</div>}

      <button
        type='submit'
        disabled={loading}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        {loading ? 'Creating...' : 'Create Restaurant'}
      </button>
    </form>
  );
};

export default RestaurantForm;
