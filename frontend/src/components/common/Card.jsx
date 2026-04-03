const Card = ({ title, value, icon, className = '', children }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-300">{title}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      {icon}
    </div>
    {children && <div className="mt-4 text-sm text-slate-600 dark:text-slate-200">{children}</div>}
  </div>
)

export default Card
