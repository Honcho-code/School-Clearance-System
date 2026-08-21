import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, ClipboardList } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import TopBar  from '../../components/TopBar'

const links = [
  { to:'/hod',         icon:LayoutDashboard, label:'Dashboard', exact:true },
  { to:'/hod/review',  icon:ClipboardList,   label:'Sign-off Queue' },
]

export default function HodLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen bg-[#FEFCF8] dark:bg-[#0B0D17] overflow-hidden">
      <Sidebar links={links} roleName="H.O.D" roleColor="#D97706" open={open} onClose={()=>setOpen(false)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={()=>setOpen(true)} title="Head of Department"/>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet/></main>
      </div>
    </div>
  )
}