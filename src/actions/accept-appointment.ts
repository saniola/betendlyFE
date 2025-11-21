import { mainState } from '@/state';
import type { Appointment } from '@/types/appointment';
import { api } from '@/utils/http';

export async function acceptAppointment(appointmentId: string) {
  await api.put(`/bookings/${appointmentId}/confirm`);

  const appointment = mainState.appointments.find((item: Appointment) => item.id === appointmentId);

  if (appointment) {
    appointment.status = 1;
  }
}
