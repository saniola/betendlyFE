import { mainState } from '@/state';
import type { Filter } from '@/types/filter';

export function setFilterValue(key: keyof Filter, value: string | null) {
  mainState.filter[key] = value;
}
