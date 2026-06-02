type Props = { open: boolean; onClick: () => void }

export default function MenuButton({ open, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
      style={{
        position: 'relative',
        zIndex: 1100,
        width: 44,
        height: 44,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ width: 22, height: 14, position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 2,
            background: '#fff',
            borderRadius: 2,
            transformOrigin: 'center',
            transform: open ? 'translateY(6px) rotate(45deg)' : 'translateY(0) rotate(0)',
            transition: 'transform 380ms cubic-bezier(0.4,0,0.2,1)',
            display: 'block',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 6,
            width: '100%',
            height: 2,
            background: '#fff',
            borderRadius: 2,
            opacity: open ? 0 : 1,
            transition: 'opacity 220ms ease',
            display: 'block',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 12,
            width: '100%',
            height: 2,
            background: '#fff',
            borderRadius: 2,
            transformOrigin: 'center',
            transform: open ? 'translateY(-6px) rotate(-45deg)' : 'translateY(0) rotate(0)',
            transition: 'transform 380ms cubic-bezier(0.4,0,0.2,1)',
            display: 'block',
          }}
        />
      </div>
    </button>
  )
}
