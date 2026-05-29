'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SIGIZI Dashboard</h1>
          <p className="text-muted-foreground">Monitor kesehatan balita dengan teknologi modern</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sigizi.id"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full h-10 bg-primary hover:bg-primary/90">
              {isLoading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Demo Credentials:</p>
            <div className="space-y-2 text-xs bg-muted/50 p-3 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Admin:</p>
                <p className="text-muted-foreground">Email: admin@sigizi.id</p>
                <p className="text-muted-foreground">Password: admin123</p>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <p className="font-medium text-foreground">Kader:</p>
                <p className="text-muted-foreground">Email: kader@sigizi.id</p>
                <p className="text-muted-foreground">Password: kader123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
