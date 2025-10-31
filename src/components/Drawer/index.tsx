import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  width?: number // px
  children: React.ReactNode
}

const Drawer = ({ open, onClose, side = 'left', width = 320, children }: Props) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.35)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .2s ease',
          zIndex: 100,
        }}
        aria-hidden={!open}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          maxWidth: '90vw',
          background: '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,.2)',
          transform: open
            ? 'translateX(0)'
            : side === 'left'
            ? 'translateX(-100%)'
            : 'translateX(100%)',
          transition: 'transform .25s ease',
          zIndex: 101,
          overflow: 'auto',
        } as React.CSSProperties}
      >
        {children}
      </aside>
    </>
  )
}

export default Drawer