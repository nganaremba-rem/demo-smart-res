import React from 'react';
import Cart from './Cart';

const CartDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40'
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='h-full flex flex-col'>
          <div className='p-4 border-b flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Your Cart</h2>
            <button
              type='button'
              onClick={onClose}
              className='text-gray-400 hover:text-gray-500'
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

          <div className='flex-1 overflow-y-auto'>
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
