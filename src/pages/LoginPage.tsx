import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Star } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/generate');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/generate');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-display font-bold text-primary">StoryMagic</h1>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
            >
              Create Magical Stories with AI
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Generate personalized illustrated storybooks for children. Choose characters, themes, and art styles to create unique adventures.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Magical storybook with floating characters"
              className="rounded-2xl shadow-magical w-full max-w-md mx-auto lg:mx-0"
            />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4"
            >
              <Star className="h-6 w-6 text-secondary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          <Card className="story-card w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Welcome Back</CardTitle>
              <CardDescription>
                {isLogin ? 'Sign in to continue creating stories' : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="story-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="story-input"
                    required
                  />
                </div>
                <Button type="submit" className="magical-button w-full">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Demo: Use any email and password to continue
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;