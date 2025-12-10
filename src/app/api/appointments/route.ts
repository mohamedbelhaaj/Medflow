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

    const appointments = await prisma.appointment.findMany({
      where: { tenantId: session.user.tenantId || undefined },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rendez-vous" },
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
    
    console.log("=== APPOINTMENT CREATE REQUEST ===");
    console.log("Body received:", JSON.stringify(body, null, 2));
    console.log("Session user:", JSON.stringify(session.user, null, 2));

    // Validate required fields
    if (!body.patientId) {
      console.log("ERROR: Missing patientId");
      return NextResponse.json(
        { error: "Patient requis" },
        { status: 400 }
      );
    }

    if (!body.date) {
      console.log("ERROR: Missing date");
      return NextResponse.json(
        { error: "Date requise" },
        { status: 400 }
      );
    }

    if (!body.time) {
      console.log("ERROR: Missing time");
      return NextResponse.json(
        { error: "Heure requise" },
        { status: 400 }
      );
    }

    // Parse the date
    let appointmentDate: Date;
    try {
      appointmentDate = new Date(body.date);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date");
      }
      console.log("Parsed date:", appointmentDate.toISOString());
    } catch (dateError) {
      console.log("ERROR: Invalid date format:", body.date);
      return NextResponse.json(
        { error: "Format de date invalide" },
        { status: 400 }
      );
    }

    // Create appointment data object
    const appointmentData = {
      patientId: body.patientId,
      doctorId: session.user.id,
      date: appointmentDate,
      time: String(body.time),
      type: body.type || "CHECKUP",
      reason: body.reason || null,
      status: "SCHEDULED" as const,
      tenantId: session.user.tenantId || null,
    };

    console.log("Creating appointment with data:", JSON.stringify(appointmentData, null, 2));

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    console.log("=== APPOINTMENT CREATED SUCCESSFULLY ===");
    console.log("Appointment ID:", appointment.id);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("=== APPOINTMENT CREATE ERROR ===");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Full error:", error);
    
    // Check for specific Prisma errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "Un rendez-vous existe déjà pour cette date et heure" },
        { status: 400 }
      );
    }
    
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: "Patient non trouvé" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du rendez-vous: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}