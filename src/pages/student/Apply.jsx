// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Upload, CheckCircle, X, FileText, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
// import { useDropzone } from 'react-dropzone'
// import { useApp } from '../../context/AppContext'
// import { uploadFiles } from '../../services/api'
// import { PageHeader } from '../../components/ui'
// import toast from 'react-hot-toast'

// const LEVELS = ['100L', '200L', '300L', '400L']

// function DropZone({ label, files, onDrop, onRemove }) {
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [], 'image/jpg': [] },
//     multiple: true,
//   })

//   return (
//     <div className="mb-4">
//       <p className="text-xs font-semibold uppercase tracking-widest text-[#4B5680] dark:text-[#8B97B8] mb-2">{label}</p>
//       <div
//         {...getRootProps()}
//         className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
//           isDragActive
//             ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
//             : 'border-[rgba(13,27,62,0.15)] dark:border-[rgba(237,233,223,0.15)] hover:border-[rgba(13,27,62,0.4)] dark:hover:border-[rgba(237,233,223,0.4)]'
//         }`}
//       >
//         <input {...getInputProps()} />
//         <Upload size={20} className="mx-auto mb-2 text-[#8A94B0]" />
//         <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">
//           {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
//         </p>
//         <p className="text-xs text-[#8A94B0] mt-1">PDF or image (JPG, PNG)</p>
//       </div>

//       {files.length > 0 && (
//         <div className="mt-2 flex flex-col gap-1.5">
//           {files.map((f, i) => (
//             <div key={i} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
//               <FileText size={13} className="text-emerald-600 flex-shrink-0" />
//               <span className="text-xs flex-1 truncate text-emerald-700 dark:text-emerald-400">{f.name}</span>
//               <span className="text-[10px] text-emerald-600 flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
//               <button
//                 type="button"
//                 onClick={() => onRemove(i)}
//                 className="text-emerald-600 cursor-pointer bg-transparent border-none p-0 hover:text-red-500 transition-colors"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function Apply() {
//   const { getMyApp, submitClearance } = useApp()
//   const navigate = useNavigate()
//   const app = getMyApp()

//   const [step,           setStep]           = useState(1)
//   const [loading,        setLoading]        = useState(false)
//   const [uploadProgress, setUploadProgress] = useState('')

//   const [files, setFiles] = useState({
//     schoolFees: { '100L': [], '200L': [], '300L': [], '400L': [] },
//     medical:    { '100L': [], '200L': [], '300L': [], '400L': [] },
//     library:    [],
//   })

