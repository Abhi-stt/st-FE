import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2, BookOpen, Check } from 'lucide-react';
import { aiAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Enhanced themes with icons and descriptions
const themes = [
  {
    id: 'adventure',
    name: 'Adventure',
    icon: '🗺️',
    description: 'Epic journeys and exciting discoveries',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: '🐉',
    description: 'Magical worlds and mystical creatures',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'friendship',
    name: 'Friendship',
    icon: '🤝',
    description: 'Heartwarming tales of companionship',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'space-journey',
    name: 'Space Journey',
    icon: '🚀',
    description: 'Interstellar adventures and cosmic wonders',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'underwater-world',
    name: 'Underwater World',
    icon: '🐠',
    description: 'Ocean depths and marine adventures',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'magical-forest',
    name: 'Magical Forest',
    icon: '🌳',
    description: 'Enchanted woods and nature magic',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'superheroes',
    name: 'Superheroes',
    icon: '🦸',
    description: 'Heroic powers and saving the day',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'time-travel',
    name: 'Time Travel',
    icon: '⏰',
    description: 'Journeys through past and future',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'fairy-tales',
    name: 'Fairy Tales',
    icon: '🧚',
    description: 'Classic magical stories and lessons',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'science-fiction',
    name: 'Science Fiction',
    icon: '🤖',
    description: 'Future technology and scientific wonders',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: 'jungle-safari',
    name: 'Jungle Safari',
    icon: '🦁',
    description: 'Wild animals and jungle exploration',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'mythical-creatures',
    name: 'Mythical Creatures',
    icon: '🦄',
    description: 'Legendary beasts and magical beings',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'pirates-treasure',
    name: 'Pirates & Treasure',
    icon: '🏴‍☠️',
    description: 'High seas adventure and hidden riches',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'robot-world',
    name: 'Robot World',
    icon: '🤖',
    description: 'Mechanical friends and digital adventures',
    color: 'from-gray-500 to-slate-600'
  }
];

// Enhanced art styles with visual representations
const artStyles = [
  {
    id: 'anime',
    name: 'Anime',
    icon: '🎌',
    description: 'Japanese animation style',
    color: 'from-pink-400 to-rose-500',
    preview: '✨ Colorful, expressive characters'
  },
  {
    id: '3d-animation',
    name: '3D Animation',
    icon: '🎬',
    description: 'Three-dimensional digital art',
    color: 'from-blue-400 to-indigo-500',
    preview: '🌟 Realistic depth and lighting'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    icon: '🎨',
    description: 'Soft, flowing paint technique',
    color: 'from-cyan-400 to-blue-500',
    preview: '💧 Gentle, dreamy atmosphere'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    icon: '👾',
    description: 'Retro digital pixel style',
    color: 'from-green-400 to-emerald-500',
    preview: '🕹️ Classic gaming aesthetic'
  },
  {
    id: 'claymation',
    name: 'Claymation',
    icon: '🧱',
    description: 'Sculpted clay characters',
    color: 'from-amber-400 to-orange-500',
    preview: '🏺 Textured, tactile feel'
  },
  {
    id: 'classic-storybook',
    name: 'Classic Storybook',
    icon: '📚',
    description: 'Traditional book illustration',
    color: 'from-brown-400 to-amber-500',
    preview: '📖 Timeless, nostalgic charm'
  },
  {
    id: 'comic-book',
    name: 'Comic Book',
    icon: '💥',
    description: 'Dynamic comic panel style',
    color: 'from-red-400 to-pink-500',
    preview: '💫 Bold lines and action'
  },
  {
    id: 'flat-illustration',
    name: 'Flat Illustration',
    icon: '🟦',
    description: 'Modern minimalist design',
    color: 'from-slate-400 to-gray-500',
    preview: '🔷 Clean, contemporary look'
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
  const [generationProgress, setGenerationProgress] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [generatedStorybook, setGeneratedStorybook] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.characterName || !formData.storyTheme || !formData.artStyle) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('Please log in to generate stories');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('Starting storybook generation...');
    setProgressPercentage(0);
    setGeneratedStorybook(null);
    setDownloadUrl(null);
    
    try {
      // Check if backend is running
      setGenerationProgress('Checking backend connection...');
      setProgressPercentage(10);
      
      try {
        const healthCheck = await fetch('http://localhost:8000/health', { method: 'GET' });
        if (!healthCheck.ok) {
          throw new Error('Backend not responding');
        }
        console.log('✅ Backend is running');
      } catch (error) {
        console.error('❌ Backend not accessible:', error);
        console.log('🔄 Trying fallback mock generation...');
        
        // Fallback: Create a mock story for testing
        const mockStory = {
          story: {
            title: `${formData.characterName}'s ${formData.storyTheme} Adventure`,
            content: `Once upon a time, ${formData.characterName} discovered a magical world. They met friendly creatures and learned important lessons. The adventure taught them about friendship and courage. They returned home with wonderful memories.`,
            theme: formData.storyTheme,
            art_style: formData.artStyle,
            character_name: formData.characterName,
            character_age: formData.characterAge ? parseInt(formData.characterAge) : 10,
            character_gender: formData.characterGender || 'non-binary',
            target_age: 'children',
            word_count: 45,
            reading_time_minutes: 1,
            provider: 'mock-fallback'
          }
        };
        
        console.log('📚 Using mock story:', mockStory);
        
        // Create mock chapters
        const chapters = mockStory.story.content.split('.').filter(s => s.trim().length > 0).slice(0, 5);
        const storyChapters = chapters.map((sentence, index) => ({
          chapter_number: index + 1,
          title: `Page ${index + 1}`,
          content: sentence.trim() + '.',
          word_count: sentence.split(' ').length,
          illustration_url: null,
          illustration_prompt: 'Mock illustration (backend not available)'
        }));

        const completeStorybook = {
          ...mockStory.story,
          chapters: storyChapters
        };

        setGeneratedStorybook(completeStorybook);
        setGenerationProgress('Mock storybook ready (backend not available)');
        setProgressPercentage(100);
        toast.warning('Backend not available - using mock story. Please start the backend server for full functionality.');
        return;
      }
      
      // Use the simple story generation endpoint
      setGenerationProgress('Generating story with Pollinations.AI...');
      setProgressPercentage(20);
      
      console.log('🚀 Starting story generation with data:', {
        theme: formData.storyTheme,
        art_style: formData.artStyle,
        character_name: formData.characterName,
        character_age: formData.characterAge ? parseInt(formData.characterAge) : undefined,
        character_gender: formData.characterGender || undefined,
        target_age: 'children'
      });
      
      const storyResponse = await fetch('http://localhost:8000/api/ai/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('storyUser') ? JSON.parse(localStorage.getItem('storyUser')!).token : ''}`,
        },
        body: JSON.stringify({
          theme: formData.storyTheme,
          art_style: formData.artStyle,
          character_name: formData.characterName,
          character_age: formData.characterAge ? parseInt(formData.characterAge) : undefined,
          character_gender: formData.characterGender || undefined,
          target_age: 'children'
        }),
      });

      console.log('📡 Story response status:', storyResponse.status);
      
      if (!storyResponse.ok) {
        const errorText = await storyResponse.text();
        console.error('❌ Story generation failed:', errorText);
        throw new Error(`Failed to generate story: ${storyResponse.status} - ${errorText}`);
      }

      const story = await storyResponse.json();
      console.log('✅ Story generated successfully:', story);
      
      setGenerationProgress('Story generated! Preparing chapters...');
      setProgressPercentage(40);

      // Split story into chapters
      const chapters = story.story.content.split('.').filter(s => s.trim().length > 0).slice(0, 5);
      const storyChapters = chapters.map((sentence, index) => ({
        chapter_number: index + 1,
        title: `Page ${index + 1}`,
        content: sentence.trim() + '.',
        word_count: sentence.split(' ').length
      }));

      setGenerationProgress('Generating illustrations with Pollinations.AI...');
      setProgressPercentage(60);

      // Generate illustrations for each chapter
      const chaptersWithIllustrations = [];
      for (let i = 0; i < storyChapters.length; i++) {
        const chapter = storyChapters[i];
        setGenerationProgress(`Generating illustration ${i + 1} of ${storyChapters.length}...`);
        setProgressPercentage(60 + (i * 20 / storyChapters.length));

        try {
          console.log(`🎨 Generating illustration ${i + 1} for:`, chapter.content);
          
          const illustrationResponse = await fetch('http://localhost:8000/api/ai/generate-illustration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('storyUser') ? JSON.parse(localStorage.getItem('storyUser')!).token : ''}`,
            },
            body: JSON.stringify({
              prompt: `A detailed children's book illustration showing ${formData.characterName} ${chapter.content}, ${formData.artStyle} style, children's book illustration, safe for children`,
              art_style: formData.artStyle
            }),
          });

          console.log(`📡 Illustration ${i + 1} response status:`, illustrationResponse.status);

          if (illustrationResponse.ok) {
            const illustration = await illustrationResponse.json();
            console.log(`✅ Illustration ${i + 1} generated successfully`);
            chaptersWithIllustrations.push({
              ...chapter,
              illustration_url: illustration.illustration.image_url,
              illustration_prompt: illustration.illustration.prompt
            });
          } else {
            const errorText = await illustrationResponse.text();
            console.error(`❌ Illustration ${i + 1} generation failed:`, errorText);
            chaptersWithIllustrations.push({
              ...chapter,
              illustration_url: null,
              illustration_prompt: `Illustration generation failed: ${errorText}`
            });
          }
        } catch (error) {
          console.error(`❌ Error generating illustration for chapter ${i + 1}:`, error);
          chaptersWithIllustrations.push({
            ...chapter,
            illustration_url: null,
            illustration_prompt: `Illustration generation failed: ${error.message}`
          });
        }
      }

      // Create complete storybook
      const completeStorybook = {
        ...story.story,
        chapters: chaptersWithIllustrations
      };

      console.log('📚 Complete storybook created:', completeStorybook);
      console.log('📊 Chapters with illustrations:', chaptersWithIllustrations.filter(c => c.illustration_url).length);
      
      setGeneratedStorybook(completeStorybook);
      setGenerationProgress('Storybook ready for download!');
      setProgressPercentage(100);
      toast.success('Storybook generated successfully!');
      
      console.log('✅ generatedStorybook state set:', completeStorybook);

    } catch (error) {
      console.error('Storybook generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate storybook');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedStorybook) return;
    
    try {
      // Use the direct PDF generation endpoint
      const storyData = {
        theme: formData.storyTheme,
        art_style: formData.artStyle,
        character_name: formData.characterName,
        character_age: formData.characterAge ? parseInt(formData.characterAge) : undefined,
        character_gender: formData.characterGender || undefined,
        target_age: 'children'
      };
      
      const response = await fetch('http://localhost:8000/api/ai/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('storyUser') ? JSON.parse(localStorage.getItem('storyUser')!).token : ''}`,
        },
        body: JSON.stringify(storyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.characterName || 'Story'}_${formData.storyTheme || 'Adventure'}_storybook.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Storybook downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download storybook');
    }
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
          className="max-w-4xl mx-auto"
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
            <CardContent className="space-y-8">
              {/* Character Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Character Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
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
                    <Label htmlFor="characterGender">Character Gender</Label>
                    <Select
                      value={formData.characterGender}
                      onValueChange={(value) => handleInputChange('characterGender', value)}
                    >
                      <SelectTrigger className="story-select">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="characterAge">Character Age</Label>
                    <Input
                      id="characterAge"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g., 8"
                      value={formData.characterAge}
                      onChange={(e) => handleInputChange('characterAge', e.target.value)}
                      className="story-input"
                    />
                  </div>
                </div>
              </div>

              {/* Selection Summary */}
              {(formData.storyTheme || formData.artStyle) && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Your Story Preview
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {formData.storyTheme && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm">
                          {themes.find(t => t.name === formData.storyTheme)?.icon || '📖'}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Theme</p>
                          <p className="font-medium text-sm">{formData.storyTheme}</p>
                        </div>
                      </div>
                    )}
                    {formData.artStyle && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm">
                          {artStyles.find(s => s.name === formData.artStyle)?.icon || '🎨'}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Art Style</p>
                          <p className="font-medium text-sm">{formData.artStyle}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Story Theme Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Choose Your Story Theme *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {themes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`theme-selection-card ${
                          formData.storyTheme === theme.name ? 'selected' : ''
                        }`}
                        onClick={() => handleInputChange('storyTheme', theme.name)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`theme-icon-container bg-gradient-to-r ${theme.color}`}>
                            {theme.icon}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{theme.name}</h4>
                          <p className="text-xs text-muted-foreground leading-tight">{theme.description}</p>
                          {formData.storyTheme === theme.name && (
                            <div className="selection-indicator">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Art Style Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Choose Your Art Style *</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {artStyles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`theme-selection-card ${
                          formData.artStyle === style.name ? 'selected' : ''
                        }`}
                        onClick={() => handleInputChange('artStyle', style.name)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`theme-icon-container bg-gradient-to-r ${style.color}`}>
                            {style.icon}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{style.name}</h4>
                          <p className="text-xs text-muted-foreground leading-tight mb-2">{style.description}</p>
                          <p className="text-xs text-primary font-medium">{style.preview}</p>
                          {formData.artStyle === style.name && (
                            <div className="selection-indicator">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Generation Progress */}
              {generationProgress && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">{generationProgress}</span>
                  </div>
                  {isGenerating && (
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* Generated Storybook Preview */}
              {generatedStorybook && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-3">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Storybook Ready!</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-800">{generatedStorybook.title}</h4>
                    <p className="text-sm text-green-700">
                      {generatedStorybook.chapters?.length || 0} pages • {generatedStorybook.chapters?.filter((c: any) => c.illustration_url).length || 0} illustrations
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => navigate('/library')}
                        variant="outline"
                        size="sm"
                      >
                        View in Library
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Debug info - Hidden for better UX */}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="w-full story-button"
                size="lg"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Storybook...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Generate Storybook
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GeneratorPage;