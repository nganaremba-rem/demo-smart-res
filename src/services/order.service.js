const Product = require('../models/Product');
const { BadRequestError } = require('../utils/errors');

const validateOrderItems = async (items, restaurant) => {
  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.productId,
      restaurantId: restaurant._id,
      'availability.isAvailable': true,
    });

    if (!product) {
      throw new BadRequestError(`Product ${item.productId} not available`);
    }

    // Validate quantity
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new BadRequestError('Invalid quantity');
    }

    // Check stock if applicable
    if (product.availability.stockCount !== undefined) {
      if (product.availability.stockCount < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`);
      }
    }

    // Validate customizations
    const validatedCustomizations = [];
    let customizationTotal = 0;

    if (item.customizations) {
      for (const customization of item.customizations) {
        const group = product.customization.find(
          (g) => g.name === customization.name
        );
        if (!group) {
          throw new BadRequestError(
            `Invalid customization group: ${customization.name}`
          );
        }

        const option = group.options.find(
          (o) => o.name === customization.option
        );
        if (!option || !option.isAvailable) {
          throw new BadRequestError(
            `Invalid or unavailable option: ${customization.option}`
          );
        }

        validatedCustomizations.push({
          name: customization.name,
          option: customization.option,
          price: option.price,
        });

        customizationTotal += option.price;
      }
    }

    const itemTotal =
      (product.discountedPrice || product.price + customizationTotal) *
      item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.discountedPrice || product.price,
      customizations: validatedCustomizations,
      subtotal: itemTotal,
    });
  }

  // Calculate pricing
  const tax = (subtotal * restaurant.settings.taxPercentage) / 100;
  const deliveryFee = calculateDeliveryFee(restaurant); // Implement based on your logic
  const total = subtotal + tax + deliveryFee;

  return {
    validatedItems,
    pricing: {
      subtotal,
      tax,
      deliveryFee,
      total,
    },
  };
};

const calculateDeliveryFee = (restaurant) => {
  // Implement your delivery fee calculation logic
  return restaurant.settings.deliveryFee || 0;
};

module.exports = {
  validateOrderItems,
};
