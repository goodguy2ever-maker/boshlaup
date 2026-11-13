'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  icon?: string;
  badge?: string;
  description?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  label,
  required,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
          <span>{label} {required && <span className="text-blue-600">*</span>}</span>
        </label>
      )}

      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg flex items-center justify-between transition-all outline-none text-left ${
          isOpen
            ? 'border-[#FF5A1F] ring-1 ring-[#FF5A1F]'
            : 'border-zinc-200 hover:border-zinc-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-sm shrink-0">{selectedOption.icon}</span>}
              <span className="font-medium text-zinc-900 truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-zinc-400 font-normal">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-zinc-800' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-lg border border-zinc-200 shadow-lg py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-orange-50/60 text-[#FF5A1F] font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-50 font-normal'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="text-sm shrink-0">{opt.icon}</span>}
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] font-medium px-1 py-0.2 rounded bg-zinc-100 text-zinc-600">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.description && (
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
