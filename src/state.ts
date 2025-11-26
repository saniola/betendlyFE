import { reactive } from 'vue';
import type { Appointment } from '@/types/appointment';
import type { CurrentUser } from '@/types/current-user';
import type { Filter } from '@/types/filter';
import type { Master } from '@/types/master';
import type { User } from '@/types/user';

interface MainState {
  appointments: Appointment[];
  currentPage: number;
  currentUser: CurrentUser | null;
  filter: Filter;
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
  filter: {
    address: null,
    skill: null,
  },
  isLoading: false,
  masters: [],
  title: 'Hello BeTendly',
  totalPages: 1,
  user: null,
});
