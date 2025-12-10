# BeTendly - Beauty Booking Platform (Frontend)

BeTendly is a web application that connects clients with beauty specialists by offering a single digital space for browsing stylists, exploring services, and managing bookings. This repository contains the frontend part of the BeTendly MVP that was developed within a Master's thesis project.

The platform enables end users to discover stylists and request appointments while giving professionals the tools to manage schedules, services, portfolios, and booking approvals.

---

## Project Purpose

This project was completed as part of a Master's program in Computer Science with the following goals:

- Design and implement an MVP-grade booking platform
- Demonstrate modern frontend development practices
- Apply scalable architectural patterns
- Showcase collaboration and software engineering workflows

---

## Key Features

### Clients
- View stylist profiles
- Explore available beauty services
- Request appointment slots
- Manage booking requests

### Stylists
- Manage the list of services
- Use calendar-based scheduling
- Approve or decline booking requests
- Edit personal profile and portfolio

### General
- Responsive mobile-friendly UI
- API-driven architecture
- Secure authentication (via backend API)

---

## Technology Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for development and builds
- **Vuetify 3** component framework
- **Vue Router** for navigation
- **Axios** for HTTP requests
- **ESLint + TypeScript** for linting and type safety

---

## Project Structure

```
src/
  components/
  pages/
  layouts/
  router/
  services/
  utils/
  assets/
  main.ts
  App.vue
```

This modular layout keeps features organized and maintainable.

---

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```
3. Build for production
   ```bash
   npm run build
   ```
4. Preview the production build
   ```bash
   npm run preview
   ```

### Environment Variables

Create a `.env` file and adjust the values for your backend:

```ini
VITE_API_URL=<backend-api-url>
VITE_APP_ENV=development
```

---

## Backend Integration

The frontend communicates with the BeTendly backend API, which handles:

- User authentication
- Booking and scheduling logic
- Calendar availability
- Service management
- Media uploads

The backend is maintained in a separate repository.

---

## Team and Roles

This project was developed collaboratively as part of the Master's thesis:

- Team Lead / Frontend Developer: Alexander Kidanov
- Backend Developer
- UI/UX Designer
- QA and Infrastructure Support

---

## MVP Scope

The MVP delivered for diploma evaluation includes:

- User and stylist registration
- Service management for stylists
- Booking request workflow
- Calendar-focused UI
- Viewing stylist profiles
- Responsive experience for desktop and mobile

Future work encompasses payment integration, notifications, advanced search, and dedicated mobile apps.

---

## License and Access

This repository is part of an academic project and may remain public only for diploma evaluation. Access can be restricted afterwards, and unauthorized commercial use is prohibited.
