# AI Notes App

A modern AI-powered notes application built with Next.js, Supabase, and Gemini AI. Create, manage, and summarize your notes with AI assistance.

## Features

### 🔐 Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes and sessions
- Secure user data management

### 📝 Notes Management
- Create, read, update, and delete notes
- Real-time search functionality
- Automatic save and sync
- Sort notes by last modified
- Rich text content support

### 🤖 AI Integration
- One-click note summarization using Gemini AI
- Smart content analysis
- Efficient processing of long notes

### 💅 User Interface
- Clean and modern design using Shadcn UI
- Responsive layout for all devices
- Dark/Light mode support
- Smooth transitions and animations

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase
- **State Management**: TanStack Query (React Query)
- **AI**: Gemini API
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18 or later
- PNPM package manager
- Supabase account
- Gemini API key

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/notes-ai.git
cd notes-ai
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env.local` file with your credentials:
```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_AI_API_KEY=your-gemini-api-key
```

### Database Setup

1. Create a new Supabase project

2. Set up the notes table:
```sql
create table notes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table notes enable row level security;

-- Create policy for users to access only their notes
create policy "Users can CRUD their own notes"
on notes
for all
using (auth.uid() = user_id);
```

### Running the App

1. Start the development server:
```sh
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Authentication**
   - Sign up with email/password or Google
   - Access your personal notes dashboard

2. **Managing Notes**
   - Create new notes with the "+" button
   - Edit notes in real-time
   - Search notes using the search bar
   - Delete notes with the delete button

3. **AI Features**
   - Click the AI button on any note to generate a summary
   - View and edit the generated summary

## License

MIT License - See [LICENSE](LICENSE) for details
