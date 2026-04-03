const Select = ({ label, error, name, children, className = '', ...rest }) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-100">
    {label && <span>{label}</span>}
    <select name={name} className={`${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} ${className}`} {...rest}>
      {children}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
)

export default Select
