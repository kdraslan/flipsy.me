import type { CSSProperties } from 'react'

import { Field } from '@/components/ui/Field/Field'

import styles from './CustomSlider.module.css'

interface CustomSliderProps {
  formatValue?: (value: number) => string
  id: string
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}

export const CustomSlider = ({
  formatValue,
  id,
  label,
  max = 100,
  min = 0,
  onChange,
  step = 1,
  value,
}: CustomSliderProps) => {
  const fill = `${((value - min) / (max - min)) * 100}%`

  return (
    <Field
      id={id}
      label={
        <>
          {label}
          {formatValue && <span className={styles.value}>{formatValue(value)}</span>}
        </>
      }
    >
      <div className={styles.track}>
        <input
          id={id}
          className={styles.range}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ '--fill': fill } as CSSProperties}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </Field>
  )
}
