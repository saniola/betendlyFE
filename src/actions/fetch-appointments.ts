import { mainState } from '@/state';
import { api } from '@/utils/http';

// const appointments = [
//   {
//     id: "1",
//     masterId: "master-1",
//     masterName: "Alice Smith",
//     clientId: "client-1",
//     clientName: "John Doe",
//     serviceId: "service-1",
//     status: 0,
//     startUtc: "2025-11-20T16:45:42.804Z",
//     endUtc: "2025-11-20T17:15:42.804Z",
//     createdAtUtc: "2025-11-01T10:00:00.000Z",
//     holdExpiresUtc: "2025-11-01T10:30:00.000Z",
//     name: "John Doe",
//     serviceName: "Hair Trim",
//   },
//   {
//     id: "2",
//     masterId: "master-1",
//     masterName: "Alice Smith",
//     clientId: "client-2",
//     clientName: "Emily Stone",
//     serviceId: "service-2",
//     status: 1,
//     startUtc: "2025-11-22T14:00:00.000Z",
//     endUtc: "2025-11-22T15:30:00.000Z",
//     createdAtUtc: "2025-11-05T12:00:00.000Z",
//     holdExpiresUtc: "2025-11-05T12:30:00.000Z",
//     name: "Emily Stone",
//     serviceName: "Nails - Manicure",
//   },
// ];

export async function fetchAppointments(from: Date, to: Date) {
  const params = {
    masterId: mainState.currentUser?.isMaster ? mainState.currentUser.id : undefined,
    clientId: mainState.currentUser?.isMaster ? undefined : mainState.currentUser?.id,
    fromUtc: from.toISOString(),
    toUtc: to.toISOString(),
  };

  const response = await api.get(`/bookings`, { params });

  mainState.appointments = response.data;
  return response.data;
}
