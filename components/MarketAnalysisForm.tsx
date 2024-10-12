"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

export default function MarketAnalysisForm() {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(values.topic)}&key=YOUR_API_KEY&limit=1&indent=True`);
      const data = await response.json();

      if (data.itemListElement && data.itemListElement.length > 0) {
        const result = data.itemListElement[0].result;
        setAnalysisResult(`${result.name}: ${result.description}`);
      } else {
        setAnalysisResult("No information found for the given topic.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market analysis. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-primary">
      <CardHeader>
        <CardTitle className="text-primary">Market Analysis</CardTitle>
        <CardDescription>Enter a topic or industry to get market insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Artificial Intelligence" {...field} className="bg-secondary" />
                  </FormControl>
                  <FormDescription>
                    Enter a topic or industry for analysis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Analyze</Button>
          </form>
        </Form>
        {analysisResult && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-primary">Analysis Result:</h2>
            <p>{analysisResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}