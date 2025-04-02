# Fit Flow Calendar

A comprehensive workout tracking and planning application built with React, TypeScript, and Supabase. Deploy on Vercel for seamless access from any device.

## Deployment Status

This application is configured for deployment on Vercel with a Supabase backend.

## Features

- 📅 Calendar to schedule and track workouts
- 💪 Workout templates for quick scheduling
- 📊 Training logs for different workout types:
  - Strength Training
  - Cardio Training
  - Mobility Training
  - Other Training
- 🔐 User authentication with email/password
- 🌙 Light and dark mode support
- 📱 Responsive design for desktop and mobile
- 🔄 Offline mode with sample data

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (optional, app works in offline mode too)
- Vercel account (for deployment)

### Local Development

```sh
# Clone the repository
git clone https://github.com/Handicam007/Fit-Flow-App.git

# Navigate to the project directory
cd Fit-Flow-App

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database Setup

To set up your own Supabase backend:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env` file in the project root with the following:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the database setup script in the Supabase SQL Editor:
   - Copy the contents of `setup-database.sql` 
   - Paste into the SQL Editor in your Supabase dashboard
   - Run the SQL queries

### Authentication Setup

The application includes a complete authentication system with:
- Email/password sign-in
- User registration
- Password reset functionality
- Profile settings

To enable authentication in Supabase:
1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider
3. Configure your site URL and redirect URLs:
   - Site URL: Your deployed application URL
   - Redirect URLs: 
     - `https://your-app-url.vercel.app/auth-callback`
     - `https://your-app-url.vercel.app/settings`

### Deployment with Vercel

For deployment with Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy your application

### Offline Mode

The application includes fallback sample data and works without a Supabase connection. All CRUD operations will work locally within the current session.

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS with shadcn/ui
- **State Management**: React Hooks
- **Backend/Database**: Supabase
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## App Structure

- `src/components`: UI components
- `src/pages`: Main page components including Auth and Settings
- `src/hooks`: Custom React hooks for data management
- `src/lib`: Utility functions and Supabase client
- `src/types`: TypeScript type definitions

## License

This project is licensed under the MIT License.
