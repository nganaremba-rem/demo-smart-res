import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../api/order';

const Checkout = () => {
  const { items, cartTotal, clearCart, restaurantId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: {
      type: 'HOME',
      address: user?.address || '',
      coordinates: {
        latitude: '',
        longitude: '',
      },
    },
    instructions: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        restaurantId,
        items: items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          customizations: item.customizations,
          subtotal: item.subtotal,
        })),
        delivery: deliveryInfo,
        payment: {
          method: 'CASH',
          status: 'PENDING',
          amount: cartTotal,
        },
        pricing: {
          subtotal: cartTotal,
          tax: cartTotal * 0.05, // 5% tax
          deliveryFee: 40, // Fixed delivery fee
          total: cartTotal * 1.05 + 40, // Subtotal + tax + delivery fee
        },
      };

      const response = await orderApi.createOrder(orderData);
      clearCart();
      navigate(`/orders/${response.data.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

      <div className='bg-white rounded-lg shadow p-6 mb-6'>
        <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
        <div className='space-y-4'>
          {items.map((item) => (
            <div
              key={`${item.product._id}-${JSON.stringify(item.customizations)}`}
              className='flex justify-between'
            >
              <div>
                <p className='font-medium'>
                  {item.quantity}x {item.product.name}
                </p>
                {item.customizations.map((customization) => (
                  <p key={customization.name} className='text-sm text-gray-500'>
                    {customization.name}: {customization.option}
                  </p>
                ))}
              </div>
              <p className='font-medium'>₹{item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className='border-t mt-4 pt-4 space-y-2'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className='flex justify-between'>
            <span>Tax (5%)</span>
            <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>
          <div className='flex justify-between font-bold'>
            <span>Total</span>
            <span>₹{(cartTotal * 1.05 + 40).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='address'
            className='block text-sm font-medium text-gray-700'
          >
            Delivery Address
          </label>
          <textarea
            id='address'
            value={deliveryInfo.address.address}
            onChange={(e) =>
              setDeliveryInfo((prev) => ({
                ...prev,
                address: { ...prev.address, address: e.target.value },
              }))
            }
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            rows={3}
          />
        </div>

        <div>
          <label
            htmlFor='instructions'
            className='block text-sm font-medium text-gray-700'
          >
            Delivery Instructions (Optional)
          </label>
          <textarea
            id='instructions'
            value={deliveryInfo.instructions}
            onChange={(e) =>
              setDeliveryInfo((prev) => ({
                ...prev,
                instructions: e.target.value,
              }))
            }
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            rows={2}
          />
        </div>

        {error && <div className='text-red-500 text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
