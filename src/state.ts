import { reactive } from 'vue';

interface MainState {
  isLoading: boolean;
  title: string;
};

export const mainState = reactive<MainState>({
  isLoading: true,
  title: 'Hello BeTendly',
});
