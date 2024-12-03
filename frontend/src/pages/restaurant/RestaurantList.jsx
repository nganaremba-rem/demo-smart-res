import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { getRestaurants, loading, error } = useRestaurant();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };

    fetchRestaurants();
  }, [getRestaurants]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-red-500 text-center'>{error}</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Restaurants</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
