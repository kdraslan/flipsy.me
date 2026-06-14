import type { ReactNode } from 'react'

import styles from './Panel.module.css'

interface PanelProps {
  children: ReactNode
  className?: string
}

export const Panel = (
  { children, className = '' }: PanelProps, // A frosted surface card for a section.
) => <section className={`${styles.panel} ${className}`}>{children}</section>
