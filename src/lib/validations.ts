import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  tenantName: z.string().optional(), // Added this
  phone: z.string().optional(),      // Added this
})

export type RegisterInput = z.infer<typeof registerSchema>

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1, "Phone is required"),
  dateOfBirth: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "A valid date is required.",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  bloodType: z.string().optional(),
})

export type PatientInput = z.infer<typeof patientSchema>

export const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
  dueDate: z.date(),
  description: z.string().optional(),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  date: z.string(), // or z.date() depending on how you handle forms
  time: z.string(),
  reason: z.string().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  type: z.enum(["CHECKUP", "FOLLOW_UP", "EMERGENCY", "CONSULTATION"]),
  notes: z.string().optional(),
})

export const consultationSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(1),
  symptoms: z.string(),
  notes: z.string().optional(),
  prescription: z.string().optional(),
})