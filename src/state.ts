import { reactive } from 'vue';
import type { Master } from '@/types/master';
import type { User } from '@/types/user';

interface MainState {
  currentPage: number;
  isLoading: boolean;
  masters: Master[];
  title: string;
  totalPages: number;
  user: User | null;
};

export const mainState = reactive<MainState>({
  currentPage: 1,
  isLoading: true,
  masters: [],
  title: 'Hello BeTendly',
  totalPages: 1,
  user: null,
});
