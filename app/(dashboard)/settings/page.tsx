'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Bell, Lock, User, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = document.documentElement.classList.contains('dark');
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input disabled value={user?.name || ''} className="bg-muted" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input disabled value={user?.email || ''} className="bg-muted" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <Input
                disabled
                value={user?.role === 'admin' ? 'Administrator' : 'Kader Posyandu'}
                className="bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Posyandu Location</label>
              <Input
                disabled
                value={user?.posyanduLocation || 'Not set'}
                className="bg-muted"
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">Update Profile</Button>
          </div>
        </Card>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isDark ? 'Dark theme is enabled' : 'Light theme is enabled'}
                </p>
              </div>
              <Button
                variant={isDark ? 'default' : 'outline'}
                onClick={toggleTheme}
              >
                {isDark ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">High-Risk Alerts</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified when a child is at nutritional risk
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Measurement Reminders</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Remind me when it&apos;s time for routine measurements
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive weekly health summaries
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">Save Preferences</Button>
          </div>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account security and access settings
            </p>

            <Button variant="outline" className="w-full">
              Change Password
            </Button>

            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>

            <Button variant="outline" className="w-full">
              View Active Sessions
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* API Configuration (for future AI integration) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">API Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gemini API Key (Optional)</label>
              <Input
                type="password"
                placeholder="sk-..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2">
                For enhanced AI-powered health recommendations
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">OpenAI API Key (Optional)</label>
              <Input
                type="password"
                placeholder="sk-..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2">
                For advanced nutrition analysis
              </p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">Save API Keys</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
