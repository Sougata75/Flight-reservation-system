# ✈️ NextFly

NextFly is a full-stack flight reservation system designed to provide a seamless booking experience for users and a powerful management interface for administrators.

## 📖 Description

**User Portal:** 
Travelers can easily search for available flights, complete their bookings, manage seat selections, check-in online, and print their flight tickets.

**Admin Dashboard:** 
Administrators have access to a secure dashboard to manage the platform. Capabilities include adding, updating, reading, and deleting flights. Admins can also manage user accounts, handle ticket cancellations, and analyze platform data such as total revenue.

## 🛠️ Tech Stack

* **Framework:** Next.js
* **State Management:** Redux Toolkit
* **Data Fetching:** Tanstack Query
* **UI Components:** Shadcn UI, Magic UI
* **Language:** TypeScript
* **Backend/Database:** Supabase

## 📂 Folder Structure

```

├── 📁 public/
│   ├── 📁 videos/
│   ├── 🖼️ 36af1edea564af352dbcd841fd09de3fab0d029b.png
│   ├── 📄 favicon.ico
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ logo.png
│   ├── 🖼️ next.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (auth)/
│   │   │   └── 📁 authentication/
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 (user-site)/
│   │   │   ├── 📁 boarding-pass/
│   │   │   │   └── 📁 [bookingId]/
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 booking/
│   │   │   │   ├── 📁 passenger-info/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 payments/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 seat-selection/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📁 success/
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 check-in/
│   │   │   │   ├── 📁 [bookingId]/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 experience/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 flight-status/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 manage/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 profile/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 search/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 ticket/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 admin/
│   │   │   ├── 📁 analytics/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 bookings/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 flights/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 settings/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 users/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 layout.tsx
│   │   ├── 📁 api/
│   │   │   └── 📁 create-payment-intent/
│   │   │       └── 📄 route.ts
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 providers.tsx
│   ├── 📁 banner/
│   ├── 📁 components/
│   │   ├── 📁 admin/
│   │   │   ├── 📄 ActiveFlights.tsx
│   │   │   ├── 📄 CapacitYProgress.tsx
│   │   │   ├── 📄 EditMode.tsx
│   │   │   ├── 📄 FlightDetails.tsx
│   │   │   └── 📄 FlightStats.tsx
│   │   ├── 📁 ui/
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 chart.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 progress.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   └── 📄 video-text.tsx
│   │   ├── 📁 user/
│   │   │   └── 📁 book/
│   │   │       ├── 📄 DestinationDiscovery.tsx
│   │   │       ├── 📄 FlightSearch.tsx
│   │   │       ├── 📄 SearchFlightResult.tsx
│   │   │       └── 📄 StripeCheckOutForm.tsx
│   │   ├── 📄 Login.tsx
│   │   ├── 📄 Logo.tsx
│   │   └── 📄 Signup.tsx
│   ├── 📁 hooks/
│   │   ├── 📄 useAdminHooks.ts
│   │   ├── 📄 useAuth.ts
│   │   ├── 📄 useBookingData.ts
│   │   ├── 📄 useBookings.ts
│   │   ├── 📄 useFlight.ts
│   │   ├── 📄 useFlightData.ts
│   │   └── 📄 useRedux.ts
│   ├── 📁 layouts/
│   │   ├── 📁 admin/
│   │   │   ├── 📄 Navbar.tsx
│   │   │   └── 📄 Sidebar.tsx
│   │   ├── 📄 Footer.tsx
│   │   └── 📄 Header.tsx
│   ├── 📁 lib/
│   │   ├── 📄 supabaseClient.ts
│   │   └── 📄 utils.ts
│   ├── 📁 services/
│   │   ├── 📁 helper/
│   │   ├── 📁 json/
│   │   │   ├── 📄 airCraft.routeConfiguration.ts
│   │   │   ├── 📄 aircraftConfiguration.ts
│   │   │   ├── 📄 flights.table.ts
│   │   │   ├── 📄 nationality.counteries.ts
│   │   │   ├── 📄 navigation.routes.ts
│   │   │   └── 📄 user.authToken.ts
│   │   └── 📁 validation/
│   │       ├── 📄 auth.signupValidation.ts
│   │       ├── 📄 flight.addValidation.ts
│   │       ├── 📄 flightSearch.validation.ts
│   │       └── 📄 passenger.validation.ts
│   ├── 📁 store/
│   │   ├── 📁 slices/
│   │   │   └── 📄 global.slice.ts
│   │   └── 📄 store.ts
│   ├── 📁 typescript/
│   │   ├── 📁 interfaces/
│   │   │   ├── 📄 aircraftConfig.interface.ts
│   │   │   ├── 📄 auth.interface.ts
│   │   │   ├── 📄 interface.props.ts
│   │   │   ├── 📄 interface.routes.ts
│   │   │   ├── 📄 selecctedFlight.interface.ts
│   │   │   └── 📄 userData.interface.ts
│   │   └── 📁 types/
│   │       └── 📄 redux.type.ts
│   └── 📄 middleware.ts
├── 📁 videos/
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ components.json
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
├── ⚙️ tsconfig.json
└── 📄 video.d.ts

```
