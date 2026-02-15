import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, MessageSquare, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage prize claims and testimonials</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/claims' })}>
          <CardHeader>
            <FileText className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Manage Claims</CardTitle>
            <CardDescription>Review, approve, or reject prize claims from winners</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View All Claims</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/testimonials' })}>
          <CardHeader>
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Manage Testimonials</CardTitle>
            <CardDescription>Add, edit, or remove winner testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Testimonials</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
