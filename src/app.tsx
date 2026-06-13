import { CertificateScreen } from './screens/certificate-screen.js';
import { DaemonScreen } from './screens/daemon-screen.js';
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
    case 'certificate': {
      return <CertificateScreen />;
    }
    case 'daemon': {
      return <DaemonScreen />;
    }
    default: {
      return <MainMenuScreen />;
    }
  }
}
