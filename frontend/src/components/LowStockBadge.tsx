import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface LowStockBadgeProps {
  stock: number;
  className?: string;
}

export const LowStockBadge: React.FC<LowStockBadgeProps> = ({ stock, className = '' }) => {
  if (stock === 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-red-600" />
        Sold Out
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Low Stock: Only {stock} left
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      {stock} in stock
    </span>
  );
};
