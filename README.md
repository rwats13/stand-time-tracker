# Stand Time Tracker

A PWA for tracking standing desk time, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Countdown Timer** — set a duration in 5-minute increments, saves elapsed time on completion or early stop
- **Stopwatch** — count up freely, saves elapsed time when stopped
- **Manual Add** — enter start/end times to log standing time (coming soon)
- **History** — view daily standing time totals and individual sessions (coming soon)
- **Heatmap & Insights** — visualize trends and statistics (coming soon)

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Toasts**: Goey Toast (blob-animated notifications)
- **Timer**: Web Worker for background accuracy

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

## Database Setup

Run the contents of `supabase-setup.sql` in your Supabase project's SQL Editor.
