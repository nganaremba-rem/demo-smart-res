import React from 'react';

const ProductCard = ({ product }) => {
  const {
    name,
    description,
    images,
    price,
    discountedPrice,
    attributes,
    availability,
  } = product;

  const primaryImage =
    images.find((img) => img.isPrimary)?.url || images[0]?.url;

  return (
    <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      <div className='relative h-48'>
        <img
          src={primaryImage}
          alt={name}
          className='w-full h-full object-cover'
        />
        {!availability.isAvailable && (
          <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm'>
            Not Available
          </div>
        )}
        {attributes.isVeg && (
          <div className='absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full'>
            <span className='sr-only'>Vegetarian</span>
            <div className='w-4 h-4' />
          </div>
        )}
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold'>{name}</h3>
        <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
          {description.short}
        </p>
        <div className='mt-2 flex items-center space-x-2'>
          {discountedPrice ? (
            <>
              <span className='text-lg font-bold'>₹{discountedPrice}</span>
              <span className='text-gray-500 line-through'>₹{price}</span>
            </>
          ) : (
            <span className='text-lg font-bold'>₹{price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
