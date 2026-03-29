/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Banknote, 
  Coins, 
  Calculator, 
  Printer, 
  RotateCcw, 
  Languages, 
  ChevronRight, 
  CheckCircle2,
  Wallet,
  Vault,
  History
} from 'lucide-react';
import { DENOMINATIONS, KEEP_IN_REGISTER_TARGET } from './constants';
import { Language, translations } from './types';

export default function App() {
  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    DENOMINATIONS.forEach(d => initial[d.value] = 0);
    return initial;
  });
  const [language, setLanguage] = useState<Language>('en');
  const [showResult, setShowResult] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const t = translations[language];

  const totals = useMemo(() => {
    const perDenom: Record<number, number> = {};
    let grandTotal = 0;
    DENOMINATIONS.forEach(d => {
      const total = ((quantities[d.value] as number) || 0) * d.value;
      perDenom[d.value] = total;
      grandTotal += total;
    });
    return { perDenom, grandTotal };
  }, [quantities]);

  const safeCalculation = useMemo(() => {
    const available = { ...quantities };
    const totalValue = Object.entries(available).reduce((sum, [val, qty]) => sum + Number(val) * (qty as number), 0);
    const targetSafeValue = Math.max(0, totalValue - KEEP_IN_REGISTER_TARGET);
    
    const toSafe: Record<number, number> = {};
    DENOMINATIONS.forEach(d => toSafe[d.value] = 0);
    
    let currentSafeValue = 0;
    
    // Take large bills first (non-coins)
    const takePriority = [...DENOMINATIONS]
      .filter(d => !d.isCoin)
      .sort((a, b) => b.value - a.value);
    
    takePriority.forEach(d => {
      if (currentSafeValue >= targetSafeValue) return;
      
      const canTake = (available[d.value] as number) - (d.minKeep || 0);
      if (canTake <= 0) return;
      
      const remainingNeeded = targetSafeValue - currentSafeValue;
      const amountNeeded = Math.floor((remainingNeeded + 0.0001) / d.value);
      const toTake = Math.min(canTake, amountNeeded);
      
      toSafe[d.value] = toTake;
      currentSafeValue += toTake * d.value;
    });
    
    // If we still need more for the safe (including decimals), take from coins
    let finalRemaining = targetSafeValue - currentSafeValue;
    if (finalRemaining > 0.001) {
      // For coins, we take from largest to smallest to reach the target exactly
      const coinPriority = [...DENOMINATIONS]
        .filter(d => d.isCoin)
        .sort((a, b) => b.value - a.value);

      coinPriority.forEach(d => {
        if (finalRemaining <= 0.0001) return;
        const canTake = (available[d.value] as number) - (d.minKeep || 0);
        if (canTake <= 0) return;
        
        const amountNeeded = Math.floor((finalRemaining + 0.0001) / d.value);
        const toTake = Math.min(canTake, amountNeeded);
        
        toSafe[d.value] = toTake;
        finalRemaining -= toTake * d.value;
      });
    }

    const safeTotal = Object.entries(toSafe).reduce((sum, [val, qty]) => sum + Number(val) * qty, 0);
    
    return { toSafe, safeTotal };
  }, [quantities]);

  const handleQuantityChange = (value: number, qty: string) => {
    const n = parseInt(qty) || 0;
    setQuantities(prev => ({ ...prev, [value]: Math.max(0, n) }));
  };

  const reset = () => {
    const initial: Record<number, number> = {};
    DENOMINATIONS.forEach(d => initial[d.value] = 0);
    setQuantities(initial);
    setShowResult(false);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className={`min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-12 ${isPrinting ? 'bg-white' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Calculator size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">{t.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex items-center gap-1">
              <Languages size={20} className="text-neutral-500" />
              <span className="text-xs font-semibold uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 w-32 overflow-hidden">
              {(['en', 'vi', 'ph', 'fr'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${language === lang ? 'bg-indigo-50 text-indigo-600 font-bold' : ''}`}
                >
                  {lang === 'en' ? 'English' : lang === 'vi' ? 'Tiếng Việt' : lang === 'ph' ? 'Filipino' : 'Français'}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={reset}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
            title={t.reset}
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {!showResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <History size={16} />
                  {t.inputHeader}
                </h2>
                <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {formatCurrency(totals.grandTotal)}
                </div>
              </div>
              
              <div className="divide-y divide-neutral-100">
                {DENOMINATIONS.map(d => (
                  <div key={d.value} className="flex items-center p-4 gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                      {d.isCoin ? <Coins size={20} /> : <Banknote size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{d.label}</div>
                      <div className="text-xs text-neutral-400">
                        {d.minKeep > 0 ? `${t.minRequired}: ${d.minKeep}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={quantities[d.value] || ''}
                        onChange={(e) => handleQuantityChange(d.value, e.target.value)}
                        placeholder="0"
                        className="w-20 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-right font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowResult(true)}
              disabled={totals.grandTotal === 0}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {t.submit}
              <ChevronRight size={20} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 print:space-y-4"
          >
            {/* Summary Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-200 overflow-hidden print:shadow-none print:border-none">
              <div className="p-6 text-center space-y-2 border-b border-neutral-100">
                <div className="inline-flex p-3 bg-green-100 text-green-600 rounded-full mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">{t.summary}</h2>
                <p className="text-neutral-400 text-sm">{new Date().toLocaleString()}</p>
              </div>

              <div className="p-6 space-y-8">
                {/* Input Summary Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <History size={14} />
                    {t.inputSummary}
                  </h3>
                  <div className="space-y-1">
                    {DENOMINATIONS.filter(d => quantities[d.value] > 0).map(d => (
                      <div key={d.value} className="flex justify-between text-sm py-1 border-b border-neutral-50 last:border-0">
                        <span className="text-neutral-600">{d.label} - {t.quantity}: <span className="font-bold text-neutral-900">{quantities[d.value]}</span></span>
                        <span className="font-mono font-bold">{formatCurrency(quantities[d.value] * d.value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t-2 border-neutral-100">
                      <span className="font-black text-neutral-900 uppercase tracking-tighter">{t.grandTotal}</span>
                      <span className="font-black text-indigo-600 text-lg">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-neutral-100" />

                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                      <Wallet size={12} />
                      {t.keepInRegister}
                    </div>
                    <div className="text-xl font-black text-indigo-700">{formatCurrency(totals.grandTotal - safeCalculation.safeTotal)}</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                      <Vault size={12} />
                      {t.takeToSafe}
                    </div>
                    <div className="text-xl font-black text-amber-700">{formatCurrency(safeCalculation.safeTotal)}</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Vault size={14} />
                    {t.safeBreakdown}
                  </h3>
                  
                  <div className="space-y-2">
                    {DENOMINATIONS.filter(d => !d.isCoin && safeCalculation.toSafe[d.value] > 0).map(d => (
                      <div key={d.value} className="flex items-center justify-between p-3 bg-white border border-neutral-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <Banknote size={16} />
                          </div>
                          <span className="font-bold">{d.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-neutral-400 text-sm">x {safeCalculation.toSafe[d.value]}</span>
                          <span className="font-mono font-bold text-neutral-900">{formatCurrency(safeCalculation.toSafe[d.value] * d.value)}</span>
                        </div>
                      </div>
                    ))}

                    {/* Coins Aggregated */}
                    {(() => {
                      const safeCoins = DENOMINATIONS.filter(d => d.isCoin && safeCalculation.toSafe[d.value] > 0);
                      const coinSafeTotal = safeCoins.reduce((sum, d) => sum + safeCalculation.toSafe[d.value] * d.value, 0);
                      
                      const coinDetails = safeCoins
                        .map(d => `(${d.label} x ${safeCalculation.toSafe[d.value]})`)
                        .join(' + ');

                      if (coinSafeTotal === 0) return null;

                      return (
                        <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-500">
                                <Coins size={16} />
                              </div>
                              <span className="font-bold">{t.coins}</span>
                            </div>
                            <span className="font-mono font-bold text-neutral-900">{formatCurrency(coinSafeTotal)}</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 leading-relaxed font-mono font-medium">
                            {coinDetails} = <span className="text-neutral-900 font-bold">{formatCurrency(coinSafeTotal)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all"
              >
                <Printer size={20} />
                {t.print}
              </button>
              <button
                onClick={() => setShowResult(false)}
                className="w-full py-4 text-neutral-500 font-bold flex items-center justify-center gap-2 hover:text-neutral-900 transition-all"
              >
                <RotateCcw size={18} />
                {t.reset}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Print Overlay */}
      {isPrinting && (
        <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-neutral-500 font-medium">Preparing print view...</p>
          </div>
        </div>
      )}
    </div>
  );
}
