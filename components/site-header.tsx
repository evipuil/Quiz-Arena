import Link from 'next/link';
import { Swords } from 'lucide-react';

export function SiteHeader({ active }: { active: 'practice' | 'versus' }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Quiz Arena home">
        <span className="brand-mark"><Swords size={20} strokeWidth={2.4} /></span>
        <span>Quiz Arena</span>
      </Link>
      <nav aria-label="Game modes">
        <Link className={active === 'practice' ? 'nav-link active' : 'nav-link'} href="/">Solo practice</Link>
        <Link className={active === 'versus' ? 'nav-link active' : 'nav-link'} href="/head-to-head">Head to head</Link>
      </nav>
    </header>
  );
}
