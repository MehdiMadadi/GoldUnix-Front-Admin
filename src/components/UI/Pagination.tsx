import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

interface PaginationProps {
  total: number;
  page: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ total, page, perPage, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-between p-5 border-t border-border-light dark:border-border-dark">
      <p className="text-sm text-slate-500 hidden sm:block">
        نمایش {from.toLocaleString('fa-IR')} تا {to.toLocaleString('fa-IR')} از {total.toLocaleString('fa-IR')} نتیجه
      </p>
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <button
          className="page-btn"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          <FiChevronRight size={16} />
        </button>
        
        {pages.map((p, index) => (
          p === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-slate-400">...</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => onChange(Number(p))}
            >
              {Number(p).toLocaleString('fa-IR')}
            </button>
          )
        ))}
        
        <button
          className="page-btn"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
        >
          <FiChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}