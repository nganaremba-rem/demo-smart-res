import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  ...props
}) => {
  const inputClasses = `mt-1 block w-full rounded-md shadow-sm
    ${
      error && touched
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }`;

  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className='mt-1'>
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClasses}
            {...props}
          />
        )}
      </div>
      {error && touched && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export default FormInput;
