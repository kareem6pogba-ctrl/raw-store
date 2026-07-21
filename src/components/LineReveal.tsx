import type { ReactNode } from 'react'

export function LineReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="line-reveal-mask">
      <span className="line-reveal-inner" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  )
}
