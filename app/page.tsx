import MarketAnalysisForm from '@/components/MarketAnalysisForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Market Analysis App</h1>
      <MarketAnalysisForm />
    </div>
  );
}