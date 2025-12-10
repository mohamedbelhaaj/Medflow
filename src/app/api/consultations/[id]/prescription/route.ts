import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
      },
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation non trouvée" },
        { status: 404 }
      );
    }

    // Check if patient data exists
    if (!consultation.patient) {
      return NextResponse.json(
        { error: "Données du patient non trouvées" },
        { status: 404 }
      );
    }

    // Return prescription data
    return NextResponse.json({
      id: consultation.id,
      diagnosis: consultation.diagnosis,
      symptoms: consultation.symptoms,
      prescription: consultation.prescription,
      notes: consultation.notes,
      patient: {
        firstName: consultation.patient.firstName,
        lastName: consultation.patient.lastName,
        dateOfBirth: consultation.patient.dateOfBirth,
      },
      createdAt: consultation.createdAt,
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'ordonnance" },
      { status: 500 }
    );
  }
}