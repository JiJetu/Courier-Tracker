export const calculatePagination = (
  totalItems: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return [...Array(totalPages).keys()].map((i) => i + 1);
};
