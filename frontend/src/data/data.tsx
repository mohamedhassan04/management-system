import { type MenuProps } from "antd";
import { ImUsers } from "react-icons/im";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { IoDocumentTextSharp } from "react-icons/io5";

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
