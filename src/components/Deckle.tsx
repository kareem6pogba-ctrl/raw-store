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
    <div className={`deckle ${className}`} style={style}>
      {children}
    </div>
  )
}
