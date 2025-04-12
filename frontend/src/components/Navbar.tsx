
import React from 'react';
import { Bell, Settings, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <header className="bg-industrial-blue border-b border-industrial-steel/50 py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-xl font-semibold text-white">Siren Command Center</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-industrial-steel/20">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-industrial-steel/20">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-industrial-steel/20">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-industrial-steel flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
