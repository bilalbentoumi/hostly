import { useState } from 'react';

import DomainsScreen from './screens/domains-screen.js';
import MainMenuScreen from './screens/main-menu-screen.js';
import ProxyScreen from './screens/proxy-screen.js';
import type { Screen } from './types/index.js';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const back = () => setScreen('menu');

  switch (screen) {
    case 'domains': {
      return <DomainsScreen onBack={back} />;
    }
    case 'proxy': {
      return <ProxyScreen onBack={back} />;
    }
    default: {
      return <MainMenuScreen onSelect={setScreen} />;
    }
  }
}
