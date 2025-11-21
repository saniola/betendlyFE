import { reactive } from 'vue';
import type { Appointment } from '@/types/appointment';
import type { CurrentUser } from '@/types/current-user';
import type { Master } from '@/types/master';
import type { User } from '@/types/user';

interface MainState {
  appointments: Appointment[];
  currentPage: number;
  currentUser: CurrentUser | null;
  isLoading: boolean;
  masters: Master[];
  title: string;
  totalPages: number;
  user: User | null;
};

export const mainState = reactive<MainState>({
  appointments: [],
  currentPage: 1,
  currentUser: null,
  isLoading: false,
  masters: [],
  title: 'Hello BeTendly',
  totalPages: 1,
  user: null,
});
