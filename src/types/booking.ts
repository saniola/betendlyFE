export interface CreateBookingPayload {
  masterId: string;
  clientId: string;
  serviceId: string;
  startUtc: string;
  idempotencyKey?: string;
}

