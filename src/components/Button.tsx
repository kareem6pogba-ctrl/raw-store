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
    'font-body uppercase tracking-widest transition-all duration-300 border border-espresso cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2'
  const size = small ? 'text-xs px-5 py-3' : 'text-[13px] px-9 py-4'
  const variants: Record<string, string> = {
    solid: 'bg-espresso text-linen hover:bg-transparent hover:text-espresso',
    outline: 'bg-transparent text-espresso hover:bg-espresso hover:text-linen',
    ghost: 'border-transparent underline-offset-4 hover:underline text-espresso px-1',
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
