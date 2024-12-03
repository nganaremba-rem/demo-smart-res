import React, { useState, useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useApiErrorHandler } from '../../utils/apiErrorHandler';
import RestaurantService from '../../services/RestaurantService';
import OrderService from '../../services/OrderService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    activeRestaurants: 0,
    orders: 0,
    revenue: 0,
  });

  const { startLoading, stopLoading } = useLoading();
  const handleError = useApiErrorHandler();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchStats = async () => {
      try {
        startLoading('Loading dashboard...');
        const [restaurants, orders] = await Promise.all([
          RestaurantService.get(),
          OrderService.get(),
        ]);

        setStats({
          restaurants: restaurants.length,
          activeRestaurants: restaurants.filter((r) => r.settings.isActive)
            .length,
          orders: orders.length,
          revenue: orders.reduce(
            (total, order) => total + order.pricing.total,
            0
          ),
        });
      } catch (error) {
        handleError(error);
      } finally {
        stopLoading();
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Restaurants'
          value={stats.restaurants}
          icon='🏪'
        />
        <StatCard
          title='Active Restaurants'
          value={stats.activeRestaurants}
          icon='✅'
        />
        <StatCard title='Total Orders' value={stats.orders} icon='📦' />
        <StatCard
          title='Total Revenue'
          value={`₹${stats.revenue.toFixed(2)}`}
          icon='💰'
        />
      </div>

      {/* Add more dashboard components here */}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className='bg-white rounded-lg shadow p-6'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <p className='text-2xl font-bold mt-1'>{value}</p>
      </div>
      <span className='text-3xl'>{icon}</span>
    </div>
  </div>
);

export default Dashboard;