//   if (app) {
//     return (
//       <div className="max-w-[600px] mx-auto">
//         <PageHeader title="Apply for Clearance" />
//         <div className="card p-8 text-center">
//           <CheckCircle size={44} className="text-emerald-500 mx-auto mb-4" />
//           <h3 className="font-serif text-xl font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">
//             Application Already Submitted
//           </h3>
//           <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
//             Your clearance application is currently being reviewed.
//           </p>
//           <button onClick={() => navigate('/student/track')} className="btn-primary mx-auto">
//             Track Status <ArrowRight size={14} />
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const addFiles = (type, level, newFiles) => {
//     if (type === 'library') {
//       setFiles(p => ({ ...p, library: [...p.library, ...newFiles] }))
//     } else {
//       setFiles(p => ({
//         ...p,
//         [type]: { ...p[type], [level]: [...(p[type][level] || []), ...newFiles] },
//       }))
//     }
//   }

//   const removeFile = (type, level, idx) => {
//     if (type === 'library') {
//       setFiles(p => ({ ...p, library: p.library.filter((_, i) => i !== idx) }))
//     } else {
//       setFiles(p => ({
//         ...p,
//         [type]: { ...p[type], [level]: (p[type][level] || []).filter((_, i) => i !== idx) },
//       }))
//     }
//   }

//   const handleSubmit = async () => {
//     const sfOk  = LEVELS.every(l => (files.schoolFees[l] || []).length > 0)
//     const medOk = LEVELS.every(l => (files.medical[l]    || []).length > 0)
//     const libOk = files.library.length > 0

//     if (!sfOk)  { toast.error('Please upload school fees receipts for all 4 levels.');  return }
//     if (!medOk) { toast.error('Please upload medical receipts for all 4 levels.');      return }
//     if (!libOk) { toast.error('Please upload your library clearance receipt.');          return }

//     setLoading(true)

//     try {
//       // ── Step A: collect all files flat with metadata ──
//       const allFiles = []
//       const fileMeta = []

//       for (const level of LEVELS) {
//         for (const f of (files.schoolFees[level] || [])) {
//           allFiles.push(f)
//           fileMeta.push({ type: 'school_fees', level })
//         }
//       }
//       for (const level of LEVELS) {
//         for (const f of (files.medical[level] || [])) {
//           allFiles.push(f)
//           fileMeta.push({ type: 'medical', level })
//         }
//       }
//       for (const f of files.library) {
//         allFiles.push(f)
//         fileMeta.push({ type: 'library', level: 'final' })
//       }

//       // ── Step B: upload files to backend first ──
//       setUploadProgress('Uploading receipts…')
//       const uploadRes = await uploadFiles(allFiles)
//       const uploaded  = uploadRes.data.files

//       console.log('Uploaded files from backend:', JSON.stringify(uploaded))

//       if (!uploaded || uploaded.length !== allFiles.length) {
//         throw new Error('Upload incomplete. Please try again.')
//       }

//       // ── Step C: build receipt payload with real backend URLs ──
//       const receipts = fileMeta.map((meta, idx) => ({
//         type:     meta.type,
//         level:    meta.level,
//         filename: uploaded[idx].filename,
//         original: uploaded[idx].original,
//         url:      uploaded[idx].url,
//       }))

//       console.log('Submitting receipts:', JSON.stringify(receipts))

//       // ── Step D: submit clearance application ──
//       setUploadProgress('Submitting application…')
//       const res = await submitClearance(receipts)

//       if (!res.ok) {
//         toast.error(res.error || 'Submission failed.')
//         return
//       }

//       toast.success('Clearance application submitted successfully!')
//       navigate('/student/track')

//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Something went wrong.'
//       toast.error(msg)
//       console.error('Submit error:', err)
//     } finally {
//       setLoading(false)
//       setUploadProgress('')
//     }
//   }

//   const steps = ['School Fees', 'Medical Receipts', 'Library & Submit']

//   return (
//     <div className="max-w-[680px] mx-auto">
//       <PageHeader title="Apply for Clearance" subtitle="Upload all required receipts to begin the process." />

//       {/* Stepper */}
//       <div className="flex items-center gap-0 mb-7">
//         {steps.map((s, i) => (
//           <div key={s} className="flex items-center flex-1">
//             <div className="flex flex-col items-center">
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
//                 step > i + 1
//                   ? 'bg-emerald-500 text-white'
//                   : step === i + 1
//                     ? 'bg-[#0D1B3E] dark:bg-[#EDE9DF] text-white dark:text-[#0D1B3E]'
//                     : 'bg-[rgba(13,27,62,0.08)] dark:bg-[rgba(237,233,223,0.08)] text-[#8A94B0]'
//               }`}>
//                 {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
//               </div>
//               <span className={`text-[10px] mt-1 font-medium text-center leading-tight max-w-[70px] ${
//                 step === i + 1 ? 'text-[#0D1B3E] dark:text-[#EDE9DF]' : 'text-[#8A94B0]'
//               }`}>{s}</span>
//             </div>
//             {i < steps.length - 1 && (
//               <div className={`flex-1 h-0.5 mb-4 mx-1 ${
//                 step > i + 1
//                   ? 'bg-emerald-500'
//                   : 'bg-[rgba(13,27,62,0.08)] dark:bg-[rgba(237,233,223,0.08)]'
//               }`} />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="card p-6">

//         {/* Step 1 — School Fees */}
//         {step === 1 && (
//           <div>
//             <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">School Fees Receipts</h3>
//             <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
//               Upload your school fees receipt for each level (100L to 400L).
//             </p>
//             {LEVELS.map(l => (
//               <DropZone
//                 key={l}
//                 label={`${l} School Fees Receipt`}
//                 files={files.schoolFees[l] || []}
//                 onDrop={f => addFiles('schoolFees', l, f)}
//                 onRemove={i => removeFile('schoolFees', l, i)}
//               />
//             ))}
//             <button onClick={() => setStep(2)} className="btn-primary mt-2">
//               Continue <ArrowRight size={14} />
//             </button>
//           </div>
//         )}

//         {/* Step 2 — Medical */}
//         {step === 2 && (
//           <div>
//             <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">Medical Receipts</h3>
//             <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
//               Upload your medical receipt for each level (100L to 400L).
//             </p>
//             {LEVELS.map(l => (
//               <DropZone
//                 key={l}
//                 label={`${l} Medical Receipt`}
//                 files={files.medical[l] || []}
//                 onDrop={f => addFiles('medical', l, f)}
//                 onRemove={i => removeFile('medical', l, i)}
//               />
//             ))}
//             <div className="flex gap-3 mt-2">
//               <button onClick={() => setStep(1)} className="btn-outline">Back</button>
//               <button onClick={() => setStep(3)} className="btn-primary">Continue <ArrowRight size={14} /></button>
//             </div>
//           </div>
//         )}

//         {/* Step 3 — Library + Submit */}
//         {step === 3 && (
//           <div>
//             <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">Library Receipt</h3>
//             <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
//               Upload your final library clearance receipt.
//             </p>
//             <DropZone
//               label="Library Clearance Receipt"
//               files={files.library}
//               onDrop={f => addFiles('library', null, f)}
//               onRemove={i => removeFile('library', null, i)}
//             />

//             <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
//               <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
//               <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
//                 By submitting, you confirm all uploaded receipts are authentic. False submissions will result in disciplinary action.
//               </p>
//             </div>

//             <div className="flex gap-3 mt-4">
//               <button onClick={() => setStep(2)} disabled={loading} className="btn-outline disabled:opacity-50">
//                 Back
//               </button>
//               <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-60">
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 size={14} className="animate-spin-slow" />
//                     {uploadProgress || 'Processing…'}
//                   </span>
//                 ) : (
//                   <><CheckCircle size={14} />Submit Application</>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, X, FileText, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useApp } from '../../context/AppContext'
import { uploadFiles } from '../../services/api'
import { PageHeader } from '../../components/ui'
import toast from 'react-hot-toast'

const LEVELS = ['100L', '200L', '300L', '400L']
const SEMESTERS = ['1st', '2nd']

// e.g. ['100L-1st', '100L-2nd', '200L-1st', '200L-2nd', ...]  -> 8 keys total
const LEVEL_KEYS = LEVELS.flatMap(l => SEMESTERS.map(s => `${l}-${s}`))

function DropZone({ label, files, onDrop, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [], 'image/jpg': [] },
    multiple: true,
  })

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4B5680] dark:text-[#8B97B8] mb-2">{label}</p>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
            : 'border-[rgba(13,27,62,0.15)] dark:border-[rgba(237,233,223,0.15)] hover:border-[rgba(13,27,62,0.4)] dark:hover:border-[rgba(237,233,223,0.4)]'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={20} className="mx-auto mb-2 text-[#8A94B0]" />
        <p className="text-sm text-[#4B5680] dark:text-[#8B97B8]">
          {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-[#8A94B0] mt-1">PDF or image (JPG, PNG)</p>
      </div>

      {files.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
              <FileText size={13} className="text-emerald-600 flex-shrink-0" />
              <span className="text-xs flex-1 truncate text-emerald-700 dark:text-emerald-400">{f.name}</span>
              <span className="text-[10px] text-emerald-600 flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-emerald-600 cursor-pointer bg-transparent border-none p-0 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Apply() {
  const { getMyApp, submitClearance } = useApp()
  const navigate = useNavigate()
  const app = getMyApp()

  const [step,           setStep]           = useState(1)
  const [loading,        setLoading]        = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const [files, setFiles] = useState({
    schoolFees: Object.fromEntries(LEVEL_KEYS.map(k => [k, []])),
    medical:    Object.fromEntries(LEVEL_KEYS.map(k => [k, []])),
    library:    [],
  })

  if (app) {
    return (
      <div className="max-w-[600px] mx-auto">
        <PageHeader title="Apply for Clearance" />
        <div className="card p-8 text-center">
          <CheckCircle size={44} className="text-emerald-500 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-2">
            Application Already Submitted
          </h3>
          <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
            Your clearance application is currently being reviewed.
          </p>
          <button onClick={() => navigate('/student/track')} className="btn-primary mx-auto">
            Track Status <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  const addFiles = (type, key, newFiles) => {
    if (type === 'library') {
      setFiles(p => ({ ...p, library: [...p.library, ...newFiles] }))
    } else {
      setFiles(p => ({
        ...p,
        [type]: { ...p[type], [key]: [...(p[type][key] || []), ...newFiles] },
      }))
    }
  }

  const removeFile = (type, key, idx) => {
    if (type === 'library') {
      setFiles(p => ({ ...p, library: p.library.filter((_, i) => i !== idx) }))
    } else {
      setFiles(p => ({
        ...p,
        [type]: { ...p[type], [key]: (p[type][key] || []).filter((_, i) => i !== idx) },
      }))
    }
  }

  const handleSubmit = async () => {
    const sfOk  = LEVEL_KEYS.every(k => (files.schoolFees[k] || []).length > 0)
    const medOk = LEVEL_KEYS.every(k => (files.medical[k]    || []).length > 0)
    const libOk = files.library.length > 0

    if (!sfOk)  { toast.error('Please upload school fees receipts for all levels & semesters.'); return }
    if (!medOk) { toast.error('Please upload medical receipts for all levels & semesters.');      return }
    if (!libOk) { toast.error('Please upload your library clearance receipt.');                   return }

    setLoading(true)

    try {
      // ── Step A: collect all files flat with metadata ──
      const allFiles = []
      const fileMeta = []

      for (const key of LEVEL_KEYS) {
        const [level, semester] = key.split('-')
        for (const f of (files.schoolFees[key] || [])) {
          allFiles.push(f)
          fileMeta.push({ type: 'school_fees', level, semester })
        }
      }
      for (const key of LEVEL_KEYS) {
        const [level, semester] = key.split('-')
        for (const f of (files.medical[key] || [])) {
          allFiles.push(f)
          fileMeta.push({ type: 'medical', level, semester })
        }
      }
      for (const f of files.library) {
        allFiles.push(f)
        fileMeta.push({ type: 'library', level: 'final', semester: null })
      }

      // ── Step B: upload files to backend first ──
      setUploadProgress('Uploading receipts…')
      const uploadRes = await uploadFiles(allFiles)
      const uploaded  = uploadRes.data.files

      console.log('Uploaded files from backend:', JSON.stringify(uploaded))

      if (!uploaded || uploaded.length !== allFiles.length) {
        throw new Error('Upload incomplete. Please try again.')
      }

      // ── Step C: build receipt payload with real backend URLs ──
      const receipts = fileMeta.map((meta, idx) => ({
        type:     meta.type,
        level:    meta.level,
        semester: meta.semester,
        filename: uploaded[idx].filename,
        original: uploaded[idx].original,
        url:      uploaded[idx].url,
      }))

      console.log('Submitting receipts:', JSON.stringify(receipts))

      // ── Step D: submit clearance application ──
      setUploadProgress('Submitting application…')
      const res = await submitClearance(receipts)

      if (!res.ok) {
        toast.error(res.error || 'Submission failed.')
        return
      }

      toast.success('Clearance application submitted successfully!')
      navigate('/student/track')

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong.'
      toast.error(msg)
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  const steps = ['School Fees', 'Medical Receipts', 'Library & Submit']

  return (
    <div className="max-w-[680px] mx-auto">
      <PageHeader title="Apply for Clearance" subtitle="Upload all required receipts to begin the process." />

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-7">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i + 1
                  ? 'bg-emerald-500 text-white'
                  : step === i + 1
                    ? 'bg-[#0D1B3E] dark:bg-[#EDE9DF] text-white dark:text-[#0D1B3E]'
                    : 'bg-[rgba(13,27,62,0.08)] dark:bg-[rgba(237,233,223,0.08)] text-[#8A94B0]'
              }`}>
                {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium text-center leading-tight max-w-[70px] ${
                step === i + 1 ? 'text-[#0D1B3E] dark:text-[#EDE9DF]' : 'text-[#8A94B0]'
              }`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 ${
                step > i + 1
                  ? 'bg-emerald-500'
                  : 'bg-[rgba(13,27,62,0.08)] dark:bg-[rgba(237,233,223,0.08)]'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">

        {/* Step 1 — School Fees */}
        {step === 1 && (
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">School Fees Receipts</h3>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
              Upload your school fees receipt for each level and semester (100L to 400L).
            </p>
            {LEVEL_KEYS.map(key => {
              const [level, semester] = key.split('-')
              return (
                <DropZone
                  key={key}
                  label={`${level} — ${semester} Semester School Fees Receipt`}
                  files={files.schoolFees[key] || []}
                  onDrop={f => addFiles('schoolFees', key, f)}
                  onRemove={i => removeFile('schoolFees', key, i)}
                />
              )
            })}
            <button onClick={() => setStep(2)} className="btn-primary mt-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 2 — Medical */}
        {step === 2 && (
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">Medical Receipts</h3>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
              Upload your medical receipt for each level and semester (100L to 400L).
            </p>
            {LEVEL_KEYS.map(key => {
              const [level, semester] = key.split('-')
              return (
                <DropZone
                  key={key}
                  label={`${level} — ${semester} Semester Medical Receipt`}
                  files={files.medical[key] || []}
                  onDrop={f => addFiles('medical', key, f)}
                  onRemove={i => removeFile('medical', key, i)}
                />
              )
            })}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)} className="btn-outline">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary">Continue <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {/* Step 3 — Library + Submit */}
        {step === 3 && (
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] mb-1">Library Receipt</h3>
            <p className="text-sm text-[#4B5680] dark:text-[#8B97B8] mb-5">
              Upload your final library clearance receipt.
            </p>
            <DropZone
              label="Library Clearance Receipt"
              files={files.library}
              onDrop={f => addFiles('library', null, f)}
              onRemove={i => removeFile('library', null, i)}
            />

            <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
              <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                By submitting, you confirm all uploaded receipts are authentic. False submissions will result in disciplinary action.
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} disabled={loading} className="btn-outline disabled:opacity-50">
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin-slow" />
                    {uploadProgress || 'Processing…'}
                  </span>
                ) : (
                  <><CheckCircle size={14} />Submit Application</>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}