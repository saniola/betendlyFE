export interface Appointment {
  clientId: string;
  clientName: string;
  createdAtUtc: string;
  endUtc: string;
  holdExpiresUtc: string;
  id: string;
  masterId: string;
  masterName: string;
  serviceId: string;
  serviceName: string;
  status: number;
  startUtc: string;
};
