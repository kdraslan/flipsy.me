import type { ReactNode } from 'react'

import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  className?: string
  tone?: 'brand' | 'neutral'
}

export const Badge = (
  { children, className = '', tone = 'neutral' }: BadgeProps, // Small rounded label for counts and status.
) => <span className={`${styles.badge} ${styles[tone]} ${className}`}>{children}</span>
