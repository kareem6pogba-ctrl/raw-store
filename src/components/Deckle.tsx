import type { CSSProperties, ReactNode } from 'react'

export function Deckle({
  children,
  className = '',
  style = {},
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`rounded-[32px] ${className}`} style={style}>
      {children}
    </div>
  )
}
