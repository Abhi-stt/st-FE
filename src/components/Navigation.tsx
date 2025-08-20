import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Wand2, Library, LogOut, User } from 'lucide-react';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/generate', label: 'Generate', icon: Wand2 },
    { path: '/library', label: 'Library', icon: Library },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/generate')}
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold text-primary">StoryMagic</span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 ${
                      isActive ? 'magical-button' : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* User Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex items-center gap-2 ${
                    isActive ? 'magical-button' : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};