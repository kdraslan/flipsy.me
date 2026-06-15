import { CustomButton, Icon } from '@/components/ui'
import type { Theme } from '@/hooks/useTheme'

import styles from './ThemeToggle.module.scss'

interface ThemeToggleProps {
  onToggle: () => void
  theme: Theme
}

export const ThemeToggle = ({ onToggle, theme }: ThemeToggleProps) => (
  <CustomButton
    variant="ghost"
    className={styles.toggle}
    onClick={onToggle}
    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
  </CustomButton>
)
