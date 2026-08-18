import type { Company } from "@/features/company/domain/entities/Company";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontSize: 10,
    paddingHorizontal: 40,
    paddingVertical: 50,
    fontFamily: "Helvetica",
  },

  // Header styles
  header: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  invoiceDetails: {
    fontSize: 10,
    color: "#666",
  },

  invoiceDetailLabel: {
    fontWeight: "bold",
    color: "#333",
  },

  // Company and client info
  companyClientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 40,
  },

  companySection: {
    flex: 1,
    paddingRight: 20,
  },

  clientSection: {
    flex: 1,
    paddingLeft: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  companyInfo: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.4,
  },

  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 15,
    borderRadius: 5,
    objectFit: "cover",
  },

  // Table styles
  table: {
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 35,
  },

  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  tableCellText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },

  descriptionCol: {
    width: "40%",
    paddingRight: 10,
  },

  quantityCol: {
    width: "15%",
  },

  priceCol: {
    width: "20%",
  },

  totalCol: {
    width: "25%",
  },

  descriptionText: {
    textAlign: "left",
  },

  // Total section
  totalSection: {
    alignItems: "flex-end",
    marginBottom: 30,
  },

  totalContainer: {
    width: 200,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
    padding: 15,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },

  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },

  // Notes section
  notesSection: {
    marginTop: 30,
    padding: 15,
  },

  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
  },

  notesText: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.4,
    textAlign: "justify",
    wordWrap: "break-word",
    maxWidth: "100%",
  },
});

interface InvoicePDFProps {
  company: Omit<Company, "createdAt" | "currency" | "id">;
}

const InvoicePDF = ({ company }: InvoicePDFProps) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y título */}
        <View style={styles.header}>
          {company?.logo && (
            <View style={styles.titleContainer}>
              <Image src={company?.logo} style={styles.logo} />
            </View>
          )}

          {/* <View style={styles.invoiceInfo}>
            <View>
              {invoiceData?.invoiceNumber && (
                <Text style={styles.invoiceDetails}>
                  <Text style={styles.invoiceDetailLabel}>N°: </Text>
                  {invoiceData.invoiceNumber}
                </Text>
              )}
              <Text style={styles.invoiceDetails}>
                <Text style={styles.invoiceDetailLabel}>
                  {`${t("invoice.date")}: ${invoiceData.date}`}
                </Text>
              </Text>
            </View>
          </View> */}
        </View>

        {/* Información de empresa y cliente */}
        <View style={styles.companyClientContainer}>
          <View style={styles.companySection}>
            <Text style={styles.sectionTitle}>{t("company.companyInfo")}</Text>

            <Text style={styles.companyName}>{company.name}</Text>

            <Text
              style={styles.companyInfo}
            >{`ID: ${company.identification}`}</Text>

            <Text style={styles.companyInfo}>
              {`${t("customers.address")}: ${company.address}`}
            </Text>

            <Text style={styles.companyInfo}>
              {`${t("customers.phone")}: ${company.phone}`}
            </Text>

            <Text style={styles.companyInfo}>{`Email: ${company.email}`}</Text>
          </View>

          {/* <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>{t("invoice.client")}</Text>
            {invoiceData.client?.name && (
              <Text style={styles.companyName}>{invoiceData.client.name}</Text>
            )}

            {invoiceData.client?.id && (
              <Text
                style={styles.companyInfo}
              >{`ID: ${invoiceData.client.id}`}</Text>
            )}

            {invoiceData.client?.address && (
              <Text style={styles.companyInfo}>
                {`${t("customers.address")}: ${invoiceData.client.address}`}
              </Text>
            )}

            {invoiceData.client?.phone && (
              <Text style={styles.companyInfo}>{`${t("customers.phone")}: ${
                invoiceData.client.phone
              }`}</Text>
            )}
            {invoiceData.client?.email && (
              <Text
                style={styles.companyInfo}
              >{`Email: ${invoiceData.client.email}`}</Text>
            )}
          </View> */}
        </View>

        {/* Tabla de productos/servicios */}
        {/*  {invoiceData.items && invoiceData.items.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.descriptionCol}>
                <Text style={styles.tableHeaderText}>
                  {t("invoice.description")}
                </Text>
              </View>
              <View style={styles.quantityCol}>
                <Text style={styles.tableHeaderText}>
                  {t("invoice.quantity")}
                </Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.tableHeaderText}>
                  {t("invoice.unitPrice")}
                </Text>
              </View>
              <View style={styles.totalCol}>
                <Text style={styles.tableHeaderText}>Total</Text>
              </View>
            </View>

            {invoiceData.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.descriptionCol}>
                  <Text style={[styles.tableCellText, styles.descriptionText]}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.quantityCol}>
                  <Text style={styles.tableCellText}>{item.quantity}</Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.tableCellText}>
                    {currencySymbol}
                    {item.unitPrice.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalCol}>
                  <Text style={styles.tableCellText}>
                    {currencySymbol}
                    {item.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )} */}

        {/* Sección de total */}
        {/* {invoiceData.subtotal !== undefined &&
          invoiceData.subtotal !== null && (
            <View style={styles.totalSection}>
              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>
                    {currencySymbol}
                    {invoiceData.subtotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )} */}

        {/* Notas */}
        {/* {invoiceData?.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>{t("invoice.notes")}</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )} */}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
