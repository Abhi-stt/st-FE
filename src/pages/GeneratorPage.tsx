import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VisualSelect } from '@/components/ui/visual-select';
import { Sparkles, Wand2, BookOpen, Mountain, Castle, Heart, Rocket, Waves, TreePine, Zap, Clock, Crown, Atom, Leaf, Flame, Anchor, Bot, Brush, Palette, Layers, Grid3X3, Gamepad2, BookOpenCheck, Zap as Lightning, Minimize } from 'lucide-react';

// Import theme images
import adventureImg from '@/assets/themes/adventure.jpg';
import fantasyImg from '@/assets/themes/fantasy.jpg';
import spaceImg from '@/assets/themes/space-journey.jpg';
import underwaterImg from '@/assets/themes/underwater-world.jpg';

// Import art style images
import animeImg from '@/assets/art-styles/anime.jpg';
import watercolorImg from '@/assets/art-styles/watercolor.jpg';
import pixelArtImg from '@/assets/art-styles/pixel-art.jpg';
import classicStorybookImg from '@/assets/art-styles/classic-storybook.jpg';

const themeOptions = [
  {
    value: 'adventure',
    label: 'Adventure',
    image: adventureImg,
    description: 'Exciting journeys and exploration'
  },
  {
    value: 'fantasy',
    label: 'Fantasy',
    image: fantasyImg,
    description: 'Magical worlds with mythical creatures'
  },
  {
    value: 'friendship',
    label: 'Friendship',
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    description: 'Stories about bonds and relationships'
  },
  {
    value: 'space-journey',
    label: 'Space Journey',
    image: spaceImg,
    description: 'Cosmic adventures among the stars'
  },
  {
    value: 'underwater-world',
    label: 'Underwater World',
    image: underwaterImg,
    description: 'Ocean depths and sea creatures'
  },
  {
    value: 'magical-forest',
    label: 'Magical Forest',
    icon: <TreePine className="h-5 w-5 text-green-500" />,
    description: 'Enchanted woods full of wonders'
  },
  {
    value: 'superheroes',
    label: 'Superheroes',
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    description: 'Heroes with amazing powers'
  },
  {
    value: 'time-travel',
    label: 'Time Travel',
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    description: 'Adventures across different eras'
  },
  {
    value: 'fairy-tales',
    label: 'Fairy Tales',
    icon: <Crown className="h-5 w-5 text-purple-500" />,
    description: 'Classic magical stories'
  },
  {
    value: 'science-fiction',
    label: 'Science Fiction',
    icon: <Atom className="h-5 w-5 text-cyan-500" />,
    description: 'Future technology and innovations'
  },
  {
    value: 'jungle-safari',
    label: 'Jungle Safari',
    icon: <Leaf className="h-5 w-5 text-green-600" />,
    description: 'Wild adventures in nature'
  },
  {
    value: 'mythical-creatures',
    label: 'Mythical Creatures',
    icon: <Flame className="h-5 w-5 text-red-500" />,
    description: 'Dragons, unicorns, and legends'
  },
  {
    value: 'pirates-treasure-hunt',
    label: 'Pirates & Treasure Hunt',
    icon: <Anchor className="h-5 w-5 text-amber-600" />,
    description: 'Seafaring adventures and hidden gold'
  },
  {
    value: 'robot-world',
    label: 'Robot World',
    icon: <Bot className="h-5 w-5 text-gray-500" />,
    description: 'Mechanical friends and AI adventures'
  }
];

const artStyleOptions = [
  {
    value: 'anime',
    label: 'Anime',
    image: animeImg,
    description: 'Japanese animation style with expressive characters'
  },
  {
    value: '3d-animation',
    label: '3D Animation',
    icon: <Layers className="h-5 w-5 text-blue-500" />,
    description: 'Modern computer-generated imagery'
  },
  {
    value: 'watercolor',
    label: 'Watercolor',
    image: watercolorImg,
    description: 'Soft, flowing paint effects'
  },
  {
    value: 'pixel-art',
    label: 'Pixel Art',
    image: pixelArtImg,
    description: 'Retro 8-bit digital style'
  },
  {
    value: 'claymation',
    label: 'Claymation',
    icon: <Brush className="h-5 w-5 text-orange-500" />,
    description: 'Stop-motion clay animation style'
  },
  {
    value: 'classic-storybook',
    label: 'Classic Storybook',
    image: classicStorybookImg,
    description: 'Traditional children\'s book illustrations'
  },
  {
    value: 'comic-book',
    label: 'Comic Book',
    icon: <Lightning className="h-5 w-5 text-red-500" />,
    description: 'Bold superhero comic style'
  },
  {
    value: 'flat-illustration',
    label: 'Flat Illustration',
    icon: <Minimize className="h-5 w-5 text-indigo-500" />,
    description: 'Clean, minimalist design'
  }
];

const GeneratorPage = () => {
  const [formData, setFormData] = useState({
    characterName: '',
    characterGender: '',
    characterAge: '',
    storyTheme: '',
    artStyle: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.characterName || !formData.storyTheme || !formData.artStyle) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const storyId = Date.now().toString();
      navigate(`/story/${storyId}`, { state: { formData } });
      setIsGenerating(false);
    }, 3000);
  };

  const isFormValid = formData.characterName && formData.storyTheme && formData.artStyle;

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Wand2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-display font-bold text-primary">Create Your Story</h1>
            </motion.div>
            <p className="text-lg text-muted-foreground">
              Fill in the details below and watch AI bring your story to life!
            </p>
          </div>

          <Card className="story-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Story Details
              </CardTitle>
              <CardDescription>
                Customize your character and story preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="characterName">Character Name *</Label>
                  <Input
                    id="characterName"
                    placeholder="e.g., Emma, Max, Luna..."
                    value={formData.characterName}
                    onChange={(e) => handleInputChange('characterName', e.target.value)}
                    className="story-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="characterAge">Character Age</Label>
                  <Input
                    id="characterAge"
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.characterAge}
                    onChange={(e) => handleInputChange('characterAge', e.target.value)}
                    className="story-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="characterGender">Character Gender</Label>
                <Select value={formData.characterGender} onValueChange={(value) => handleInputChange('characterGender', value)}>
                  <SelectTrigger className="story-input">
                    <SelectValue placeholder="Select gender (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storyTheme">Story Theme *</Label>
                <VisualSelect
                  options={themeOptions}
                  value={formData.storyTheme}
                  onValueChange={(value) => handleInputChange('storyTheme', value)}
                  placeholder="Choose your adventure..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artStyle">Illustration Style *</Label>
                <VisualSelect
                  options={artStyleOptions}
                  value={formData.artStyle}
                  onValueChange={(value) => handleInputChange('artStyle', value)}
                  placeholder="Pick your art style..."
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!isFormValid || isGenerating}
                  className="magical-button w-full h-12 text-lg"
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-5 w-5" />
                      Generating Your Story...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Generate My Story
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GeneratorPage;