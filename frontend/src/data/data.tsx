import { type MenuProps } from "antd";
import { ImUsers } from "react-icons/im";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { IoDocumentTextSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

export const items: MenuProps["items"] = [
  {
    type: "group",
    label: "Gestion des opérations",
    children: [
      {
        label: "Tableau de bord",
        icon: <MdOutlineDashboard />,
        key: "/dashboard",
      },
      {
        label: "Mes clients",
        icon: <ImUsers />,
        key: "/users",
      },
      {
        label: "Mes produits",
        icon: <PiPackageFill />,
        key: "/products",
      },
      {
        label: "Mes fournisseurs",
        icon: <TbTruckDelivery />,
        key: "/suplliers",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    type: "group",
    label: "Gestion financière",
    children: [
      {
        label: "Mes factures",
        icon: <FaFileInvoiceDollar />,
        key: "/invoices",
      },
      {
        label: "Mes devis",
        icon: <IoDocumentTextSharp />,
        key: "/devis",
      },
    ],
  },
];

export const paymentStatus = [
  {
    id: "Brouillon",
    label: "Brouillon",
  },
  {
    id: "payé",
    label: "Payé",
  },
  {
    id: "non_payé",
    label: "Non payé",
  },
  {
    id: "partiellement_payé",
    label: "Partiellement payé",
  },
  {
    id: "annulé",
    label: "Annulé",
  },
];

export const estimateStatus = [
  {
    id: "Brouillon",
    label: "Brouillon",
  },
  {
    id: "Envoyé",
    label: "Envoyé",
  },
  {
    id: "Accepté",
    label: "Accepté",
  },
  {
    id: "Refusé",
    label: "Refusé",
  },
  {
    id: "Facturé",
    label: "Facturé",
  },
];
