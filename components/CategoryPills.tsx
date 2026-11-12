'use client';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { name: 'Все', icon: '⚡' },
  { name: 'AI', icon: '🤖' },
  { name: 'FinTech', icon: '💳' },
  { name: 'SaaS', icon: '☁️' },
  { name: 'DevTools', icon: '🛠️' },
  { name: 'EdTech', icon: '🎓' },
  { name: 'E-commerce', icon: '🛍️' },
  { name: 'HealthTech', icon: '🧬' },
];

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
