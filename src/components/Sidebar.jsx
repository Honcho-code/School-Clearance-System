import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, Sun, Moon, X, Bell, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Sidebar({ links, roleName, roleColor='#2563EB', open, onClose }) {
  const { user, logout, dark, setDark, unreadCount } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* logo */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D1B3E] dark:bg-[#EDE9DF] flex items-center justify-center flex-shrink-0">
            <GraduationCap size={16} className="text-[#FEFCF8] dark:text-[#0D1B3E]" strokeWidth={2} />
          </div>
          <div>
            <div className="font-serif text-sm font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] leading-none">OUI Clearance</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: roleColor }}>{roleName}</div>
          </div>
        </div>
        {/* close btn mobile */}
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border-none bg-transparent cursor-pointer lg:hidden">
            <X size={16} className="text-[#8A94B0]" />
          </button>
        )}
      </div>

      {/* nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to} to={to} end={exact}
            onClick={onClose}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="bg-amber-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
                )}
                {isActive && <ChevronRight size={12} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* bottom */}
      <div className="px-3 py-4 border-t border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] flex flex-col gap-2">
        {/* theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="nav-item w-full border-none"
        >
          {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {/* user info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[rgba(13,27,62,0.04)] dark:bg-[rgba(237,233,223,0.04)]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: roleColor }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] truncate">{user?.name}</div>
            <div className="text-[10px] text-[#8A94B0] truncate">{user?.email}</div>
          </div>
        </div>
        {/* logout */}
        <button onClick={handleLogout} className="nav-item w-full border-none text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
          <LogOut size={15} strokeWidth={1.75} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0 border-r border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] bg-white dark:bg-[#0B0D17]">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-[#0B0D17] border-r border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)] lg:hidden transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  )
}
