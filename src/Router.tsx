import { useState, useEffect } from 'react';
import App from './App';
import { Tutorial } from './Tutorial';

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

export function Router() {
  const hash = useHash();
  if (hash === '#/tutorial') return <Tutorial />;
  return <App />;
}
