import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addItem = useCallback(
    (product, quantity = 1, customizations = []) => {
      setItems((prevItems) => {
        // If adding from a different restaurant, clear cart first
        if (restaurantId && product.restaurantId !== restaurantId) {
          if (
            !window.confirm(
              'Adding items from a different restaurant will clear your current cart. Continue?'
            )
          ) {
            return prevItems;
          }
          setRestaurantId(product.restaurantId);
          return [
            {
              product,
              quantity,
              customizations,
              subtotal: calculateSubtotal(product, quantity, customizations),
            },
          ];
        }

        // Set restaurant ID if cart is empty
        if (!restaurantId) {
          setRestaurantId(product.restaurantId);
        }

        // Check if item already exists
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.product._id === product._id &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations)
        );

        if (existingItemIndex > -1) {
          return prevItems.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: calculateSubtotal(
                    product,
                    item.quantity + quantity,
                    customizations
                  ),
                }
              : item
          );
        }

        return [
          ...prevItems,
          {
            product,
            quantity,
            customizations,
            subtotal: calculateSubtotal(product, quantity, customizations),
          },
        ];
      });
    },
    [restaurantId]
  );

  const removeItem = useCallback((productId, customizations = []) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) =>
          !(
            item.product._id === productId &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations)
          )
      );
      if (newItems.length === 0) {
        setRestaurantId(null);
      }
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity, customizations = []) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === productId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
            ? {
                ...item,
                quantity,
                subtotal: calculateSubtotal(
                  item.product,
                  quantity,
                  customizations
                ),
              }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
  }, []);

  const calculateSubtotal = (product, quantity, customizations) => {
    const basePrice = product.discountedPrice || product.price;
    const customizationsTotal = customizations.reduce(
      (total, customization) => total + (customization.price || 0),
      0
    );
    return (basePrice + customizationsTotal) * quantity;
  };

  const cartTotal = items.reduce((total, item) => total + item.subtotal, 0);

  const value = {
    items,
    restaurantId,
    cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
