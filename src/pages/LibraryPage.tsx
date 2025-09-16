import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library, BookOpen, Trash2, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { pdfsAPI } from '@/services/api';

const LibraryPage = () => {
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [downloadingStories, setDownloadingStories] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const stories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    setSavedStories(stories);
  }, []);

  const handleDeleteStory = (storyId: string) => {
    const updatedStories = savedStories.filter(story => story.id !== storyId);
    setSavedStories(updatedStories);
    localStorage.setItem('savedStories', JSON.stringify(updatedStories));
    toast.success('Story deleted from library');
  };

  const handleDownloadStory = async (story: any) => {
    if (!story || !story.id) {
      toast.error('No story available for download');
      return;
    }

    try {
      setDownloadingStories(prev => new Set(prev).add(story.id));
      
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
      
      // Use the AI API to generate PDF directly with Pollinations.AI
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/ai/generate-pdf`, {
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
      setDownloadingStories(prev => {
        const newSet = new Set(prev);
        newSet.delete(story.id);
        return newSet;
      });
    }
  };

  const handleReadStory = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Library className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-display font-bold text-primary">My Story Library</h1>
            </motion.div>
            <p className="text-lg text-muted-foreground mb-6">
              Your collection of magical stories
            </p>
            <Button
              onClick={() => navigate('/generate')}
              className="magical-button flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Story
            </Button>
          </div>

          {/* Stories Grid */}
          {savedStories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-16"
            >
              <BookOpen className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                No stories yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first magical story to get started!
              </p>
              <Button
                onClick={() => navigate('/generate')}
                className="magical-button"
              >
                Create Your First Story
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="story-card group cursor-pointer h-full">
                    <CardHeader className="pb-4">
                      <div className="aspect-video bg-gradient-secondary rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-secondary-foreground opacity-50" />
                      </div>
                      <CardTitle className="text-lg font-display line-clamp-2">
                        {story.title}
                      </CardTitle>
                      <CardDescription>
                        {story.chapters?.length || 0} chapters • Saved {new Date(story.savedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReadStory(story.id)}
                          size="sm"
                          className="flex-1 magical-button text-sm"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          Read
                        </Button>
                        <Button
                          onClick={() => handleDownloadStory(story)}
                          size="sm"
                          variant="outline"
                          className="px-3"
                          disabled={downloadingStories.has(story.id)}
                        >
                          <Download className="h-3 w-3" />
                          {downloadingStories.has(story.id) && <span className="ml-1 text-xs">...</span>}
                        </Button>
                        <Button
                          onClick={() => handleDeleteStory(story.id)}
                          size="sm"
                          variant="outline"
                          className="px-3 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LibraryPage;