// Cache validation and key management

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour

/**
 * Validates if a cached timestamp is still valid
 * @param {number} timestamp - The timestamp to validate
 * @returns {boolean} - True if cache is valid, false otherwise
 */
export const isCacheValid = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    return diff < CACHE_EXPIRATION;
};

/**
 * Cache keys for different data types
 */
export const CACHE_KEYS = {
    expenses: (workOrderId) => `expenses_${workOrderId}`,
    products: (workOrderId) => `products_${workOrderId}`,
    parts: (workOrderId) => `parts_${workOrderId}`,
    workOrder: (workOrderId) => `workorder_${workOrderId}`,
};
