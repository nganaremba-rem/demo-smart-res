import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { items, cartTotal, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className='p-4 text-center'>
        <p className='text-gray-500'>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className='space-y-4'>
        {items.map((item) => (
          <div
            key={`${item.product._id}-${JSON.stringify(item.customizations)}`}
            className='flex justify-between items-center border-b pb-4'
          >
            <div className='flex-1'>
              <h3 className='font-medium'>{item.product.name}</h3>
              {item.customizations.map((customization, index) => (
                <p key={index} className='text-sm text-gray-500'>
                  {customization.name}: {customization.option}
                </p>
              ))}
              <div className='flex items-center mt-2'>
                <button
                  type='button'
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      Math.max(0, item.quantity - 1),
                      item.customizations
                    )
                  }
                  className='text-gray-500 hover:text-gray-700'
                >
                  -
                </button>
                <span className='mx-2'>{item.quantity}</span>
                <button
                  type='button'
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity + 1,
                      item.customizations
                    )
                  }
                  className='text-gray-500 hover:text-gray-700'
                >
                  +
                </button>
              </div>
            </div>
            <div className='text-right'>
              <p className='font-medium'>₹{item.subtotal}</p>
              <button
                type='button'
                onClick={() =>
                  removeItem(item.product._id, item.customizations)
                }
                className='text-red-500 text-sm hover:text-red-700'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 space-y-4'>
        <div className='flex justify-between font-medium'>
          <span>Total</span>
          <span>₹{cartTotal}</span>
        </div>

        <div className='space-y-2'>
          <button
            type='button'
            onClick={handleCheckout}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
          >
            Proceed to Checkout
          </button>
          <button
            type='button'
            onClick={clearCart}
            className='w-full text-red-500 py-2 px-4 rounded border border-red-500 hover:bg-red-50'
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
