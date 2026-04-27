import LauncherShell from '../components/LauncherShell';
import { fabricCategories } from './routes';

export default function FabricLauncher() {
  return (
    <LauncherShell
      icon="🎨"
      title="Fabric.js Demos"
      intro="依據 fabricjs.com/demos 實作的全部官方範例"
      categories={fabricCategories}
    />
  );
}
