import { Menu, Bell, Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TopBar({ onMenuClick, title }) {
  const { dark, setDark, unreadCount } = useApp()
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#FEFCF8]/90 dark:bg-[#0B0D17]/90 backdrop-blur-md border-b border-[rgba(13,27,62,0.08)] dark:border-[rgba(237,233,223,0.08)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] bg-white dark:bg-[#161924] cursor-pointer"
        >
          <Menu size={16} className="text-[#4B5680] dark:text-[#8B97B8]" />
        </button>
        {title && <h2 className="font-serif text-lg font-semibold text-[#0D1B3E] dark:text-[#EDE9DF] hidden sm:block">{title}</h2>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setDark(!dark)} className="p-2 rounded-xl border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] bg-white dark:bg-[#161924] cursor-pointer">
          {dark ? <Sun size={15} className="text-[#8B97B8]" /> : <Moon size={15} className="text-[#4B5680]" />}
        </button>
        <div className="relative">
          <button className="p-2 rounded-xl border border-[rgba(13,27,62,0.12)] dark:border-[rgba(237,233,223,0.12)] bg-white dark:bg-[#161924] cursor-pointer">
            <Bell size={15} className="text-[#4B5680] dark:text-[#8B97B8]" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">{unreadCount}</span>
          )}
        </div>
      </div>
    </header>
  )
}
