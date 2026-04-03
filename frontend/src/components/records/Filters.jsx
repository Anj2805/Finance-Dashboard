import { RECORD_TYPES } from '../../utils/constants'

const Filters = ({ filters, onChange, categories = [] }) => (
  <div className="mb-4 grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:grid-cols-4">
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">Type</label>
      <select
        className="mt-1 w-full"
        value={filters.type || ''}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      >
        <option value="">All</option>
        {RECORD_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
      <select
        className="mt-1 w-full"
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">From</label>
      <input
        type="date"
        className="mt-1 w-full"
        value={filters.startDate || ''}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
      />
    </div>
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">To</label>
      <input
        type="date"
        className="mt-1 w-full"
        value={filters.endDate || ''}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
      />
    </div>
  </div>
)

export default Filters
