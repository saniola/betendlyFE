import { reactive } from 'vue';

interface MainState {
  title: string;
};

export const mainState = reactive<MainState>({
  title: 'Hello BeTendly',
});
