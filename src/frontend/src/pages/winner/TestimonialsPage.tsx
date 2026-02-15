import { useGetTestimonials } from '../../hooks/useTestimonials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Quote, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useGetTestimonials();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Winner Testimonials</h1>
        <p className="text-muted-foreground">Read inspiring stories from past prize winners</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> Testimonials are user-submitted marketing content and may not be independently verified. Individual
          results may vary.
        </AlertDescription>
      </Alert>

      {testimonials && testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonial.image.getDirectURL()} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.title}</CardDescription>
                    <p className="text-sm font-semibold text-primary mt-1">{testimonial.income}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/20" />
                  <p className="text-muted-foreground italic pl-6">{testimonial.quote}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No testimonials available at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
