import { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, XCircle, Info, History, LogIn, LogOut, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { verifyInformation, type VerificationResult } from '@/src/services/gemini';
import { lazy, Suspense } from 'react';

const ReactMarkdown = lazy(() => import('react-markdown'));

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
      case 'Reliable': return 'text-emerald-600 bg-emerald-50/80 border-emerald-100 shadow-emerald-100/50';
      case 'Mixed': return 'text-blue-600 bg-blue-50/80 border-blue-100 shadow-blue-100/50';
      case 'Misleading': return 'text-orange-600 bg-orange-50/80 border-orange-100 shadow-orange-100/50';
      case 'False': return 'text-rose-600 bg-rose-50/80 border-rose-100 shadow-rose-100/50';
      default: return 'text-blue-600 bg-blue-50/80 border-blue-100 shadow-blue-100/50';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Reliable': return <ShieldCheck className="w-8 h-8" />;
      case 'Mixed': return <Info className="w-8 h-8" />;
      case 'Misleading': return <AlertTriangle className="w-8 h-8" />;
      case 'False': return <XCircle className="w-8 h-8" />;
      default: return <Info className="w-8 h-8" />;
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
    <div className="min-h-screen bg-blue-50/50 font-sans text-slate-900 selection:bg-blue-100">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full bg-blue-300/20 blur-[100px]"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-200 ring-1 ring-blue-400/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-950">Veritas AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600/70 italic">
              <ShieldCheck className="h-4 w-4" />
              AI Verified
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Real-time Verification
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-black tracking-tight text-blue-950 sm:text-6xl lg:text-7xl leading-[1.1]"
          >
            Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900">Fake Content</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed"
          >
            Empower your digital awareness. Our AI engine scans the web to verify claims, news, and social media posts instantly.
          </motion.p>
        </section>

        {/* Search Section */}
        <section className="mb-16">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleVerify} 
            className="relative group"
          >
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news content, a claim, or a URL to verify..."
                className="w-full min-h-[180px] rounded-[2rem] border border-blue-100 bg-white/80 p-8 pr-20 text-lg shadow-2xl shadow-blue-200/40 backdrop-blur-sm outline-none transition-all focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 resize-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-xl shadow-blue-300 transition-all hover:bg-blue-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 group-focus-within:ring-4 ring-blue-500/20"
              >
                {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Search className="h-7 w-7" />}
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Google Search Grounding</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Gemini 3.0 Analysis</span>
            </div>
          </motion.form>
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
                className="rounded-3xl border border-blue-900/10 bg-blue-950 p-8 shadow-2xl shadow-blue-950/20 text-blue-50"
              >
                <h3 className="mb-6 text-xl font-bold flex items-center gap-2 text-blue-200">
                  <Info className="h-5 w-5 text-blue-400" />
                  Detailed Analysis
                </h3>
                <div className="prose prose-invert prose-blue max-w-none text-blue-100/80 leading-relaxed">
                  <Suspense fallback={<div className="h-20 w-full animate-pulse bg-blue-900/20 rounded-lg" />}>
                    <ReactMarkdown>{result.reasoning}</ReactMarkdown>
                  </Suspense>
                </div>
              </motion.div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/50"
                >
                  <h3 className="mb-6 text-xl font-bold flex items-center gap-2 text-blue-950">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    Verified Sources
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-2xl border border-blue-50 bg-blue-50/30 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100/50"
                      >
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-blue-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {source.title}
                          </p>
                          <p className="text-xs text-blue-400 truncate">{source.url}</p>
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
      <footer className="mt-20 border-t border-blue-100 bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-lg shadow-blue-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-blue-950 tracking-tight">Veritas AI</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Advanced misinformation detection powered by Gemini 3.0 and Google Search Grounding. 
            Empowering users to navigate the digital world with confidence.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-slate-400">
            <div className="h-px w-12 bg-blue-100 self-center" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">© 2026 Veritas AI</span>
            <div className="h-px w-12 bg-blue-100 self-center" />
          </div>
        </div>
      </footer>
    </div>
  );
}
