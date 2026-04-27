import LauncherShell from '../components/LauncherShell';
import { dndCategories } from './routes';

export default function DndLauncher() {
  return (
    <LauncherShell
      icon="🔀"
      title="React-DnD Demos"
      intro="依據 react-dnd.github.io/react-dnd/examples 實作的所有官方範例"
      categories={dndCategories}
    />
  );
}
