import { Button } from './Button'

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-espresso/40 z-[70] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-[#FCFAF5] rounded-[28px] w-full max-w-[420px] p-8 shadow-2xl">
        <h2 id="confirm-modal-title" className="font-display text-xl text-espresso font-extrabold mb-3">
          {title}
        </h2>
        <p className="font-body text-sm text-warmgray leading-relaxed mb-7">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            style={danger ? { background: '#b91c1c', color: '#fff', boxShadow: '0 20px 40px -18px rgba(185,28,28,0.5)' } : {}}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
