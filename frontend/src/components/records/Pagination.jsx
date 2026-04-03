import Button from '../common/Button'
import { PAGE_SIZE_OPTIONS } from '../../utils/constants'

const Pagination = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  const hasPages = totalPages > 0
  const maxPage = hasPages ? totalPages : 1
  const currentPage = hasPages ? Math.min(page, maxPage) : 1
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Rows per page</span>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" disabled={!hasPages || page === 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-200">
          Page {currentPage} of {maxPage}
        </p>
        <Button variant="ghost" disabled={!hasPages || page >= maxPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default Pagination
