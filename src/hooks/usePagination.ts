import { useState } from "react";

export const usePagination = (itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = (items: any[]) => {
    return items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
  };
};
