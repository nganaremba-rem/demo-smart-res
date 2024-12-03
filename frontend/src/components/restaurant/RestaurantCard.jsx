import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const {
    slug,
    name,
    description,
    imageUrl,
    settings: { isActive, acceptingOrders },
  } = restaurant;

  return (
    <Link to={`/restaurants/${slug}`} className='block'>
      <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
        <div className='relative h-48'>
          <img
            src={imageUrl}
            alt={name}
            className='w-full h-full object-cover'
          />
          {!isActive && (
            <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm'>
              Closed
            </div>
          )}
          {!acceptingOrders && (
            <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm'>
              Not Accepting Orders
            </div>
          )}
        </div>
        <div className='p-4'>
          <h3 className='text-lg font-semibold'>{name}</h3>
          <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
