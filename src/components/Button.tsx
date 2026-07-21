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
    'font-body font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap rounded-full focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2 active:scale-[0.96]'
  const size = small ? 'text-xs px-5 py-3' : 'text-[13px] px-9 py-4'
  const variants: Record<string, string> = {
    solid: 'bg-espresso text-linen shadow-[0_20px_40px_-18px_rgba(58,36,24,0.5)] hover:shadow-[0_24px_48px_-16px_rgba(58,36,24,0.6)] hover:-translate-y-0.5',
    outline: 'soft-pill text-espresso hover:-translate-y-0.5',
    ghost: 'bg-transparent underline-offset-4 hover:underline text-espresso px-1 rounded-none font-semibold',
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
