import { setLoadingStatus } from '@/actions/set-loading-status';
import { API_BASE_URL } from '@/config';
import { mainState } from '@/state';

// const masters = {
//   items: [
//     {
//       id: "e024c0d1-0dcb-4643-8807-1d544ab94858",
//       userId: "f7a05029-c5d5-4ada-87b6-553de1e70fdd",
//       fullName: "Maria Polak",
//       about: 'Barber',
//       skills: [],
//       address: null,
//       avatarUrl: null,
//     },
//     {
//       id: "cd48a3b8-4d84-46f4-b0f5-aeaa512b9153",
//       userId: "ddd41e45-9560-4339-8315-0550e9b5de53",
//       fullName: "Anna Novak",
//       about: "I'm super",
//       skills: [
//         "cutting",
//         "nail"
//       ],
//       address: "Lviv",
//       avatarUrl: "string",
//       rating: 4.7,
//       feedbacksCount: 12,
//     }
//   ],
//   page: 1,
//   pageSize: 10,
//   total: 2
// }

export async function fetchMasters() {
  setLoadingStatus(true);

  const response = await fetch(`${API_BASE_URL}/masters?page=${mainState.currentPage}&pageSize=10`);
  const data = await response.json();

  mainState.masters = data.items;
  mainState.totalPages = data.total;

  // mainState.masters = masters.items;
  // mainState.totalPages = masters.total;

  setTimeout(() => {
    setLoadingStatus(false);
  }, 500);
}
