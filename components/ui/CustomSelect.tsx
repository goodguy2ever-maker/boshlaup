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
        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl flex items-center justify-between transition-all duration-200 outline-none text-left ${
          isOpen
            ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
            : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-base shrink-0">{selectedOption.icon}</span>}
              <span className="font-bold text-slate-900 truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 py-1.5 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
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
                className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.description && (
                      <p className="text-[10px] text-slate-400 truncate font-normal mt-0.5">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
