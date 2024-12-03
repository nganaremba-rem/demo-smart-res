import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderById(id);
        setOrder(response.data.data.order);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch order details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-red-500 text-center'>{error}</div>;
  if (!order) return null;

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='bg-white rounded-lg shadow'>
        {/* Order Header */}
        <div className='p-6 border-b'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>Order #{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className='text-gray-600'>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Order Items */}
        <div className='p-6 border-b'>
          <h2 className='text-lg font-semibold mb-4'>Order Items</h2>
          <div className='space-y-4'>
            {order.items.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={index} className='flex justify-between'>
                <div>
                  <p className='font-medium'>
                    {item.quantity}x {item.name}
                  </p>
                  {item.customizations?.map((customization, idx) => (
                    <p
                      key={`${customization.name}-${idx}`}
                      className='text-sm text-gray-500'
                    >
                      {customization.name}: {customization.option}
                    </p>
                  ))}
                </div>
                <p className='font-medium'>₹{item.subtotal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className='p-6 border-b'>
          <h2 className='text-lg font-semibold mb-4'>Delivery Details</h2>
          <p className='font-medium'>Delivery Address:</p>
          <p className='text-gray-600 mb-2'>{order.delivery.address.address}</p>
          {order.delivery.instructions && (
            <>
              <p className='font-medium'>Instructions:</p>
              <p className='text-gray-600'>{order.delivery.instructions}</p>
            </>
          )}
        </div>

        {/* Payment Details */}
        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Payment Summary</h2>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>₹{order.pricing.subtotal}</span>
            </div>
            <div className='flex justify-between'>
              <span>Tax</span>
              <span>₹{order.pricing.tax}</span>
            </div>
            <div className='flex justify-between'>
              <span>Delivery Fee</span>
              <span>₹{order.pricing.deliveryFee}</span>
            </div>
            <div className='flex justify-between font-bold pt-2 border-t'>
              <span>Total</span>
              <span>₹{order.pricing.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className='mt-6 bg-white rounded-lg shadow p-6'>
        <h2 className='text-lg font-semibold mb-4'>Order Timeline</h2>
        <div className='space-y-4'>
          {order.statusHistory.map((status, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className='flex items-start'>
              <div className='w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0' />
              <div className='ml-4'>
                <p className='font-medium'>
                  {status.status.replace(/_/g, ' ')}
                </p>
                <p className='text-sm text-gray-500'>
                  {new Date(status.timestamp).toLocaleString()}
                </p>
                {status.note && (
                  <p className='text-sm text-gray-600 mt-1'>{status.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
