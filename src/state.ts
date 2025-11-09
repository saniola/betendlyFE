import { reactive } from 'vue';
import type { Master } from '@/types/master';

interface MainState {
  currentPage: number;
  isLoading: boolean;
  masters: Master[];
  title: string;
  totalPages: number;
};

export const mainState = reactive<MainState>({
  currentPage: 1,
  isLoading: true,
  masters: [],
  title: 'Hello BeTendly',
  totalPages: 1,
});
