"use client";

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useRouter } from 'next/navigation';
import { Download, AlertTriangle, Save } from 'lucide-react';

export default function SettingsPage() {
  const { state, setSafetyMargin, resetData } = useFinance();
  const router = useRouter();
  const [burnRate, setBurnRate] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setBurnRate(state.safetyMargin.toString());
  }, [state.safetyMargin]);

  const handleSaveRhythm = () => {
    const val = parseFloat(burnRate);
    if (!isNaN(val) && val >= 0) {
      setSafetyMargin(val);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `lumena_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleReset = () => {
    if (confirm("DANGER: This will delete all your data locally. There is no undo. Are you sure?")) {
      resetData();
      router.push('/onboarding');
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-8 max-w-3xl mx-auto">
      <div>
         <h1 className="text-3xl font-bold text-brand-text">Settings</h1>
         <p className="text-slate-500">Configure your Lumena experience.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section (Read Only) */}
        <section>
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile</h2>
           <Card className="p-6 space-y-4 bg-slate-50 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label>Display Name</Label>
                    <Input value="Guest User" disabled className="bg-slate-100 text-slate-500 border-slate-200" />
                 </div>
                 <div>
                    <Label>Email</Label>
                    <Input value="offline@lumena.app" disabled className="bg-slate-100 text-slate-500 border-slate-200" />
                 </div>
              </div>
           </Card>
        </section>

        {/* Financial Rhythm */}
        <section>
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Financial Rhythm</h2>
           <Card className="p-6">
              <div className="space-y-4">
                 <div>
                    <Label htmlFor="burnRate">Monthly Survival Number (Burn Rate)</Label>
                    <p className="text-sm text-slate-500 mb-2">Used to calculate your runway duration.</p>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                            <Input
                                id="burnRate"
                                type="number"
                                value={burnRate}
                                onChange={(e) => setBurnRate(e.target.value)}
                                className="pl-8 tabular-nums"
                            />
                        </div>
                        <Button onClick={handleSaveRhythm} disabled={burnRate === state.safetyMargin.toString()}>
                            {isSaved ? 'Saved!' : 'Update'}
                        </Button>
                    </div>
                 </div>
              </div>
           </Card>
        </section>

        {/* Data Control */}
        <section>
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Data Control</h2>
           <Card className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                 <div>
                    <h3 className="font-semibold text-indigo-900">Export Data</h3>
                    <p className="text-sm text-indigo-700">Download a JSON backup of your finances.</p>
                 </div>
                 <Button variant="ghost" onClick={handleExport} className="text-indigo-600 hover:bg-indigo-100">
                    <Download className="w-5 h-5 mr-2" />
                    Download JSON
                 </Button>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                 <div>
                    <h3 className="font-semibold text-red-900">Reset Application</h3>
                    <p className="text-sm text-red-700">Wipe all data and start over.</p>
                 </div>
                 <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white border-none">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Reset Everything
                 </Button>
              </div>
           </Card>
        </section>
      </div>
    </div>
  );
}
