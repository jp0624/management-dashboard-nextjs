'use client'
import { useEffect, useRef } from 'react'
export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement as HTMLElement | null
    element?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={dialog} aria-labelledby="modal-title" onCancel={onClose} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-0 text-slate-900 dark:text-slate-100 shadow-2xl backdrop:bg-slate-950/60">
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 sm:px-7">
      <h2 id="modal-title" className="text-xl font-semibold">{title}</h2>
      <button type="button" onClick={onClose} aria-label="Close dialog" className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Close ✕</button>
    </header><div className="p-5 sm:p-7">{children}</div>
  </dialog>
}
