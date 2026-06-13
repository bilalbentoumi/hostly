import { DomainsScreen } from './screens/domains-screen.js';
import { MainMenuScreen } from './screens/main-menu-screen.js';
import { ProxyScreen } from './screens/proxy-screen.js';
import { useAppStore } from './stores/app-store.js';

export function App() {
  const { screen } = useAppStore();
  switch (screen) {
    case 'domains': {
      return <DomainsScreen />;
    }
    case 'proxy': {
      return <ProxyScreen />;
    }
    default: {
      return <MainMenuScreen />;
    }
  }
}
