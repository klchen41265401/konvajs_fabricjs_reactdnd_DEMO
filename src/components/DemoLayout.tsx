import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface Props {
  title: string;
  backTo?: string;
  backLabel?: string;
  sidebar: ReactNode;
  children: ReactNode;
  stageClassName?: string;
}

export default function DemoLayout({ title, backTo = '/', backLabel = '← 回總覽', sidebar, children, stageClassName = '' }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="demo-page">
      <div className="demo-topbar">
        <div className="topbar-actions">
          <button
            type="button"
            className="menu-toggle"
            aria-label="開啟設定面板"
            aria-expanded={drawerOpen ? 'true' : 'false'}
            onClick={() => setDrawerOpen(o => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1>{title}</h1>
        </div>
        <div className="topbar-actions">
          <ThemeToggle />
          <Link className="back-btn" to={backTo}>{backLabel}</Link>
        </div>
      </div>
      <div className="demo-body">
        <aside className={`demo-sidebar ${drawerOpen ? 'open' : ''}`}>{sidebar}</aside>
        <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden />
        <main className={`demo-stage ${stageClassName}`}>{children}</main>
      </div>
    </div>
  );
}
