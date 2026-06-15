import type { ReactNode } from 'react'

import styles from './Badge.module.scss'

interface BadgeProps {
  children: ReactNode
}

export const Badge = ({ children }: BadgeProps) => <span className={styles.badge}>{children}</span>
