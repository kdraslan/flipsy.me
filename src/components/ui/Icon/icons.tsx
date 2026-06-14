import type { ReactNode } from 'react'

export type IconName = 'check' | 'chevron' | 'close' | 'moon' | 'sun' | 'upload'

export const ICONS: Record<IconName, ReactNode> = {
  check: <path d="M3.5 8.5 6.5 11.5 13 4.5" />,
  chevron: <path d="M4 6l4 4 4-4" />,
  close: <path d="M4 4l8 8M12 4l-8 8" />,
  moon: <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5 5.5 5.5 0 1 0 13.5 9.5Z" />,
  sun: (
    <>
      <circle
        cx="8"
        cy="8"
        r="3"
      />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1 1M11.8 11.8l1 1M12.8 3.2l-1 1M4.2 11.8l-1 1" />
    </>
  ),
  upload: <path d="M8 13.5V4M4.5 7.5 8 4l3.5 3.5" />,
}
