import React, { useRef } from 'react';

const ImageUpload = ({
  label,
  onChange,
  multiple = false,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (multiple) {
      onChange(Array.from(files));
    } else {
      onChange(files[0]);
    }
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor={`file-${label}`}
        className='block text-sm font-medium text-gray-700'
      >
        {label}
      </label>
      <div className='flex items-center space-x-2'>
        <input
          id={`file-${label}`}
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className='hidden'
        />
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
        >
          Choose File
        </button>
        <span className='text-sm text-gray-500'>
          {fileInputRef.current?.files?.[0]?.name || 'No file chosen'}
        </span>
      </div>
    </div>
  );
};

export default ImageUpload;
