import type { ReactNode } from 'react'

import styles from './Panel.module.scss'

interface PanelProps {
  children: ReactNode
  className?: string
}

export const Panel = ({ children, className = '' }: PanelProps) => (
  <section className={`${styles.panel} ${className}`}>{children}</section>
)
