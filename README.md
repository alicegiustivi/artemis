## Artemis

Artemis is a cycle syncing web app built with Next.js 14, Tailwind CSS, and Supabase.

### Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Backend-as-a-Service**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

### Environment variables

Create a file named `.env.local` in the project root with:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

Replace the placeholders with your actual Supabase project URL and anon key from the Supabase dashboard.

### Installation

```bash
cd "artemis"
npm install
```

### Running the dev server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

The app currently includes only the base Next.js + Tailwind + Supabase setup with no custom UI yet.

