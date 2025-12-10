import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const consultations = await prisma.consultation.findMany({
      where: { tenantId: session.user.tenantId || undefined },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des consultations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    const consultation = await prisma.consultation.create({
      data: {
        ...body,
        doctorId: session.user.id,
        tenantId: session.user.tenantId,
      },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la consultation" },
      { status: 500 }
    );
  }
}