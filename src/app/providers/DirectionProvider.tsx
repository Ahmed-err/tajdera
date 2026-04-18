import { useEffect } from 'react'
import type { ReactNode } from 'react'

export const DirectionProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl')
    document.documentElement.setAttribute('lang', 'ar-SD')
  }, [])

  return <>{children}</>
}
