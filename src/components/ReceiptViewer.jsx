import { useState } from 'react'
import { FileText, Eye, X, Download, Image, ZoomIn } from 'lucide-react'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')

function resolveUrl(url) {
  if (!url || url === '#') return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

function isPDF(name = '') {
  return name.toLowerCase().endsWith('.pdf')
}

function FileCard({ receipt, onClick }) {
  const name  = receipt.original || receipt.filename || 'receipt'
  const isImg = !isPDF(name)
  const url   = resolveUrl(receipt.url)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-col gap-2 bg-[#F3F0E6] dark:bg-[#111320] hover:bg-[rgba(13,27,62,0.06)] dark:hover:bg-[rgba(237,233,223,0.06)] border border-[rgba(13,27,62,0.10)] dark:border-[rgba(237,233,223,0.10)] hover:border-[#0D1B3E] dark:hover:border-[#EDE9DF] rounded-xl overflow-hidden transition-all cursor-pointer text-left group"
    >
      {/* thumbnail */}
      <div className="w-full h-24 bg-[rgba(13,27,62,0.04)] dark:bg-[rgba(237,233,223,0.04)] flex items-center justify-center relative overflow-hidden">
        {url && isImg ? (
          <>
            <img
              src={url}
              alt={name}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
              <Image size={28} className="text-[#8A94B0]" />
            </div>
          </>
        ) : (
          <FileText size={28} className="text-[#A67C00] dark:text-[#D4A030]" />
        )}
        {/* hover overlay */}
        <div className="absolute inset-0 bg-[#0D1B3E]/0 group-hover:bg-[#0D1B3E]/20 transition-all flex items-center justify-center">
          <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* label */}
      <div className="px-2.5 pb-2.5">
        <p className="text-[11px] font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] truncate">{receipt.level || 'File'}</p>
        <p className="text-[9px] text-[#8A94B0] truncate mt-0.5">{name}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Eye size={10} className="text-[#A67C00] dark:text-[#D4A030]" />
          <span className="text-[9px] text-[#A67C00] dark:text-[#D4A030] font-medium">Click to preview</span>
        </div>
      </div>
    </button>
  )
}

export default function ReceiptViewer({ receipts = [], title = 'Uploaded Receipts' }) {
  const [active, setActive] = useState(null)

  if (!receipts.length) {
    return (
      <div className="bg-[#F3F0E6] dark:bg-[#111320] rounded-xl p-5 text-center border border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]">
        <FileText size={22} className="text-[#8A94B0] mx-auto mb-2" />
        <p className="text-xs text-[#8A94B0]">No receipts uploaded yet</p>
      </div>
    )
  }

  const activeUrl  = active ? resolveUrl(active.url) : null
  const activeName = active ? (active.original || active.filename || 'receipt') : ''
  const activeIsImg = active && !isPDF(activeName)

  return (
    <>
      <div className="mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8A94B0] mb-2.5">{title}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {receipts.map((r, i) => (
            <FileCard key={r.id || i} receipt={r} onClick={() => setActive(r)} />
          ))}
        </div>
      </div>

      {/* ── Preview modal ── */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          <div
            className="relative z-10 bg-white dark:bg-[#161924] rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col"
            style={{ maxHeight: '92vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {activeIsImg
                  ? <Image size={14} className="text-[#A67C00] flex-shrink-0" />
                  : <FileText size={14} className="text-[#A67C00] flex-shrink-0" />
                }
                <span className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] truncate">{activeName}</span>
                {active.level && (
                  <span className="flex-shrink-0 text-[10px] font-semibold bg-[#F3F0E6] dark:bg-[#111320] text-[#4B5680] dark:text-[#8B97B8] px-2 py-0.5 rounded-full">
                    {active.level}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                {activeUrl && (
                  <a
                    href={activeUrl}
                    download={activeName}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#A67C00] dark:text-[#D4A030] no-underline hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    <Download size={13} /> Download
                  </a>
                )}
                <button
                  onClick={() => setActive(null)}
                  className="p-1.5 rounded-lg hover:bg-[#F3F0E6] dark:hover:bg-[#111320] border-none bg-transparent cursor-pointer"
                >
                  <X size={16} className="text-[#8A94B0]" />
                </button>
              </div>
            </div>

            {/* Preview body */}
            <div className="flex-1 overflow-auto bg-[#F3F0E6] dark:bg-[#0B0D17] flex items-center justify-center min-h-[400px]">
              {!activeUrl ? (
                <div className="text-center p-12">
                  <FileText size={44} className="text-[#8A94B0] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">Preview not available</p>
                  <p className="text-xs text-[#8A94B0]">This file was submitted without a valid URL.</p>
                </div>
              ) : activeIsImg ? (
                <img
                  src={activeUrl}
                  alt={activeName}
                  className="max-w-full object-contain rounded-lg shadow-lg"
                  style={{ maxHeight: '75vh' }}
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML = `
                      <div style="text-align:center;padding:48px">
                        <p style="font-size:14px;color:#4B5680;margin-bottom:8px">Could not load image</p>
                        <a href="${activeUrl}" target="_blank" style="font-size:12px;color:#A67C00">Open file directly →</a>
                      </div>
                    `
                  }}
                />
              ) : (
                <iframe
                  src={activeUrl}
                  title={activeName}
                  className="w-full border-none"
                  style={{ height: '75vh' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}