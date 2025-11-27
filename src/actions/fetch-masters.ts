import { setLoadingStatus } from '@/actions/set-loading-status';
import { mainState } from '@/state';
import { api } from '@/utils/http';
import { buildAvatarUrl } from '@/helpers/avatar-url';
import { normalizeYearsExperience } from '@/helpers/master-profile';
import type { Master } from '@/types/master';

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

  const response = await api.get(`/masters`, {
  params: {
    address: mainState.filter.address,
    skill: mainState.filter.skill,
    page: mainState.currentPage,
    pageSize: 10,
  },
});

  mainState.masters = response.data.items.map((master: Master) => ({
    ...normalizeYearsExperience(master),
    avatarUrl: buildAvatarUrl(master.avatarUrl),
  }));
  mainState.totalPages = Math.ceil(response.data.total / response.data.pageSize);

  // mainState.masters = masters.items;
  // mainState.totalPages = masters.total;

  setTimeout(() => {
    setLoadingStatus(false);
  }, 500);
}
