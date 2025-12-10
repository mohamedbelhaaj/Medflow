'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Gérez les paramètres de votre compte</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue={session?.user?.name || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={session?.user?.email || ''} disabled />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Clinique
            </CardTitle>
            <CardDescription>Informations de votre clinique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clinicName">Nom de la clinique</Label>
              <Input id="clinicName" defaultValue={session?.user?.tenantName || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clinicPhone">Téléphone</Label>
              <Input id="clinicPhone" placeholder="+216 XX XXX XXX" />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}