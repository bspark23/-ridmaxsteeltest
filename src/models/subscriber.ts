export type SubscriberType = 'enquiry' | 'newsletter' | 'other';

export interface Subscriber {
  id?: string;
  name: string; // Optional name
  email: string;
  phone?: string;
  type: SubscriberType;
  createdAt: string; // Timestamp
  metadata?: {
    message?: string; // For enquiry subscribers
  };
}
