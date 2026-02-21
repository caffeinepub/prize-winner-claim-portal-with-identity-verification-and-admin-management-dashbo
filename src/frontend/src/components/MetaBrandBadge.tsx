import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function MetaBrandBadge() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full meta-gradient text-white font-semibold text-sm shadow-lg transition-all duration-300 hover:shadow-meta-glow cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Sparkles className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
      <span>Meta Verified</span>
    </div>
  );
}
