import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200/60 rounded-b-xl shadow-sm">
        <div className="flex-1 flex justify-between sm:hidden">
          <span className="text-sm text-gray-700 font-medium">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-bold text-blue-600">{startItem}</span> até{' '}
              <span className="font-bold text-blue-600">{endItem}</span> de{' '}
              <span className="font-bold text-blue-600">{totalItems}</span> resultado{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200/60 rounded-b-xl shadow-sm">
      {/* Mobile */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-nav"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700 flex items-center font-medium">
          Página <span className="font-bold text-blue-600 mx-1">{currentPage}</span> de <span className="font-bold text-blue-600 ml-1">{totalPages}</span>
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-nav ml-3"
        >
          Próxima
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-6">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-bold text-blue-600">{startItem}</span> até{' '}
            <span className="font-bold text-blue-600">{endItem}</span> de{' '}
            <span className="font-bold text-blue-600">{totalItems}</span> resultado{totalItems !== 1 ? 's' : ''}
          </p>
          
          {onItemsPerPageChange && (
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-700 font-medium">Itens por página:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-xl shadow-md bg-white border border-gray-200" aria-label="Pagination">
            {/* Primeira página */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="btn-nav border-r border-gray-200"
            >
              <span className="sr-only">Primeira página</span>
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Página anterior */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-nav border-r border-gray-200"
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Números das páginas */}
            {getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border-r border-gray-200 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border-r border-gray-200 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'z-10 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                      : 'bg-white text-gray-500 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Próxima página */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-nav border-r border-gray-200"
            >
              <span className="sr-only">Próxima página</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Última página */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="btn-nav"
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}