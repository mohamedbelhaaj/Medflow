import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const doctorId = session.user.id

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get stats
    const [
      todayAppointments,
      totalPatients,
      pendingAppointments,
      completedToday
    ] = await Promise.all([
      // Today's appointments
      prisma.appointment.count({
        where: {
          doctorId,
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      }),

      // Total unique patients
      prisma.appointment.findMany({
        where: { doctorId },
        select: { patientId: true },
        distinct: ['patientId']
      }).then(appointments => appointments.length),

      // Pending appointments
      prisma.appointment.count({
        where: {
          doctorId,
          status: 'PENDING'
        }
      }),

      // Completed today
      prisma.appointment.count({
        where: {
          doctorId,
          date: {
            gte: today,
            lt: tomorrow
          },
          status: 'COMPLETED'
        }
      })
    ])

    return NextResponse.json({
      todayAppointments,
      totalPatients,
      pendingAppointments,
      completedToday
    })

  } catch (error: any) {
    console.error('Doctor stats error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}