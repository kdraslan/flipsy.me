import type { ReactNode } from 'react'

import styles from './Field.module.css'

interface FieldProps {
  children: ReactNode
  id?: string
  label: ReactNode
}

export const Field = (
  { children, id, label }: FieldProps, // A labelled control wrapper for inputs.
) => (
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
