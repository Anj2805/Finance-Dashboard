import clsx from 'clsx'

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400 dark:text-slate-200 dark:hover:bg-slate-800'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
}

const Button = ({ type = 'button', as: Component = 'button', variant = 'primary', size = 'md', className, children, ...rest }) => {
  const componentProps = Component === 'button' ? { type } : {}
  return (
    <Component className={clsx(baseStyles, variants[variant], sizes[size], className)} {...componentProps} {...rest}>
      {children}
    </Component>
  )
}

export default Button
