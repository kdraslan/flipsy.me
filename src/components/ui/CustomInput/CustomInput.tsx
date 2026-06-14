import type { InputHTMLAttributes } from 'react'

import { Field } from '@/components/ui/Field/Field'

import barStyles from '../fieldFocus.module.css'
import styles from './CustomInput.module.css'

interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string
  label: string
  onValueChange: (value: string) => void
}

export const CustomInput = (
  { id, label, onValueChange, ...rest }: CustomInputProps, // Labelled text or number input.
) => (
  <Field
    id={id}
    label={label}
  >
    <div className={barStyles.bar}>
      <input
        id={id}
        className={styles.input}
        onChange={(event) => onValueChange(event.target.value)}
        {...rest}
      />
    </div>
  </Field>
)
