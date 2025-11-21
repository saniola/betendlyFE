import { mainState } from '@/state';
import type { Appointment } from '@/types/appointment';
import { api } from '@/utils/http';

export async function rejectAppointment(appointmentId: string) {
  await api.put(`/bookings/${appointmentId}/reject`);

  mainState.appointments = mainState.appointments.filter((item: Appointment) => item.id !== appointmentId);
}
