# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/16d9bcd0-bbb8-43a9-bc4e-6bb4e01a4b4a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/16d9bcd0-bbb8-43a9-bc4e-6bb4e01a4b4a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/16d9bcd0-bbb8-43a9-bc4e-6bb4e01a4b4a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
<<<<<<< HEAD

# Fit Flow Calendar

A comprehensive workout tracking and planning application built with React, TypeScript, and Supabase.

## Features

- 📅 Calendar to schedule and track workouts
- 💪 Workout templates for quick scheduling
- 📊 Training logs for different workout types:
  - Strength Training
  - Cardio Training
  - Mobility Training
  - Other Training
- 📱 Responsive design for desktop and mobile
- 🌙 Light and dark mode support

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (optional, app works in offline mode too)

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd fit-flow-calendar

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database Setup

If you want to use your own Supabase backend:

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

## App Structure

- `src/components`: UI components
- `src/pages`: Main page components
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and Supabase client
- `src/types`: TypeScript type definitions

## License

This project is licensed under the MIT License.
=======
>>>>>>> origin/main
