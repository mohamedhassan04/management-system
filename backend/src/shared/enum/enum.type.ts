export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ClientStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Désactive',
}

export enum ProductStock {
  LOW_STOCK = 'stock_faible',
  IN_STOCK = 'en_stock',
  OUT_OF_STOCK = 'rupture_de_stock',
}

export enum InvoicePaymentStatus {
  DRAFT = 'brouillon',
  PAID = 'payé',
  UNPAID = 'non payé',
  PARTIALLY_PAID = 'partiellement payé',
  CANCELLED = 'annulé',
}
