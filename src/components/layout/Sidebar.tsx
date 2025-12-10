'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Receipt, 
  Settings,
  Stethoscope,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Patients', href: '/dashboard/patients', icon: Users, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Rendez-vous', href: '/dashboard/appointments', icon: Calendar, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Consultations', href: '/dashboard/consultations', icon: Stethoscope, roles: ['ADMIN', 'DOCTOR'] },
  { name: 'Factures', href: '/dashboard/invoices', icon: Receipt, roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(session?.user?.role as string)
  )

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow bg-gray-900 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-gray-800">
          <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">MedFlow</span>
        </div>

        {/* Navigation */}
        <div className="flex-grow flex flex-col pt-5">
          <nav className="flex-1 px-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-emerald-400"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-gray-800 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}