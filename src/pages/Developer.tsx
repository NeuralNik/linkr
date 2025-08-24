import { Github, Twitter, Linkedin, Mail, Code, Coffee, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Developer() {
  const skills = [
    'React & TypeScript', 'Node.js & Python', 'UI/UX Design', 
    'Database Design', 'API Development', 'Cloud Technologies'
  ];

  const projects = [
    {
      title: 'linkr',
      description: 'Modern QR code generator with dark theme and smooth animations',
      tech: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      tech: ['Next.js', 'Stripe', 'PostgreSQL']
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      tech: ['React', 'Socket.io', 'MongoDB']
    }
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
            Meet the{' '}
            <span className="text-neon-green text-glow">Developer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate full-stack developer crafting modern web applications with attention to detail and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* About Me */}
          <Card className="lg:col-span-2 glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green flex items-center gap-2">
                <Heart className="w-6 h-6" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                I'm a passionate developer with over 5 years of experience in creating modern, 
                user-friendly web applications. I believe in writing clean, maintainable code 
                and creating beautiful user interfaces that provide exceptional user experiences.
              </p>
              <p>
                My journey started with a curiosity about how websites work, and it has evolved 
                into a deep passion for crafting digital solutions that solve real-world problems. 
                I'm constantly learning new technologies and staying up-to-date with industry trends.
              </p>
              <p>
                When I'm not coding, you can find me exploring new coffee shops, reading tech blogs, 
                or contributing to open-source projects. I believe in giving back to the developer 
                community that has helped me grow.
              </p>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-neon-green flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="mailto:developer@example.com">
                    <Mail className="w-4 h-4 mr-2" />
                    developer@example.com
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="#" target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="#" target="_blank">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                  asChild
                >
                  <a href="#" target="_blank">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
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
              Skills & Technologies
            </CardTitle>
            <CardDescription className="text-center">
              Technologies I work with to bring ideas to life
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

        {/* Projects */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Featured{' '}
              <span className="text-neon-green text-glow">Projects</span>
            </h2>
            <p className="text-muted-foreground">
              Some of the projects I've worked on recently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300 hover:glow-effect group"
              >
                <CardHeader>
                  <CardTitle className="text-neon-green group-hover:text-glow transition-all duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription>
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coffee Section */}
        <Card className="mt-16 glass-effect border-border/50 hover:border-neon-green/50 transition-all duration-300 text-center">
          <CardContent className="py-8">
            <Coffee className="w-12 h-12 mx-auto mb-4 text-neon-green" />
            <h3 className="text-xl font-bold mb-2">Like my work?</h3>
            <p className="text-muted-foreground mb-4">
              Consider buying me a coffee to support more awesome projects!
            </p>
            <Button 
              className="bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300 hover:glow-effect"
              asChild
            >
              <a href="#" target="_blank">
                <Coffee className="w-4 h-4 mr-2" />
                Buy me a coffee
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}