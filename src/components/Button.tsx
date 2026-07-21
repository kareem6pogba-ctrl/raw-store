import type { CSSProperties, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  onClick?: () => void
  style?: CSSProperties
  small?: boolean
  fullWidth?: boolean
  disabled?: boolean
}

export function Button({
  children,
  variant = 'solid',
  onClick,
  style = {},
  small,
  fullWidth,
  disabled,
}: ButtonProps) {
  const base =
    'font-body uppercase tracking-widest transition-all duration-300 cursor-pointer whitespace-nowrap rounded-full focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2 active:scale-[0.97]'
  const size = small ? 'text-xs px-5 py-3' : 'text-[13px] px-9 py-4'
  const variants: Record<string, string> = {
    solid: 'bg-espresso text-linen border border-espresso hover:shadow-lg hover:shadow-espresso/20 hover:-translate-y-0.5',
    outline: 'bg-transparent text-espresso border border-espresso/25 hover:border-espresso hover:bg-espresso/5',
    ghost: 'border-transparent underline-offset-4 hover:underline text-espresso px-1 rounded-none',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${size} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={style}
    >
      {children}
    </button>
  )
}
