export type Language = 'en' | 'vi' | 'ph' | 'fr';

export interface Denomination {
  value: number;
  label: string;
  isCoin: boolean;
  minKeep: number;
}

export interface Translation {
  title: string;
  inputHeader: string;
  quantity: string;
  total: string;
  submit: string;
  summary: string;
  inputSummary: string;
  grandTotal: string;
  keepInRegister: string;
  takeToSafe: string;
  safeBreakdown: string;
  coins: string;
  print: string;
  reset: string;
  minRequired: string;
  language: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    title: "Cashier Summary",
    inputHeader: "Enter Quantities",
    quantity: "Qty",
    total: "Total",
    submit: "Calculate",
    summary: "Summary Report",
    inputSummary: "Input Summary",
    grandTotal: "Grand Total",
    keepInRegister: "Keep in Register",
    takeToSafe: "Take to Safe",
    safeBreakdown: "Safe Breakdown",
    coins: "Coins",
    print: "Print Report",
    reset: "Reset",
    minRequired: "Min",
    language: "Language"
  },
  vi: {
    title: "Tổng Kết Tiền Quầy",
    inputHeader: "Nhập Số Lượng",
    quantity: "SL",
    total: "Thành tiền",
    submit: "Tính toán",
    summary: "Báo Cáo Tổng Kết",
    inputSummary: "Mệnh giá đã nhập",
    grandTotal: "Tổng cộng",
    keepInRegister: "Giữ lại quầy",
    takeToSafe: "Cất vào két",
    safeBreakdown: "Chi tiết tiền vào két",
    coins: "Đồng xu",
    print: "In báo cáo",
    reset: "Làm mới",
    minRequired: "Tối thiểu",
    language: "Ngôn ngữ"
  },
  ph: {
    title: "Buod ng Cashier",
    inputHeader: "Ilagay ang Dami",
    quantity: "Dami",
    total: "Kabuuan",
    submit: "Kalkulahin",
    summary: "Ulat ng Buod",
    inputSummary: "Buod ng Input",
    grandTotal: "Kabuuang Halaga",
    keepInRegister: "Iwan sa Kahera",
    takeToSafe: "Ilagay sa Safe",
    safeBreakdown: "Detalye ng Safe",
    coins: "Barya",
    print: "I-print ang Ulat",
    reset: "I-reset",
    minRequired: "Min",
    language: "Wika"
  },
  fr: {
    title: "Résumé de Caisse",
    inputHeader: "Entrer les Quantités",
    quantity: "Qté",
    total: "Total",
    submit: "Calculer",
    summary: "Rapport de Résumé",
    inputSummary: "Résumé des Entrées",
    grandTotal: "Total Général",
    keepInRegister: "Garder en Caisse",
    takeToSafe: "Mettre au Coffre",
    safeBreakdown: "Détails du Coffre",
    coins: "Pièces",
    print: "Imprimer le Rapport",
    reset: "Réinitialiser",
    minRequired: "Min",
    language: "Langue"
  }
};
