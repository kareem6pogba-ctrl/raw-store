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
      className="fixed inset-0 bg-espresso/40 z-[70] flex items-center justify-center p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-linen w-full max-w-[420px] p-7">
        <h2 id="confirm-modal-title" className="font-display text-xl text-espresso mb-3">
          {title}
        </h2>
        <p className="font-body text-sm text-warmgray leading-relaxed mb-7">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            style={danger ? { background: '#b91c1c', borderColor: '#b91c1c', color: '#fff' } : {}}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
