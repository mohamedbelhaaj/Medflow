import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get first day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Count total patients for this tenant
    const totalPatients = await prisma.patient.count({
      where: { tenantId: tenantId || undefined },
    });

    // Count today's appointments
    const todayAppointments = await prisma.appointment.count({
      where: {
        tenantId: tenantId || undefined,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Count pending invoices
    const pendingInvoices = await prisma.invoice.count({
      where: {
        tenantId: tenantId || undefined,
        status: "PENDING",
      },
    });

    // Calculate monthly revenue (paid invoices this month)
    const paidInvoices = await prisma.invoice.aggregate({
      where: {
        tenantId: tenantId || undefined,
        status: "PAID",
        paidAt: {
          gte: firstDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const monthlyRevenue = paidInvoices._sum.amount || 0;

    return NextResponse.json({
      totalPatients,
      todayAppointments,
      pendingInvoices,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}