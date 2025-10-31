import { useEffect, useState } from 'react'

const points = { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1536 } as const
type Key = keyof typeof points

const useBreakpoint = () => {
  const [w, setW] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const key: Key =
    w >= points.xxl ? 'xxl' :
    w >= points.xl  ? 'xl'  :
    w >= points.lg  ? 'lg'  :
    w >= points.md  ? 'md'  :
    w >= points.sm  ? 'sm'  : 'xs'
  return { width: w, bp: key }
}

export default useBreakpoint