import { useRef, useState } from 'react'

import { Field } from '@/components/ui/Field/Field'
import { Icon } from '@/components/ui/Icon/Icon'
import { useClickOutside } from '@/hooks/useClickOutside'

import barStyles from '../fieldFocus.module.css'
import styles from './CustomSelect.module.css'

interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  id: string
  label: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  value: string
}

export const CustomSelect = ({ id, label, onChange, options, value }: CustomSelectProps) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapRef, () => setOpen(false))

  const selected = options.find((option) => option.value === value)

  const choose = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <Field
      id={id}
      label={label}
    >
      <div
        className={`${styles.wrap} ${barStyles.bar}`}
        ref={wrapRef}
      >
        <button
          type="button"
          id={id}
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
        >
          <span>{selected?.label ?? 'Select'}</span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
            <Icon name="chevron" />
          </span>
        </button>
        {open && (
          <ul
            className={styles.menu}
            role="listbox"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
                  onClick={() => choose(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  )
}
