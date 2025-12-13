import { mainState } from '@/state';
import type { Filter } from '@/types/filter';
import { setCurrentPage } from '@/actions/set-current-page';

export function setFilterValue(key: keyof Filter, value: string) {
  mainState.filter[key] = value;
  setCurrentPage(1);
}
