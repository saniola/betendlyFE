import { mainState } from '@/state';

export function setLoadingStatus(isLoading: boolean) {
  mainState.isLoading = isLoading;
}
