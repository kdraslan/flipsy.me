import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './CustomButton.module.css'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  size?: 'lg' | 'md'
  variant?: 'danger' | 'ghost' | 'primary'
}

export const CustomButton = ({
  children,
  className = '',
  fullWidth = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}: CustomButtonProps) => (
  <button
    type={type}
    className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
)
