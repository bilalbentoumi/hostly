import { useState } from 'react';
import CertsScreen from './components/CertsScreen.js';
import DomainsScreen from './components/DomainsScreen.js';
import MainMenu, { type Screen } from './components/MainMenu.js';
import ProxyScreen from './components/ProxyScreen.js';

/** Root component: routes between the main menu and feature screens. */
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

    case 'certs': {
      return <CertsScreen onBack={back} />;
    }

    default: {
      return <MainMenu onSelect={setScreen} />;
    }
  }
}
