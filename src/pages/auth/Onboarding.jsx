import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, X, ArrowRight, CheckCircle, Zap, Layers, Upload, Shield, Stethoscope, BookOpen, Building2, Award, Bell, UserCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const slides = [
  {
    tag:'Step 1 of 3', accent:'#2563EB', aLight:'rgba(37,99,235,.10)', aBd:'rgba(37,99,235,.22)',
    headline:'Submit your receipts in one place',
    body:'Upload your school fees, medical and library receipts for every level — 100L through 400L — directly from your phone or laptop. No printing, no queueing.',
    image:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=85',
    items:[
      {icon:Upload,      label:'School Fees', sub:'100L – 400L receipts',    color:'#2563EB'},
      {icon:Stethoscope, label:'Medical',     sub:'100L – 400L receipts',    color:'#DC2626'},
      {icon:BookOpen,    label:'Library',     sub:'Final library clearance', color:'#7C3AED'},
    ],
    tip:'All uploads are securely stored on the university server.',
  },
  {
    tag:'Step 2 of 3', accent:'#059669', aLight:'rgba(5,150,105,.10)', aBd:'rgba(5,150,105,.22)',
    headline:'Every approval happens in real time',
    body:'Your receipts go to three managers simultaneously. The moment any of them approves or has a question, you get a live notification — no guessing, no office runs.',
    image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85',
    items:[
      {icon:Shield,      label:'Admin',           sub:'Reviews school fees receipts',  color:'#059669'},
      {icon:Stethoscope, label:'Medical Manager',  sub:'Reviews medical receipts',      color:'#DC2626'},
      {icon:BookOpen,    label:'Library Manager',  sub:'Reviews library receipt',       color:'#7C3AED'},
    ],
    tip:'All three managers review simultaneously — not one after the other.',
  },
  {
    tag:'Step 3 of 3', accent:'#A67C00', aLight:'rgba(166,124,0,.09)', aBd:'rgba(166,124,0,.22)',
    headline:'One letter. Fully official. Yours forever.',
    body:'Once all three approve, the HOD gives departmental sign-off. The Admin does a final review and grants clearance. Your official clearance letter is generated instantly.',
    image:'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=800&q=85',
    items:[
      {icon:Building2, label:'HOD Sign-off',      sub:'Departmental confirmation',       color:'#D97706'},
      {icon:Shield,    label:'Admin Final Check',  sub:'Last overall review',             color:'#059669'},
      {icon:Award,     label:'Clearance Letter',   sub:'Official PDF — download anytime', color:'#A67C00'},
    ],
    tip:'Your letter carries a unique certificate ID for independent verification.',
  },
]

function ProgDot({ active, done, onClick }) {
  return (
    <button onClick={onClick} className="border-none cursor-pointer p-0 transition-all duration-300" style={{
      width: active ? 26 : 7, height: 7,
      borderRadius: 4,
      background: '#0D1B3E',
      opacity: active || done ? 1 : 0.2,
    }}/>
  )
}

