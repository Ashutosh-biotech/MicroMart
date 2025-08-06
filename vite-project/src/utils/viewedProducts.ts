// Utility to manage viewed products
export const viewedProductsUtil = {
  // Get viewed products from localStorage
  getViewedProducts: (): string[] => {
    try {
      const viewed = localStorage.getItem('viewedProducts');
      return viewed ? JSON.parse(viewed) : [];
    } catch {
      return [];
    }
  },

  // Add product to viewed list
  addViewedProduct: (productId: string): void => {
    try {
      const viewed = viewedProductsUtil.getViewedProducts();
      if (!viewed.includes(productId)) {
        viewed.unshift(productId); // Add to beginning
        // Keep only last 50 viewed products
        const limited = viewed.slice(0, 50);
        localStorage.setItem('viewedProducts', JSON.stringify(limited));
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  // Check if product was viewed
  isProductViewed: (productId: string): boolean => {
    try {
      return viewedProductsUtil.getViewedProducts().includes(productId);
    } catch {
      return false;
    }
  }
};