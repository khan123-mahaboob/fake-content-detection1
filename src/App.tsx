import { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, XCircle, Info, History, LogIn, LogOut, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { verifyInformation, type VerificationResult } from '@/src/services/gemini';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await verifyInformation(input);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError('Failed to verify information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Reliable': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'Mixed': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'Misleading': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'False': return 'text-rose-500 bg-rose-50 border-rose-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Reliable': return <ShieldCheck className="w-6 h-6" />;
      case 'Mixed': return <Info className="w-6 h-6" />;
      case 'Misleading': return <AlertTriangle className="w-6 h-6" />;
      case 'False': return <XCircle className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Veritas AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 italic">
              <ShieldCheck className="h-4 w-4" />
              AI Verified
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Verify the <span className="text-indigo-600">Truth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            Combat misinformation with real-time AI analysis and Google Search grounding. 
            Paste a news snippet or a claim to verify its accuracy.
          </motion.p>
        </section>

        {/* Search Section */}
        <section className="mb-12">
          <form onSubmit={handleVerify} className="relative group">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news content, a claim, or a URL to verify..."
                className="w-full min-h-[160px] rounded-2xl border border-slate-200 bg-white p-6 pr-16 text-lg shadow-xl shadow-slate-200/50 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-600"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Score Card */}
              <motion.div 
                variants={itemVariants}
                className={cn(
                  "rounded-3xl border p-8 shadow-xl transition-all",
                  getRatingColor(result.rating)
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                      {getRatingIcon(result.rating)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{result.rating}</h2>
                      <p className="text-slate-600 font-medium">Reliability Score: {result.score}/100</p>
                    </div>
                  </div>
                  <div className="h-2 w-full md:w-64 overflow-hidden rounded-full bg-white/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-current"
                    />
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-bold">Summary</h3>
                  <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                </div>
              </motion.div>

              {/* Detailed Reasoning */}
              <motion.div 
                variants={itemVariants}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                  <Info className="h-5 w-5 text-indigo-600" />
                  Detailed Analysis
                </h3>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                  <ReactMarkdown>{result.reasoning}</ReactMarkdown>
                </div>
              </motion.div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
                >
                  <h3 className="mb-6 text-xl font-bold flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                    Verified Sources
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
                      >
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {source.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{source.url}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold">Veritas AI</span>
          </div>
          <p className="text-slate-500 text-sm">
            Powered by Gemini 3.0 and Google Search Grounding. 
            Always verify information from multiple reliable sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
