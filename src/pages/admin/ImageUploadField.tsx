import { useRef, useState } from 'react'
import { uploadProductImage } from '../../lib/uploadImage'

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setUploading(true)
    setError(null)
    const { url, error: uploadError } = await uploadProductImage(file)
    setUploading(false)
    if (uploadError) {
      setError(uploadError)
      return
    }
    if (url) onChange(url)
  }

  return (
    <div>
      <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray font-bold mb-2">{label}</div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex items-center gap-4 rounded-2xl px-4 py-3 cursor-pointer transition-all ${
          dragOver ? 'bg-beige/25 ring-2 ring-espresso' : 'bg-white shadow-[0_10px_24px_-16px_rgba(58,36,24,0.15)]'
        }`}
      >
        {value ? (
          <img src={value} alt="" className="w-14 h-16 object-cover shrink-0 rounded-xl" />
        ) : (
          <div className="w-14 h-16 bg-linen shrink-0 flex items-center justify-center text-warmgray text-xs rounded-xl">
            —
          </div>
        )}
        <div className="flex-1 min-w-0">
          {uploading ? (
            <span className="font-body text-sm text-warmgray font-medium">Uploading…</span>
          ) : (
            <>
              <span className="font-body text-sm text-espresso font-medium">Drop image here or click to browse</span>
              {value && <div className="font-body text-xs text-warmgray truncate mt-0.5">{value}</div>}
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <div className="font-body text-xs text-red-600 mt-1.5 font-medium">{error}</div>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL directly"
        className="w-full bg-transparent py-2 mt-2 font-body text-xs text-warmgray outline-none"
      />
    </div>
  )
}
