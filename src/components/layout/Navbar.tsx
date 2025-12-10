'use client'

import { useSession } from "next-auth/react"
import { Bell, Search, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-4">
          {/* Clinic name */}
          <div className="hidden md:block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            {session?.user?.tenantName || 'Ma Clinique'}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* Logout button */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors md:hidden">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}