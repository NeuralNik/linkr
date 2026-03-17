import { Github, Linkedin, Mail, Code, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Developer() {
  const { t } = useTranslation();
  
  const skills = [
    'React.js', 'Python Programming', 'UI/UX Design', 
    'Database Designing', 'AI/ML', 'Gen AI'
  ];

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-primary p-1 animate-glow">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <Code className="w-16 h-16 text-neon-green" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            {t('developer.greeting')}{' '}
            <span className="text-neon-green text-glow">{t('developer.name')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('developer.tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* About Me */}
          <Card className="lg:col-span-2 glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green flex items-center gap-2">
                <Heart className="w-6 h-6" />
                {t('developer.aboutMeTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {t('developer.aboutMeDesc1')}
              </p>
              <p>
                {t('developer.aboutMeDesc2')}
              </p>
              <p>
                {t('developer.aboutMeDesc3')}
              </p>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-neon-green flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t('developer.getInTouch')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="mailto:writeto.uxgnik@gmail.com">
                    <Mail className="w-4 h-4 mr-2" />
                    writeto.uxgnik@gmail.com
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="https://github.com/writetosagnik" target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    {t('developer.github')}
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/sagnik-pal-930160277/" target="_blank">
                    <Linkedin className="w-4 h-4 mr-2" />
                    {t('developer.linkedin')}
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="https://www.reddit.com/user/Comfortable-Web-5719/" target="_blank">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('developer.reddit')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <Card className="mb-16 glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-neon-green text-center">
              {t('developer.skillsTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('developer.skillsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}