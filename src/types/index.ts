export type UserRole = "ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  tenantId?: string | null;
  tenantName?: string | null;
  image?: string | null;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
  tenantId?: string | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  type: string;
  reason?: string | null;
  notes?: string | null;
  tenantId?: string | null;
  patient?: Patient;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  notes?: string | null;
  prescription?: string | null;
  tenantId?: string | null;
  patient?: Patient;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  amount: number;
  status: "DRAFT" | "PENDING" | "PAID" | "CANCELLED" | "OVERDUE";
  dueDate: Date;
  description?: string | null;
  discount?: number | null;
  tax?: number | null;
  notes?: string | null;
  tenantId?: string | null;
  patient?: Patient;
}