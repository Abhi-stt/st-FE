import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2, BookOpen } from 'lucide-react';

const themes = [
  'Adventure', 'Fantasy', 'Friendship', 'Space Journey', 'Underwater World',
  'Magical Forest', 'Superheroes', 'Time Travel', 'Fairy Tales', 'Science Fiction',
  'Jungle Safari', 'Mythical Creatures', 'Pirates & Treasure Hunt', 'Robot World'
];

const artStyles = [
  'Anime', '3D Animation', 'Watercolor', 'Pixel Art', 'Claymation',
  'Classic Storybook', 'Comic Book', 'Flat Illustration'
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
                <Select value={formData.storyTheme} onValueChange={(value) => handleInputChange('storyTheme', value)}>
                  <SelectTrigger className="story-input">
                    <SelectValue placeholder="Choose your adventure..." />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme} value={theme.toLowerCase().replace(/\s+/g, '-')}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="artStyle">Illustration Style *</Label>
                <Select value={formData.artStyle} onValueChange={(value) => handleInputChange('artStyle', value)}>
                  <SelectTrigger className="story-input">
                    <SelectValue placeholder="Pick your art style..." />
                  </SelectTrigger>
                  <SelectContent>
                    {artStyles.map((style) => (
                      <SelectItem key={style} value={style.toLowerCase().replace(/\s+/g, '-')}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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