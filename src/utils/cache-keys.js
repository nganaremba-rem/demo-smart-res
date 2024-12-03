const cacheKey = {
  restaurant: (id) => `restaurant:${id}`,
  restaurantMenu: (id) => `restaurant:${id}:menu`,
  allRestaurants: () => 'restaurants:all',
  category: (id) => `category:${id}`,
  product: (id) => `product:${id}`,
  order: (id) => `order:${id}`,
};

module.exports = { cacheKey };
