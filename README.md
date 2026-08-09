# MeetPlan Dashboard

MeetPlan is a responsive meeting-planning dashboard built with Next.js App Router, JavaScript, Tailwind CSS, and NextAuth.js. It includes optional Google Calendar sign-in and displays the signed-in user’s meetings directly in the dashboard.

## Features

- Responsive desktop dashboard with a full sidebar.
- Compact icon-only navigation on tablet.
- Bottom navigation on mobile.
- Google Calendar connection through Google OAuth and NextAuth.js.
- Real events loaded from today through the next seven days.
- A dedicated **Today’s Schedule** timeline showing only today’s meetings.
- Google Meet, Zoom, and Microsoft Teams logos selected automatically when their conference links are present on an event.
- Local dashboard artwork and meeting-platform assets served from `public/`.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
3. Add the OAuth values described below.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-string
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

Generate `NEXTAUTH_SECRET` with a secure random-string generator. In production, update `NEXTAUTH_URL` to your deployed URL.

## Google Cloud Console setup

1. Create or select a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Open **APIs & Services → Library**, find **Google Calendar API**, and enable it.
3. Open **Google Auth Platform → Branding** and complete the required application details.
4. Open **Google Auth Platform → Audience** and select **External** when signing in with personal Gmail accounts.
5. While the OAuth app is in **Testing** status, use **Audience → Test users → Add users** to add every Google account that should be allowed to connect.
6. Open **Google Auth Platform → Clients**, create an **OAuth client ID** for a **Web application**, and add this exact redirect URI:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

7. Copy the generated client ID and client secret into `.env.local`, then restart the dev server.

For a deployed app, add its exact callback URL as another Authorized redirect URI, for example:

```text
https://your-domain.com/api/auth/callback/google
```

## Calendar behavior

Click **Connect Google Calendar** and approve the requested read-only scope:

```text
https://www.googleapis.com/auth/calendar.readonly
```

After sign-in, MeetPlan fetches the primary Google Calendar from the current day through the next seven days. It replaces the mock content with the returned events:

- **Today’s Schedule** contains only meetings occurring today.
- **Upcoming Meetings** contains the next events in the seven-day window.
- An empty state is shown when there are no matching events.
- Google OAuth access tokens are refreshed automatically when needed.

If Google shows `Error 403: access_denied` or says the app is still being tested, add the sign-in email to **Google Auth Platform → Audience → Test users**. This is required until you publish and, where required, verify the OAuth app for broader access.

## Production build

```bash
npm run build
```
