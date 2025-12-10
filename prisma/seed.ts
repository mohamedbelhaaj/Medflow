import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create a demo admin user
  const hashedPassword = await hash('password123', 12)
  
  const tenantId = `tenant_demo_${Date.now()}`

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Admin Demo',
      firstName: 'Admin',
      lastName: 'Demo',
      role: UserRole.ADMIN,
      tenantId: tenantId,
      tenantName: 'Clinique Demo',
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create a demo patient
  const patient = await prisma.patient.upsert({
    where: { id: 'demo-patient-1' },
    update: {},
    create: {
      id: 'demo-patient-1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+216 20 123 456',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      address: '123 Rue de la Paix',
      city: 'Tunis',
      tenantId: tenantId,
    },
  })

  console.log('Created patient:', patient.firstName, patient.lastName)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })