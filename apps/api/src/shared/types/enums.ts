export enum UserRole {
  SHOPPER = 'shopper',
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export enum SubscriptionTier {
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentPurpose {
  PREMIUM_UPGRADE = 'premium_upgrade',
  BUSINESS_SUBSCRIPTION = 'business_subscription',
  ORDER = 'order',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum MediaOwnerType {
  BUSINESS = 'business',
  PRODUCT = 'product',
  REVIEW = 'review',
}

export enum MediaKind {
  LOGO = 'logo',
  COVER = 'cover',
  GALLERY = 'gallery',
}
