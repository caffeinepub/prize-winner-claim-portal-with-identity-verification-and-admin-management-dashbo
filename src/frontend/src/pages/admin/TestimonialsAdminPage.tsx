import { useState } from 'react';
import { useGetTestimonials, useAddTestimonial, useRemoveTestimonial } from '../../hooks/useTestimonials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export default function TestimonialsAdminPage() {
  const { data: testimonials, isLoading } = useGetTestimonials();
  const addTestimonial = useAddTestimonial();
  const removeTestimonial = useRemoveTestimonial();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [income, setIncome] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    try {
      await addTestimonial.mutateAsync({
        name: name.trim(),
        title: title.trim(),
        quote: quote.trim(),
        income: income.trim(),
        image: ExternalBlob.fromURL(imageUrl.trim() || 'https://via.placeholder.com/150'),
      });
      setName('');
      setTitle('');
      setQuote('');
      setIncome('');
      setImageUrl('');
    } catch (error) {
      console.error('Failed to add testimonial:', error);
    }
  };

  const handleRemove = async (testimonialName: string) => {
    if (!confirm(`Remove testimonial from ${testimonialName}?`)) return;
    try {
      await removeTestimonial.mutateAsync(testimonialName);
    } catch (error) {
      console.error('Failed to remove testimonial:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Testimonials</h1>
        <p className="text-muted-foreground">Add or remove winner testimonials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
          <CardDescription>Create a new winner testimonial entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ronnie Lee" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title / Location</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., USA" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Prize Amount</Label>
              <Input id="income" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g., $750,000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">
                Quote <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter testimonial quote..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <Button type="submit" disabled={addTestimonial.isPending} className="gap-2">
              {addTestimonial.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </>
              )}
            </Button>
            {addTestimonial.isSuccess && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-300">Testimonial added successfully</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Testimonials</CardTitle>
          <CardDescription>Manage current testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.income}</p>
                    <p className="text-sm text-muted-foreground mt-2 italic">"{testimonial.quote}"</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemove(testimonial.name)}
                    disabled={removeTestimonial.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No testimonials yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
