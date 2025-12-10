'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, FileText, Receipt, User } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function PatientPortalPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalConsultations: 0,
    pendingInvoices: 0,
  })

  useEffect(() => {
    fetchPortalStats()
  }, [])

  async function fetchPortalStats() {
    try {
      const response = await fetch('/api/portal/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const cards = [
    {
      title: 'Rendez-vous à venir',
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Consultations',
      value: stats.totalConsultations,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Factures en attente',
      value: stats.pendingInvoices,
      icon: Receipt,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue sur votre portail patient
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez vos rendez-vous et consultez vos documents médicaux
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prochains Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Liste de vos prochains rendez-vous...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Vos dernières ordonnances et documents...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
