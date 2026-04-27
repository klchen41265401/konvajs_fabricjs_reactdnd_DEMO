import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export interface DemoItem { path: string; name: string; desc?: string; }
export interface Category { name: string; demos: DemoItem[]; }

interface Props {
  icon: string;
  title: string;
  intro: string;
  categories: Category[];
}

export default function LauncherShell({ icon, title, intro, categories }: Props) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const lc = q.trim().toLowerCase();
    if (!lc) return categories;
    return categories
      .map(cat => ({ ...cat, demos: cat.demos.filter(d => (d.name + ' ' + (d.desc || '')).toLowerCase().includes(lc)) }))
      .filter(cat => cat.demos.length > 0);
  }, [q, categories]);

  const total = categories.reduce((s, c) => s + c.demos.length, 0);
  const matchedTotal = filtered.reduce((s, c) => s + c.demos.length, 0);

  return (
    <>
      <ThemeToggle />
      <header className="launcher-header">
        <div className="breadcrumb"><Link to="/">← 回總覽</Link></div>
        <h1>{icon} {title}</h1>
        <p>{intro} · 共 <strong className="hl">{total}</strong> 個 demo{q && ` · 符合 ${matchedTotal} 個`}</p>
      </header>
      <div className="search-bar">
        <div className="search-bar__inner">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜尋 demo 名稱、描述或關鍵字 (如 excel、canva、figma、miro)..."
            type="search"
          />
        </div>
      </div>
      {filtered.map(cat => (
        <section key={cat.name} className="category-block">
          <h2>{cat.name} <span className="count-badge">{cat.demos.length}</span></h2>
          <div className="demo-grid">
            {cat.demos.map(d => (
              <Link key={d.path} className="demo-card" to={d.path}>
                <span className="demo-name">{d.name}</span>
                {d.desc && <span className="demo-desc">{d.desc}</span>}
              </Link>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <section className="category-block">
          <div className="info-box">🔍 找不到符合「<strong>{q}</strong>」的 demo · 試試：excel、canva、figma、miro、trello、小畫家、簽名</div>
        </section>
      )}
    </>
  );
}
