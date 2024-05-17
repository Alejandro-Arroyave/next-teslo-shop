export const generatePaginationNUmbers = (
  currentPage: number,
  totalPages: number
) => {
  // If totalPages <= 7, will show all pages without points
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If currentPage <= 3, show 3 then '...' and the last 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]; // [1, 2, 3, '...', 9, 10]
  }

  // If currentPage >= totalPages - 2, show 2 then '...' and the last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]; // [1, 2, '...', 8, 9, 10]
  }

  // If currentPage is not in above cases, show first page then '...'
  // then currentPage with previous and next and finally last page
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ]; // [1, '...', 4, 5, 6, '...', 9, 10]
};
