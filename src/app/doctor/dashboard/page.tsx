'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react'

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    completedToday: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated' && session?.user?.role !== 'DOCTOR') {
      router.push('/login')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'DOCTOR') {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/doctor/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord Médecin
              </h1>
              <p className="mt-1 text-gray-600">
                Bienvenue, Dr. {session?.user?.name}
              </p>
            </div>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.todayAppointments}
                </p>
                <p className="text-xs text-gray-500 mt-1">Rendez-vous</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalPatients}
                </p>
                <p className="text-xs text-gray-500 mt-1">Patients actifs</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">En attente</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingAppointments}
                </p>
                <p className="text-xs text-gray-500 mt-1">À confirmer</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Complétés</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedToday}
                </p>
                <p className="text-xs text-gray-500 mt-1">Aujourd'hui</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/doctor/appointments')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mes Rendez-vous</h3>
                <p className="text-sm text-gray-600">Gérer vos consultations</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/doctor/patients')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mes Patients</h3>
                <p className="text-sm text-gray-600">Dossiers médicaux</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/doctor/prescriptions')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ordonnances</h3>
                <p className="text-sm text-gray-600">Créer et gérer</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Activité récente
          </h2>
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune activité récente</p>
          </div>
        </div>
      </div>
    </div>
  )
}