'use client'

import { ClassValue } from 'clsx'
import { cn } from '../../libs/utils'

type Props = {
  className?: ClassValue
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  size?: 'sm' | 'default'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ className, children, onClick, size = 'default', disabled = false, type = 'button' }: Props) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-4 py-2 text-sm'
  }

  return (
    <button
      type={type}
      role="button"
      aria-label="Click to perform an action"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-main font-base shadow-light dark:shadow-white transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}