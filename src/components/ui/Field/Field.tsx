import type { ReactNode } from 'react'

import styles from './Field.module.scss'

interface FieldProps {
  children: ReactNode
  id?: string
  label: ReactNode
}

export const Field = ({ children, id, label }: FieldProps) => (
  <div className={styles.field}>
    <label
      className={styles.label}
      htmlFor={id}
    >
      {label}
    </label>
    {children}
  </div>
)
