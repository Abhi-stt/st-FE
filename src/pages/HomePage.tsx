import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Sparkles, Star, Palette, Users, Clock, Shield, ArrowRight, Play, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import heroImage from '@/assets/hero-image.jpg';
import readingChildren from '@/assets/reading-children.jpg';
import artStylesShowcase from '@/assets/art-styles-showcase.jpg';
import storyCreation from '@/assets/story-creation.jpg';

const HomePage = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsSignInOpen(false);
      navigate('/generate');
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to StoryMagic.",
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleExampleClick = () => {
    navigate('/story/demo');
  };

  const handlePurchaseClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Premium plans will be available soon with unlimited stories.",
    });
  };

  if (user) {
    navigate('/generate');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-display font-bold text-primary">StoryMagic</h1>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={handleExampleClick} className="text-foreground hover:text-primary">
              <Play className="h-4 w-4 mr-2" />
              View Example
            </Button>
            <Button variant="ghost" onClick={handlePurchaseClick} className="text-foreground hover:text-primary">
              <CreditCard className="h-4 w-4 mr-2" />
              Pricing
            </Button>
            <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
              <DialogTrigger asChild>
                <Button className="magical-button">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center font-display text-2xl">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSignIn} className="space-y-4">
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
                
                <div className="text-center">
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
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo: Use any email and password to continue
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight"
                >
                  Create Magical Stories with AI
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground leading-relaxed"
                >
                  Generate personalized illustrated storybooks for children. Choose characters, themes, and art styles to create unique adventures that spark imagination.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button onClick={() => setIsSignInOpen(true)} className="magical-button text-lg px-8 py-4">
                  Start Creating Stories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={handleExampleClick} className="text-lg px-8 py-4 border-2">
                  View Example Story
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Magical storybook with floating characters and sparkles"
                className="rounded-2xl shadow-story w-full"
              />
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="h-12 w-12 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4"
              >
                <Star className="h-8 w-8 text-secondary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Endless Possibilities for Storytelling
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform offers unlimited creativity with diverse art styles and themes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="story-card h-full">
                <CardHeader className="text-center">
                  <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="font-display">8+ Art Styles</CardTitle>
                  <CardDescription>
                    From anime to watercolor, choose the perfect artistic style for your story
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="story-card h-full">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="font-display">Personalized Characters</CardTitle>
                  <CardDescription>
                    Create unique characters with custom names, ages, and personalities
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="story-card h-full">
                <CardHeader className="text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="font-display">Quick Generation</CardTitle>
                  <CardDescription>
                    Get your complete illustrated story in just minutes, not hours
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* Visual Showcase */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <img
                src={readingChildren}
                alt="Children reading magical stories in various settings"
                className="rounded-2xl shadow-magical w-full h-64 object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-center">Engaging Stories</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <img
                src={artStylesShowcase}
                alt="Showcase of different AI art styles including anime, 3D, watercolor"
                className="rounded-2xl shadow-magical w-full h-64 object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-center">Multiple Art Styles</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <img
                src={storyCreation}
                alt="Magical writing workspace with glowing elements"
                className="rounded-2xl shadow-magical w-full h-64 object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-center">AI-Powered Creation</h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about creating magical stories
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  How does the AI story generation work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Our advanced AI analyzes your character details, chosen theme, and preferred art style to create a unique, personalized story. Each story is generated fresh with custom illustrations that match your selections perfectly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  What art styles are available?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We offer 8+ distinct art styles including Anime, 3D Animation, Watercolor, Pixel Art, Claymation, Classic Storybook, Comic Book, and Flat Illustration. Each style creates a completely different visual experience for your story.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  How long does it take to generate a story?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Most stories are generated within 2-3 minutes. The AI needs time to craft both the narrative and create custom illustrations for each scene. You'll see a progress indicator while your magical story comes to life.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  Can I save and share my stories?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Absolutely! All your generated stories are automatically saved to your personal library. You can download them as beautiful PDFs to share with family and friends, or read them online anytime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  Is it safe for children?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes! All our stories are designed to be completely child-friendly. Our AI is trained to create positive, educational, and age-appropriate content that parents can feel confident sharing with their children.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="story-card">
                <AccordionTrigger className="text-left font-display font-semibold text-lg">
                  What themes are available?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Choose from 15+ exciting themes including Adventure, Fantasy, Friendship, Space Journey, Underwater World, Magical Forest, Superheroes, Time Travel, Fairy Tales, Science Fiction, and many more. Each theme creates unique storylines and settings.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-magical">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground">
              Ready to Create Magic?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of families creating personalized storybooks that spark imagination and create lasting memories.
            </p>
            <Button 
              onClick={() => setIsSignInOpen(true)} 
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 text-lg px-10 py-4 rounded-2xl font-semibold"
            >
              Start Your First Story
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold text-primary">StoryMagic</span>
          </div>
          <p className="text-muted-foreground">
            Creating magical stories with AI • Made with ❤️ for storytellers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;