import styles from './Icon.module.scss'
import { type IconName, ICONS } from './icons'

interface IconProps {
  className?: string
  name: IconName
}

export const Icon = ({ className = '', name }: IconProps) => (
  <svg
    className={`${styles.icon} ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
)
