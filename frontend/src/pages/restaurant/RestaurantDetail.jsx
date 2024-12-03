import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '../../api/restaurant';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RestaurantDetail = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        const [restaurantRes, menuRes] = await Promise.all([
          restaurantApi.getRestaurantBySlug(slug),
          restaurantApi.getRestaurantMenu(slug),
        ]);

        setRestaurant(restaurantRes.data.data.restaurant);
        setMenu({
          categories: menuRes.data.data.categories,
          products: menuRes.data.data.products,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load restaurant details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-red-500 text-center'>{error}</div>;
  if (!restaurant) return null;

  const filteredProducts =
    selectedCategory === 'all'
      ? menu.products
      : menu.products.filter(
          (product) => product.categoryId === selectedCategory
        );

  return (
    <div>
      {/* Restaurant Header */}
      <div className='relative h-64 mb-8'>
        <img
          src={restaurant.coverImage || restaurant.imageUrl}
          alt={restaurant.name}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='text-center text-white'>
            <h1 className='text-4xl font-bold mb-2'>{restaurant.name}</h1>
            <p className='text-lg'>{restaurant.description}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className='flex overflow-x-auto space-x-4 mb-6 pb-2'>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          type='button'
        >
          All
        </button>
        {menu.categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            type='button'
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
