import React, { useState } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';
import SettingsService from '../../services/SettingsService';

const Settings = () => {
  const [settings, setSettings] = useState({
    deliveryFee: 40,
    taxRate: 5,
    minOrderAmount: 100,
    maxDeliveryDistance: 10,
  });

  const { startLoading, stopLoading } = useLoading();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Saving settings...');
      await SettingsService.update(settings);
      addToast('Settings updated successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Platform Settings</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-6 bg-white rounded-lg shadow p-6'
      >
        <div>
          <label
            htmlFor='deliveryFee'
            className='block text-sm font-medium text-gray-700'
          >
            Delivery Fee (₹)
          </label>
          <input
            type='number'
            id='deliveryFee'
            value={settings.deliveryFee}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                deliveryFee: Number(e.target.value),
              }))
            }
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='taxRate'
            className='block text-sm font-medium text-gray-700'
          >
            Tax Rate (%)
          </label>
          <input
            type='number'
            id='taxRate'
            value={settings.taxRate}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                taxRate: Number(e.target.value),
              }))
            }
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='minOrderAmount'
            className='block text-sm font-medium text-gray-700'
          >
            Minimum Order Amount (₹)
          </label>
          <input
            type='number'
            id='minOrderAmount'
            value={settings.minOrderAmount}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                minOrderAmount: Number(e.target.value),
              }))
            }
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='maxDeliveryDistance'
            className='block text-sm font-medium text-gray-700'
          >
            Maximum Delivery Distance (km)
          </label>
          <input
            type='number'
            id='maxDeliveryDistance'
            value={settings.maxDeliveryDistance}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                maxDeliveryDistance: Number(e.target.value),
              }))
            }
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
