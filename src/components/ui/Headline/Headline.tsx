import type { ReactNode } from 'react'

import styles from './Headline.module.css'

interface HeadlineProps {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  size?: 'lg' | 'md' | 'sm'
}

export const Headline = ({ as = 'h2', children, className = '', size = 'md' }: HeadlineProps) => {
  const Tag = as
  return <Tag className={`${styles.headline} ${styles[size]} ${className}`}>{children}</Tag>
}
