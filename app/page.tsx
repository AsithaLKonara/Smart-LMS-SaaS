import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary">
      <Container className="py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            Smart <span className="text-gradient">LMS SaaS</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            AI-Powered Smart Learning Management System
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Intelligent tutoring and personalized learning experiences
              </CardDescription>
            </CardHeader>
          </Card>
          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>Multi-Tenant</CardTitle>
              <CardDescription>
                Complete tenant isolation with custom branding
              </CardDescription>
            </CardHeader>
          </Card>
          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>Modern Design</CardTitle>
              <CardDescription>
                Dark 3D futuristic UI optimized for learning
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Container>
    </main>
  );
}

