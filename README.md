# Music Rating App

A React Native mobile application for a college project that serves as a music/audio evaluation platform.

## Features

* **User Flow**: Sign up, log in, browse unrated clips, listen to the audio, and evaluate clips.
* **Admin Flow**: Upload audio clips, manage active questions, delete clips, and download results as CSV.
* **Database & Auth**: Powered by Supabase for authentication, PostgreSQL for data storage, and Storage for audio files.

## Prerequisites

* Node.js
* Expo CLI (`npm install -g expo-cli`)
* Supabase Account
* Expo Go app on your physical device (or iOS Simulator / Android Emulator)

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables. Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_ADMIN_EMAIL=admin@example.com
```

## Supabase Setup

1. Create a new Supabase project.
2. In the SQL Editor, execute the contents of `supabase/schema.sql` to create all tables, policies, and triggers.
3. In the SQL Editor, execute the contents of `supabase/seed.sql` to populate default questions.
4. Go to **Storage**, create a new bucket named `audio-clips`. Make sure it's Public if your RLS permits, or just follow the policy comments in the schema.
5. In **Authentication**, manually create a user with the email that matches `EXPO_PUBLIC_ADMIN_EMAIL` to serve as your admin account.

## Run

To start the development server:

```bash
npx expo start
```

Scan the QR code shown in the terminal with the Expo Go app on your phone.

## Roles

* **Admin**: The email configured in `.env` is treated as the admin account. After logging in, this user is redirected to the Admin panel.
* **User**: Any newly registered user will see the normal User interface.

## Tech Stack

* React Native / Expo
* Expo Router
* Expo AV (Audio playback)
* Supabase (Database, Auth, Storage)
* TypeScript
