import cn from 'classnames'

export const Loader = ({ className }: { className?: string }) => {
  return <div className={cn('dot-typing mb-2 ml-4', className)}></div>
}
