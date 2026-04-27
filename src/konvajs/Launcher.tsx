import LauncherShell from '../components/LauncherShell';
import { konvaCategories } from './routes';

export default function KonvaLauncher() {
  return (
    <LauncherShell
      icon="🖼️"
      title="Konva.js Demos"
      intro="依據 konvajs.org/docs/sandbox 實作的官方範例"
      categories={konvaCategories}
    />
  );
}
