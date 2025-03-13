/**
 * Filters menu items based on user role
 * @param {Array} menuItems - Array of menu items
 * @param {String} userRole - User role
 * @returns {Array} - Filtered menu items
 */
export const filterMenuItemsByRole = (menuItems, userRole) => {
  if (!menuItems || !userRole) return [];

  return menuItems.map((item) => {
    // If item has renderFor property, check if user role is included
    if (item.renderFor && !item.renderFor.includes(userRole)) {
      return null;
    }

    // If item has children, recursively filter them
    if (item.children) {
      const filteredChildren = filterMenuItemsByRole(item.children, userRole).filter(Boolean);
      
      // If all children are filtered out, don't render the parent
      if (filteredChildren.length === 0) {
        return null;
      }
      
      return {
        ...item,
        children: filteredChildren
      };
    }

    return item;
  }).filter(Boolean); // Remove null items
}; 