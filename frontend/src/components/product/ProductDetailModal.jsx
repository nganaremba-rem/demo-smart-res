import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const { addItem } = useCart();

  if (!isOpen || !product) return null;

  const handleCustomizationChange = (groupName, option) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [groupName]: option,
    }));
  };

  const handleAddToCart = () => {
    const customizations = Object.entries(selectedCustomizations).map(
      ([name, option]) => ({
        name,
        option: option.name,
        price: option.price,
      })
    );

    addItem(product, quantity, customizations);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40'
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role='button'
        tabIndex={0}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full'>
            {/* Header */}
            <div className='relative'>
              <img
                src={
                  product.images.find((img) => img.isPrimary)?.url ||
                  product.images[0]?.url
                }
                alt={product.name}
                className='w-full h-64 object-cover rounded-t-lg'
              />
              <button
                type='button'
                onClick={onClose}
                className='absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75'
              >
                <span className='sr-only'>Close</span>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-2'>{product.name}</h2>
              <p className='text-gray-600 mb-4'>{product.description.long}</p>

              {/* Price */}
              <div className='flex items-center space-x-2 mb-6'>
                {product.discountedPrice ? (
                  <>
                    <span className='text-2xl font-bold'>
                      ₹{product.discountedPrice}
                    </span>
                    <span className='text-gray-500 line-through'>
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className='text-2xl font-bold'>₹{product.price}</span>
                )}
              </div>

              {/* Customizations */}
              {product.customization?.map((group) => (
                <div key={group.name} className='mb-6'>
                  <h3 className='font-medium mb-2'>
                    {group.name}{' '}
                    {group.required && <span className='text-red-500'>*</span>}
                  </h3>
                  <div className='space-y-2'>
                    {group.options.map((option) => (
                      <label
                        key={option.name}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type={group.multiple ? 'checkbox' : 'radio'}
                          name={group.name}
                          checked={
                            selectedCustomizations[group.name]?.name ===
                            option.name
                          }
                          onChange={() =>
                            handleCustomizationChange(group.name, option)
                          }
                          required={group.required}
                          className='text-blue-500'
                        />
                        <span>{option.name}</span>
                        {option.price > 0 && (
                          <span className='text-gray-500'>
                            +₹{option.price}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className='flex items-center space-x-4 mb-6'>
                <span className='font-medium'>Quantity:</span>
                <div className='flex items-center space-x-2'>
                  <button
                    type='button'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='p-1 rounded-full hover:bg-gray-100'
                  >
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M20 12H4'
                      />
                    </svg>
                  </button>
                  <span className='w-8 text-center'>{quantity}</span>
                  <button
                    type='button'
                    onClick={() => setQuantity(quantity + 1)}
                    className='p-1 rounded-full hover:bg-gray-100'
                  >
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v12M6 12h12'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type='button'
                onClick={handleAddToCart}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailModal;
