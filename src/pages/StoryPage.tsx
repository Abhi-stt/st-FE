import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { storiesAPI, pdfsAPI } from '@/services/api';

// Mock story data
const generateMockStory = (formData: any) => {
  const characterName = formData.characterName || 'Alex';
  const theme = formData.storyTheme?.replace('-', ' ') || 'adventure';
  
  return {
    title: `${characterName} and the ${theme.charAt(0).toUpperCase() + theme.slice(1)} Quest`,
    chapters: [
      {
        id: 1,
        title: "The Beginning",
        content: `Once upon a time, there was a brave child named ${characterName}. ${characterName} lived in a cozy house at the edge of a magical forest. Every morning, ${characterName} would look out the window and wonder what adventures awaited beyond the tall, whispering trees.`,
        illustration: "https://picsum.photos/600/400?random=1"
      },
      {
        id: 2,
        title: "The Discovery",
        content: `One sunny morning, ${characterName} discovered something extraordinary hidden behind the old oak tree. It was a glowing map that seemed to shimmer with its own light! The map showed a path leading deep into the forest, with mysterious symbols marking special locations along the way.`,
        illustration: "https://picsum.photos/600/400?random=2"
      },
      {
        id: 3,
        title: "The Journey Begins",
        content: `Without hesitation, ${characterName} packed a small backpack with snacks and set off on the adventure. The forest was alive with magical creatures - friendly squirrels that could talk, butterflies that sparkled like gems, and flowers that chimed like tiny bells when the wind blew through them.`,
        illustration: "https://picsum.photos/600/400?random=3"
      },
      {
        id: 4,
        title: "The Challenge",
        content: `Soon, ${characterName} came across a wide river that blocked the path. The water was crystal clear but too deep to cross. Just when it seemed impossible to continue, a wise old turtle surfaced and offered to help. "I'll carry you across," said the turtle, "but first, you must solve my riddle!"`,
        illustration: "https://picsum.photos/600/400?random=4"
      },
      {
        id: 5,
        title: "The Happy Ending",
        content: `${characterName} cleverly solved the turtle's riddle and safely crossed the river. On the other side was the most beautiful garden anyone had ever seen, filled with magical fruits that granted wishes. ${characterName} made a wish for all the forest creatures to be happy and healthy forever. And they all lived happily ever after!`,
        illustration: "https://picsum.photos/600/400?random=5"
      }
    ]
  };
};

const StoryPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch real story from API first
        if (id && id !== 'demo') {
          try {
            const storyData = await storiesAPI.getById(id);
            setStory(storyData);
            return;
          } catch (error) {
            console.log('Could not fetch story from API, using mock data:', error);
          }
        }
        
        // Fallback to mock data if API fails or it's a demo
        const formData = location.state?.formData || {};
        setStory(generateMockStory(formData));
      } catch (error) {
        console.error('Error loading story:', error);
        toast.error('Failed to load story');
        // Use mock data as fallback
        const formData = location.state?.formData || {};
        setStory(generateMockStory(formData));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id, location.state]);

  const handleSaveStory = () => {
    // Save to localStorage for demo
    const savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    const storyToSave = {
      id,
      ...story,
      savedAt: new Date().toISOString()
    };
    savedStories.push(storyToSave);
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    toast.success('Story saved to your library!');
  };

  const handleDownloadPDF = async () => {
    if (!story || !story.id) {
      toast.error('No story available for download');
      return;
    }

    try {
      setIsDownloadingPDF(true);
      
      // For real stories, use the PDF API
      if (story.id && story.id !== 'demo') {
        try {
          // First generate the PDF
          const pdfResponse = await pdfsAPI.generate(story.id);
          console.log('PDF generated:', pdfResponse);
          
          // Then download it
          const blob = await pdfsAPI.download(pdfResponse.pdf.id);
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${story.title.replace(/[^a-zA-Z0-9]/g, '_')}_storybook.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast.success('PDF downloaded successfully!');
          return;
        } catch (apiError) {
          console.log('PDF API failed, trying alternative method:', apiError);
        }
      }
      
      // Fallback: Use the AI API to generate and download PDF directly
      const storyData = {
        theme: story.theme || 'adventure',
        art_style: story.art_style || 'watercolor',
        character_name: story.character_name || 'Alex',
        character_age: story.character_age || 10,
        character_gender: story.character_gender || 'non-binary',
        target_age: 'children'
      };
      
      // Use the AI API to generate PDF directly
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
      a.download = `${story.title.replace(/[^a-zA-Z0-9]/g, '_')}_storybook.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Story not found</h1>
          <Button onClick={() => navigate('/generate')} className="magical-button">
            Create New Story
          </Button>
        </div>
      </div>
    );
  }

  const currentChapterData = story.chapters[currentChapter];

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
          {/* Story Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-primary mb-4">
              {story.title}
            </h1>
            <div className="flex justify-center gap-4 mb-6">
              <Button onClick={handleSaveStory} variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save to Library
              </Button>
              <Button 
                onClick={handleDownloadPDF} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isDownloadingPDF}
              >
                <Download className="h-4 w-4" />
                {isDownloadingPDF ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              {story.chapters.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentChapter(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentChapter ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Story Content */}
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="story-card">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-primary">
                      Chapter {currentChapterData.id}: {currentChapterData.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground">
                      {currentChapterData.content}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={currentChapterData.illustration}
                      alt={`Illustration for ${currentChapterData.title}`}
                      className="rounded-2xl shadow-story max-w-full h-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentChapter(Math.min(story.chapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === story.chapters.length - 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryPage;