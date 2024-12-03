import React, { useState, useEffect } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { useCategory } from '../../hooks/useCategory';
import ProductCard from '../../components/product/ProductCard';
import ProductForm from '../../components/product/ProductForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getProducts, loading, error } = useProduct();
  const { getCategories } = useCategory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [getProducts, getCategories]);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowAddForm(false);
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className='text-red-500 text-center'>{error}</div>;

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <button
          type='button'
          onClick={() => setShowAddForm(!showAddForm)}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div className='mb-8'>
          <ProductForm onSuccess={handleProductAdded} />
        </div>
      )}

      <div className='flex overflow-x-auto space-x-4 mb-6 pb-2'>
        <button
          type='button'
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type='button'
            onClick={() => setSelectedCategory(category._id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
