import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// Define our own types instead of importing from Prisma
interface PrescriptionData {
  id: string;
  diagnosis: string | null;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  prescription: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  } | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: "30%",
  },
  value: {
    width: "70%",
  },
  prescriptionItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
});

export async function generatePrescriptionPDF(data: PrescriptionData): Promise<Blob> {
  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PRESCRIPTION MÉDICALE</Text>
          <Text style={styles.subtitle}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Patient</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom:</Text>
            <Text style={styles.value}>
              {data.patient.user.firstName} {data.patient.user.lastName}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Médecin Prescripteur</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom:</Text>
            <Text style={styles.value}>
              Dr. {data.doctor.user.firstName} {data.doctor.user.lastName}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnostic</Text>
          <Text>{data.diagnosis || "Non spécifié"}</Text>
        </View>

        {data.prescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prescriptions</Text>
            <View style={styles.prescriptionItem}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                {data.prescription.medication}
              </Text>
              <Text>Dosage: {data.prescription.dosage}</Text>
              <Text>Fréquence: {data.prescription.frequency}</Text>
              <Text>Durée: {data.prescription.duration}</Text>
              {data.prescription.instructions && (
                <Text style={{ fontStyle: "italic", marginTop: 5 }}>
                  Instructions: {data.prescription.instructions}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>
            Ce document a été généré électroniquement par MedFlow
          </Text>
          <Text>ID: {data.id}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(MyDocument).toBlob();
  return blob;
}

export type { PrescriptionData };