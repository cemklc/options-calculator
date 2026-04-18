interface Props {
  page: 'calculator' | 'tutorial';
}

export function Nav({ page }: Props) {
  return (
    <nav className="site-nav">
      <span className="nav-brand">Options Calculator</span>
      <div className="nav-links">
        <a href="#/" className={page === 'calculator' ? 'nav-active' : ''}>
          Calculator
        </a>
        <a href="#/tutorial" className={page === 'tutorial' ? 'nav-active' : ''}>
          Learn Options
        </a>
      </div>
    </nav>
  );
}
