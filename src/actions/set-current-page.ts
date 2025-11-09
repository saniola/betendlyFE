import { mainState } from '@/state';

export function setCurrentPage(page: number) {
  mainState.currentPage = page;
}
