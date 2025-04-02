<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Calendar, Dumbbell, Wind, Running, Heart, MoreHorizontal } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Heart className="h-6 w-6" />
          <span className="font-bold">Fit Flow</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link to="/calendar" className="transition-colors hover:text-foreground/80 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Calendar</span>
          </Link>
          <Link to="/workout-library" className="transition-colors hover:text-foreground/80 flex items-center">
            <Dumbbell className="h-4 w-4 mr-1" />
            <span>Workout Library</span>
          </Link>
          <Link to="/strength-training" className="transition-colors hover:text-foreground/80 hidden md:flex items-center">
            <Dumbbell className="h-4 w-4 mr-1" />
            <span>Strength</span>
          </Link>
          <Link to="/mobility-training" className="transition-colors hover:text-foreground/80 hidden md:flex items-center">
            <Wind className="h-4 w-4 mr-1" />
            <span>Mobility</span>
          </Link>
          <Link to="/cardio-training" className="transition-colors hover:text-foreground/80 hidden md:flex items-center">
            <Running className="h-4 w-4 mr-1" />
            <span>Cardio</span>
          </Link>
          <Link to="/other-training" className="transition-colors hover:text-foreground/80 hidden md:flex items-center">
            <MoreHorizontal className="h-4 w-4 mr-1" />
            <span>Other</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
=======

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type Tab = {
  value: string;
  label: string;
  path: string;
};

const tabs: Tab[] = [
  {
    value: 'calendar',
    label: 'Calendar',
    path: '/',
  },
  {
    value: 'strength',
    label: 'Strength',
    path: '/strength',
  },
  {
    value: 'mobility',
    label: 'Mobility',
    path: '/mobility',
  },
  {
    value: 'running',
    label: 'Running',
    path: '/running',
  },
];

interface HeaderProps {
  activeTab?: string;
}

const Header = ({ activeTab = 'calendar' }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg bg-gradient-fitness bg-clip-text text-transparent">FitFlow</span>
          </Link>
        </div>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            {tabs.map((tab) => (
              <Link to={tab.path} key={tab.value}>
                <TabsTrigger 
                  value={tab.value}
                  className={cn(
                    "text-sm",
                    tab.value === "strength" && "data-[state=active]:text-strength data-[state=active]:border-b-2 data-[state=active]:border-strength",
                    tab.value === "mobility" && "data-[state=active]:text-mobility data-[state=active]:border-b-2 data-[state=active]:border-mobility",
                    tab.value === "running" && "data-[state=active]:text-running data-[state=active]:border-b-2 data-[state=active]:border-running"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};

export default Header;
>>>>>>> origin/main
