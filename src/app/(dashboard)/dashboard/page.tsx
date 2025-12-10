'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  Activity,
  DollarSign,
  Building2,
  UserCog,
  Stethoscope,
  ClipboardList
} from 'lucide-react'

export default function UnifiedDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const role = session?.user?.role

  // Role-based greeting
  const getRoleGreeting = () => {
    switch (role) {
      case 'ADMIN':
        return { title: 'Tableau de bord Administrateur', prefix: '' }
      case 'DOCTOR':
        return { title: 'Tableau de bord Médecin', prefix: 'Dr.' }
      case 'RECEPTIONIST':
        return { title: 'Tableau de bord Réceptionniste', prefix: '' }
      case 'PATIENT':
        return { title: 'Mon Espace Patient', prefix: '' }
      default:
        return { title: 'Tableau de bord', prefix: '' }
    }
  }

  const greeting = getRoleGreeting()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting.title}
              </h1>
              <p className="mt-1 text-gray-600">
                Bienvenue, {greeting.prefix} {session?.user?.name}
              </p>
            </div>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Dashboard */}
        {role === 'ADMIN' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Patients"
                value={stats.totalPatients || 0}
                subtitle="Patients enregistrés"
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Médecins"
                value={stats.totalDoctors || 0}
                subtitle="Médecins actifs"
                icon={Stethoscope}
                color="green"
              />
              <StatCard
                title="Rendez-vous"
                value={stats.totalAppointments || 0}
                subtitle="Ce mois"
                icon={Calendar}
                color="purple"
              />
              <StatCard
                title="Revenus"
                value={`${stats.totalRevenue || 0} TND`}
                subtitle="Ce mois"
                icon={DollarSign}
                color="teal"
              />
            </div>

            <QuickActions role="ADMIN" router={router} />
          </>
        )}

        {/* Doctor Dashboard */}
        {role === 'DOCTOR' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Aujourd'hui"
                value={stats.todayAppointments || 0}
                subtitle="Rendez-vous"
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Mes Patients"
                value={stats.totalPatients || 0}
                subtitle="Patients actifs"
                icon={Users}
                color="green"
              />
              <StatCard
                title="En attente"
                value={stats.pendingAppointments || 0}
                subtitle="À confirmer"
                icon={Clock}
                color="orange"
              />
              <StatCard
                title="Complétés"
                value={stats.completedToday || 0}
                subtitle="Aujourd'hui"
                icon={Activity}
                color="teal"
              />
            </div>

            <QuickActions role="DOCTOR" router={router} />
          </>
        )}

        {/* Receptionist Dashboard */}
        {role === 'RECEPTIONIST' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Aujourd'hui"
                value={stats.todayAppointments || 0}
                subtitle="Rendez-vous"
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="En attente"
                value={stats.pendingAppointments || 0}
                subtitle="À confirmer"
                icon={Clock}
                color="orange"
              />
              <StatCard
                title="Nouveaux patients"
                value={stats.newPatients || 0}
                subtitle="Ce mois"
                icon={Users}
                color="green"
              />
              <StatCard
                title="Factures"
                value={stats.pendingInvoices || 0}
                subtitle="En attente"
                icon={FileText}
                color="purple"
              />
            </div>

            <QuickActions role="RECEPTIONIST" router={router} />
          </>
        )}

        {/* Patient Dashboard */}
        {role === 'PATIENT' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Prochain RDV"
                value={stats.nextAppointment || 'Aucun'}
                subtitle="Date prochaine"
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Ordonnances"
                value={stats.activePrescriptions || 0}
                subtitle="Actives"
                icon={FileText}
                color="green"
              />
              <StatCard
                title="Factures"
                value={stats.pendingInvoices || 0}
                subtitle="En attente"
                icon={DollarSign}
                color="orange"
              />
            </div>

            <QuickActions role="PATIENT" router={router} />
          </>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-100 text-blue-600',
    green: 'border-green-500 bg-green-100 text-green-600',
    orange: 'border-orange-500 bg-orange-100 text-orange-600',
    purple: 'border-purple-500 bg-purple-100 text-purple-600',
    teal: 'border-teal-500 bg-teal-100 text-teal-600',
  }

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 `}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg `}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}

// Quick Actions Component
function QuickActions({ role, router }: any) {
  const actions: any = {
    ADMIN: [
      { title: 'Gérer les utilisateurs', subtitle: 'Médecins, réceptionnistes', icon: UserCog, path: '/admin/users', color: 'blue' },
      { title: 'Rendez-vous', subtitle: 'Voir tous les RDV', icon: Calendar, path: '/admin/appointments', color: 'green' },
      { title: 'Statistiques', subtitle: 'Rapports et analyses', icon: Activity, path: '/admin/reports', color: 'purple' },
    ],
    DOCTOR: [
      { title: 'Mes Rendez-vous', subtitle: 'Gérer consultations', icon: Calendar, path: '/doctor/appointments', color: 'blue' },
      { title: 'Mes Patients', subtitle: 'Dossiers médicaux', icon: Users, path: '/doctor/patients', color: 'green' },
      { title: 'Ordonnances', subtitle: 'Créer et gérer', icon: FileText, path: '/doctor/prescriptions', color: 'purple' },
    ],
    RECEPTIONIST: [
      { title: 'Rendez-vous', subtitle: 'Planifier et gérer', icon: Calendar, path: '/receptionist/appointments', color: 'blue' },
      { title: 'Patients', subtitle: 'Enregistrement', icon: Users, path: '/receptionist/patients', color: 'green' },
      { title: 'Facturation', subtitle: 'Gérer factures', icon: DollarSign, path: '/receptionist/invoices', color: 'purple' },
    ],
    PATIENT: [
      { title: 'Prendre RDV', subtitle: 'Nouveau rendez-vous', icon: Calendar, path: '/patient/book-appointment', color: 'blue' },
      { title: 'Mes Ordonnances', subtitle: 'Voir ordonnances', icon: FileText, path: '/patient/prescriptions', color: 'green' },
      { title: 'Mes Factures', subtitle: 'Paiements', icon: DollarSign, path: '/patient/invoices', color: 'purple' },
    ],
  }

  const roleActions = actions[role] || []

  const colorClasses: any = {
    blue: 'bg-blue-100 group-hover:bg-blue-200 text-blue-600',
    green: 'bg-green-100 group-hover:bg-green-200 text-green-600',
    purple: 'bg-purple-100 group-hover:bg-purple-200 text-purple-600',
    orange: 'bg-orange-100 group-hover:bg-orange-200 text-orange-600',
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {roleActions.map((action: any, index: number) => (
        <button
          key={index}
          onClick={() => router.push(action.path)}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg transition-colors ${colorClasses[action.color]}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.subtitle}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
