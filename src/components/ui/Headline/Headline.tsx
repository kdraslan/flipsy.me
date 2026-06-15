import type { ReactNode } from 'react'

import styles from './Headline.module.scss'

interface HeadlineProps {
  children: ReactNode
}

export const Headline = ({ children }: HeadlineProps) => (
  <h2 className={styles.headline}>{children}</h2>
)
