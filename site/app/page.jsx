import { Landing } from './landing';
import releases from '../data/releases.json';

export default function Home() {
  return <Landing releases={releases} basePath={process.env.NEXT_PUBLIC_BASE_PATH || ''} />;
}
