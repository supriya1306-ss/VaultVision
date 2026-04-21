"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8 glass-panel p-10 bg-white/5 border-white/10 shadow-2xl mx-auto"
      >
        <div className="text-center">
          <div className="mx-auto h-24 w-24 relative rounded-full bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-primary/50 mb-6">
            <img src="/logo.png" alt="VaultVision Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Sign in to VaultVision
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Or{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-secondary transition-colors">
              start your 14-day free trial
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-xl border-0 py-3.5 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white/5 backdrop-blur-sm transition-all focus:bg-white/10"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-xl border-0 py-3.5 px-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white/5 backdrop-blur-sm transition-all focus:bg-white/10"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 text-primary focus:ring-primary bg-white/5"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-semibold text-primary hover:text-secondary">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-primary py-6 px-3 text-base font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
            >
              Sign in
              <span className="absolute right-4 flex items-center">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
