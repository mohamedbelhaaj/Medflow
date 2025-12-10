import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Registration request:', { ...body, password: '[HIDDEN]' })

    const {
      role,
      email,
      password,
      firstName,
      lastName,
      phone,
      // Admin fields
      clinicName,
      tenantName,
      // Doctor fields
      specialization,
      licenseNumber,
      // Patient fields
      dateOfBirth,
      gender,
      address,
      bloodType,
    } = body

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, mot de passe et rôle sont requis' },
        { status: 400 }
      )
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Prénom et nom sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hash du mot de passe
    const hashedPassword = await hash(password, 10)

    // Base user data
    const userData: any = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role,
      name: `${firstName} ${lastName}`,
    }

    // Role-specific fields
    switch (role) {
      case 'ADMIN':
        if (!clinicName) {
          return NextResponse.json(
            { error: 'Le nom de la clinique est requis pour les administrateurs' },
            { status: 400 }
          )
        }
        userData.tenantName = clinicName
        userData.tenantId = `clinic_${Date.now()}`
        userData.clinicId = userData.tenantId
        break

      case 'DOCTOR':
        if (!specialization || !licenseNumber) {
          return NextResponse.json(
            { error: 'Spécialisation et numéro de licence requis pour les médecins' },
            { status: 400 }
          )
        }
        userData.specialization = specialization
        userData.licenseNumber = licenseNumber
        break

      case 'RECEPTIONIST':
        // Receptionist can be created without clinic initially
        break

      case 'PATIENT':
        if (!dateOfBirth || !gender) {
          return NextResponse.json(
            { error: 'Date de naissance et sexe requis pour les patients' },
            { status: 400 }
          )
        }
        userData.dateOfBirth = new Date(dateOfBirth)
        userData.gender = gender
        userData.address = address || null
        userData.bloodType = bloodType || null
        break

      default:
        return NextResponse.json(
          { error: 'Rôle invalide' },
          { status: 400 }
        )
    }

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' })

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    })

    console.log('User created successfully:', user)

    return NextResponse.json(
      {
        message: 'Inscription réussie',
        user,
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })

    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un utilisateur avec ces informations existe déjà' },
        { status: 400 }
      )
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Référence invalide dans les données' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'inscription', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}