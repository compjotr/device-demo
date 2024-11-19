import { useState } from "react";

export const usePagination = <Device>(itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = (items: Device[]) => {
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
