
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
