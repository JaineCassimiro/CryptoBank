import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, parseCurrency } from '@/lib/crypto';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = '0,00',
  id,
  className,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => {
    return value ? formatCurrency(value).replace('R$', '').trim() : '';
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get only numbers from input
    const inputValue = e.target.value.replace(/\D/g, '');
    
    // Convert to currency format (e.g., 1000 -> 10,00)
    const decimal = parseInt(inputValue, 10) / 100;
    
    // Format for display
    const formatted = decimal === 0 ? '' : formatCurrency(decimal).replace('R$', '').trim();
    
    setDisplayValue(formatted);
    onChange(decimal.toString());
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-neutral-500">R$</span>
      </div>
      <Input
        id={id}
        type="text"
        className={className}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="decimal"
        className="pl-10"
      />
    </div>
  );
}
