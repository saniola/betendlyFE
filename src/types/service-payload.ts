export interface CreateServicePayload {
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

