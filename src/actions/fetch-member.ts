import { setLoadingStatus } from '@/actions/set-loading-status';
import { mainState } from '@/state';
import { api } from '@/utils/http';

// const mockedData = {
//   id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   email: "andriy.koval@example.com",
//   firstName: "Андрій",
//   lastName: "Коваль",
//   phone: "+380972345678",
//   avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
//   isMaster: true,
//   master: {
//     about: "Досвідчений майстер з ремонту побутової техніки. Працюю швидко, якісно та з гарантією.",
//     skills: [
//       "Електрика",
//       "Сантехніка",
//       "Монтаж техніки",
//       "Дрібний ремонт"
//     ],
//     yearsExperience: 7,
//     address: "Київ, Україна",
//     services: [
//       {
//         id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
//         name: "Ремонт пральних машин",
//         price: 800,
//         durationMinutes: 90,
//         description: "Повна діагностика та ремонт пральних машин будь-яких брендів.",
//         createdAtUtc: "2025-11-12T17:07:06.322Z",
//         updatedAtUtc: "2025-11-12T17:07:06.322Z"
//       },
//       {
//         id: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
//         name: "Встановлення посудомийної машини",
//         price: 600,
//         durationMinutes: 60,
//         description: "Підключення та перевірка роботи посудомийної машини.",
//         createdAtUtc: "2025-11-12T17:07:06.322Z",
//         updatedAtUtc: "2025-11-12T17:07:06.322Z"
//       },
//       {
//         id: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
//         name: "Ремонт електроплит",
//         price: 1000,
//         durationMinutes: 120,
//         description: "Заміна нагрівальних елементів та терморегуляторів у плитах.",
//         createdAtUtc: "2025-11-12T17:07:06.322Z",
//         updatedAtUtc: "2025-11-12T17:07:06.322Z"
//       }
//     ]
//   }
// };

export async function fetchMember(memberId: string) {
  setLoadingStatus(true);

  const response = await api.get(`/member/${memberId}`);

  mainState.user = response.data;

  setLoadingStatus(false);
}
