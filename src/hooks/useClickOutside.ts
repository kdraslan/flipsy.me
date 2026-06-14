import type { RefObject } from 'react'
import { useEffect } from 'react'

export const useClickOutside = <T extends HTMLElement>( // Runs the handler on a pointer press outside the element.
  ref: RefObject<T | null>,
  handler: () => void,
) => {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [ref, handler])
}
