export const filterItemsByRole = (items, role) => {
  return items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map(item => {
      if (item.items && item.items.length > 0) {
        return { ...item, items: filterItemsByRole(item.items, role) };
      }
      return item;
    });
};
