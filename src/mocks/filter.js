const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const generateFilters = (obj) => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: obj[it] || 0,
    };
  });
};

export {generateFilters};
