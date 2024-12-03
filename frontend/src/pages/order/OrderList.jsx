import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api/order';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    READY: 'bg-green-100 text-green-800',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${statusColors[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getAllOrders();
        setOrders(response.data.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-red-500 text-center'>{error}</div>;

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Orders</h1>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Order ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {order.orderNumber}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {order.userId.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  ₹{order.pricing.total}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, e.target.value)
                    }
                    className='rounded border-gray-300'
                  >
                    <option value='PENDING'>Pending</option>
                    <option value='CONFIRMED'>Confirmed</option>
                    <option value='PREPARING'>Preparing</option>
                    <option value='READY'>Ready</option>
                    <option value='OUT_FOR_DELIVERY'>Out for Delivery</option>
                    <option value='DELIVERED'>Delivered</option>
                    <option value='CANCELLED'>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
