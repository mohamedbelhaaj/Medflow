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

    const patients = await prisma.patient.findMany({
      where: { tenantId: session.user.tenantId || undefined },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des patients" },
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

    console.log("=== PATIENT CREATE REQUEST ===");
    console.log("Body received:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.firstName) {
      return NextResponse.json(
        { error: "Prénom requis" },
        { status: 400 }
      );
    }

    if (!body.lastName) {
      return NextResponse.json(
        { error: "Nom requis" },
        { status: 400 }
      );
    }

    if (!body.phone) {
      return NextResponse.json(
        { error: "Téléphone requis" },
        { status: 400 }
      );
    }

    if (!body.dateOfBirth) {
      return NextResponse.json(
        { error: "Date de naissance requise" },
        { status: 400 }
      );
    }

    if (!body.gender) {
      return NextResponse.json(
        { error: "Genre requis" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || null,
        phone: body.phone,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        address: body.address || null,
        city: body.city || null,
        postalCode: body.postalCode || null,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
        bloodType: body.bloodType || null,
        allergies: body.allergies || null,
        medicalHistory: body.medicalHistory || null,
        tenantId: session.user.tenantId,
      },
    });

    console.log("=== PATIENT CREATED SUCCESSFULLY ===");
    console.log("Patient ID:", patient.id);

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error("=== PATIENT CREATE ERROR ===");
    console.error("Error:", error);
    
    return NextResponse.json(
      { error: "Erreur lors de la création du patient: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}