export default function Onboarding() {
  const { dark } = useApp()
  const navigate = useNavigate()
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(1)
  const [anim, setAnim] = useState(false)
  const [entered, setEntered] = useState(false)
  useEffect(() => { setTimeout(()=>setEntered(true), 80) }, [])

  const s = slides[cur]
  const go = (next) => {
    if (anim || next === cur) return
    setDir(next > cur ? 1 : -1); setAnim(true)
    setTimeout(() => { setCur(next); setAnim(false) }, 280)
  }
  const done = () => navigate('/login')

  const bg   = dark ? '#0B0D17' : '#FEFCF8'
  const bgC  = dark ? '#161924' : '#FFFFFF'
  const tx   = dark ? '#EDE9DF' : '#0D1B3E'
  const soft = dark ? '#8B97B8' : '#4B5680'
  const bd   = dark ? 'rgba(237,233,223,.08)' : 'rgba(13,27,62,.08)'
  const bdMd = dark ? 'rgba(237,233,223,.14)' : 'rgba(13,27,62,.13)'

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:400,
      background:bg, display:'flex', flexDirection:'column',
      fontFamily:"'Outfit',system-ui,sans-serif",
      opacity: entered?1:0, transform:entered?'none':'translateY(10px)',
      transition:'opacity .45s ease, transform .45s ease',
    }}>
      <style>{`
        @keyframes obSlideIn { from { opacity:0; transform:translateX(var(--dx)); } to { opacity:1; transform:none; } }
        .ob-anim { animation: obSlideIn .28s ease both; }
      `}</style>

      {/* top bar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:`1px solid ${bd}`,flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:tx,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <GraduationCap size={15} color={bg} strokeWidth={2}/>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:17,fontWeight:600,color:tx}}>OUI Clearance</span>
        </div>
        <button onClick={done} style={{background:'transparent',border:`1px solid ${bdMd}`,color:soft,borderRadius:8,padding:'6px 14px',fontSize:13,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
          Skip <X size={12}/>
        </button>
      </div>

      {/* body */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* image panel desktop */}
        <div id="ob-img" style={{display:'none',flex:'0 0 45%',position:'relative',overflow:'hidden'}}>
          <img src={s.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
          <div style={{position:'absolute',inset:0,background:`linear-gradient(to right,transparent 55%,${bg} 100%)`}}/>
          <div style={{position:'absolute',top:24,left:24,background:'rgba(0,0,0,.45)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.14)',borderRadius:100,padding:'5px 14px',color:'#fff',fontSize:11,fontWeight:500}}>{s.tag}</div>
        </div>

        {/* content */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',justifyContent:'center',padding:'clamp(20px,5vw,52px)'}}>
          <div className={anim?'ob-anim':''} style={{'--dx':dir>0?'32px':'-32px',maxWidth:500,width:'100%',margin:'0 auto'}}>
            {/* mobile image */}
            <div id="ob-mob" style={{borderRadius:14,overflow:'hidden',aspectRatio:'16/9',marginBottom:22}}>
              <img src={s.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
            </div>
            {/* tag */}
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:s.aLight,border:`1px solid ${s.aBd}`,color:s.accent,borderRadius:100,padding:'5px 13px',fontSize:11,fontWeight:600,marginBottom:16,letterSpacing:'.05em'}}>
              <Layers size={10}/>{s.tag}
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'clamp(24px,4vw,40px)',fontWeight:600,lineHeight:1.1,letterSpacing:'-.02em',color:tx,marginBottom:14}}>{s.headline}</h2>
            <p style={{fontSize:'clamp(13px,2vw,15px)',color:soft,lineHeight:1.82,marginBottom:22}}>{s.body}</p>
            {/* items */}
            <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:18}}>
              {s.items.map((item,i) => { const Icon=item.icon; return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:bgC,border:`1px solid ${bd}`,borderRadius:12,padding:'12px 14px'}}>
                  <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:item.color+'14',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Icon size={16} color={item.color} strokeWidth={1.75}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:tx}}>{item.label}</div>
                    <div style={{fontSize:11,color:soft,marginTop:2}}>{item.sub}</div>
                  </div>
                  <CheckCircle size={13} color={item.color}/>
                </div>
              )})}
            </div>
            {/* tip */}
            <div style={{display:'flex',gap:9,background:s.aLight,border:`1px solid ${s.aBd}`,borderRadius:10,padding:'11px 13px',marginBottom:28}}>
              <Zap size={12} color={s.accent} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:12,color:s.accent,lineHeight:1.6,fontWeight:500}}>{s.tip}</p>
            </div>
            {/* nav */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
              <button onClick={()=>cur>0&&go(cur-1)} style={{background:'transparent',border:`1.5px solid ${bdMd}`,color:tx,padding:'11px 20px',borderRadius:10,fontSize:13,fontWeight:500,cursor:cur===0?'not-allowed':'pointer',opacity:cur===0?0.3:1,display:'flex',alignItems:'center',gap:5}}>
                <ArrowRight size={13} style={{transform:'rotate(180deg)'}}/>Back
              </button>
              <div style={{display:'flex',gap:5,alignItems:'center'}}>
                {slides.map((_,i) => <ProgDot key={i} active={i===cur} done={i<cur} onClick={()=>go(i)}/>)}
              </div>
              <button onClick={()=>cur<slides.length-1?go(cur+1):done()} style={{background:tx,color:bg,border:'none',padding:'11px 22px',borderRadius:10,fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
                {cur===slides.length-1?<><GraduationCap size={13}/>Go to Login</>:<>Next<ArrowRight size={13}/></>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div style={{height:3,background:dark?'#1C2030':'#E8E4D8',flexShrink:0}}>
        <div style={{height:'100%',background:s.accent,width:`${((cur+1)/slides.length)*100}%`,transition:'width .5s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
      <style>{`@media(min-width:900px){#ob-img{display:block!important}#ob-mob{display:none!important}}`}</style>
    </div>
  )
}
