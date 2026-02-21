import { useNavigate } from '@tanstack/react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, Upload, FileText, MessageSquare, Award, Shield, Sparkles } from 'lucide-react';
import MetaBrandBadge from '../../components/MetaBrandBadge';

export default function WinnerPortalHomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/meta-lottery-banner.dim_1600x600.png"
          alt="Meta Lottery Portal Banner"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-5xl font-bold text-white">Welcome to Meta Lottery Portal</h1>
            </div>
            <p className="text-lg md:text-xl text-white/90 mb-4">Verify your winning ticket and claim your prize securely</p>
            <MetaBrandBadge />
          </div>
        </div>
      </div>

      {/* Meta Feature Card */}
      <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 meta-gradient opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full meta-gradient flex items-center justify-center meta-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <span>Enhanced Meta Experience</span>
            </h3>
            <p className="text-muted-foreground">
              Experience our next-generation lottery portal with advanced verification, real-time status tracking, and seamless prize claiming. 
              Your journey to claiming your prize has never been more secure and transparent.
            </p>
          </div>
        </div>
      </div>

      {/* Seal and Quick Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-card rounded-lg p-6 border">
        <img src="/assets/generated/meta-claim-seal.dim_512x512.png" alt="Meta Lottery Portal Seal" className="w-24 h-24 md:w-32 md:h-32" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Official Prize Claim Process</h2>
          <p className="text-muted-foreground">
            Follow our secure, step-by-step process to verify your winning ticket and receive your prize. All claims are reviewed by our
            team to ensure legitimacy and security.
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/verify' })}>
          <CardHeader>
            <CheckCircle className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Verify Prize</CardTitle>
            <CardDescription>Enter your ticket and prize number to verify your winning status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Verification</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/claim' })}>
          <CardHeader>
            <FileText className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Submit Claim</CardTitle>
            <CardDescription>Fill out your claim form and choose your payout method</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Submit Claim</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/identity' })}>
          <CardHeader>
            <Upload className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Upload ID</CardTitle>
            <CardDescription>Submit your selfie and ID card for identity verification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload Documents</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/status' })}>
          <CardHeader>
            <Award className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Claim Status</CardTitle>
            <CardDescription>Check the current status of your prize claim</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Status
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/testimonials' })}>
          <CardHeader>
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Winner Stories</CardTitle>
            <CardDescription>Read testimonials from past winners</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Read Stories
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/confirmation' })}>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Is This Real?</CardTitle>
            <CardDescription>Learn about our legitimacy and safety information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
