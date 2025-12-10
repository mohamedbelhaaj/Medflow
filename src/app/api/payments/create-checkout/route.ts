import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { invoiceId } = await request.json()

    if (!invoiceId) {
      return NextResponse.json({ error: 'ID de facture requis' }, { status: 400 })
    }

    // Get invoice with patient details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }

    // Check if patient exists
    if (!invoice.patient) {
      return NextResponse.json({ error: 'Patient introuvable pour cette facture' }, { status: 404 })
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Cette facture est déjà payée' }, { status: 400 })
    }

    // Create description with patient info
    const patientName = `${invoice.patient.firstName} ${invoice.patient.lastName}`
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'tnd',
            product_data: {
              name: `Facture #${invoice.invoiceNumber}`,
              description: `Patient: ${patientName}`,
            },
            unit_amount: Math.round(invoice.amount * 1000), // Convert TND to millimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/patient/invoices?success=true&invoice=${invoice.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/patient/invoices?canceled=true`,
      customer_email: invoice.patient.email || undefined,
      metadata: {
        invoiceId: invoice.id,
        patientId: invoice.patientId,
      },
    })

    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id 
    })
    
  } catch (error: any) {
    console.error('Payment checkout error:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la session de paiement',
        details: error.message 
      },
      { status: 500 }
    )
  }
}