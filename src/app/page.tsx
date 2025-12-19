import { getHackathons } from './actions';
import { HackathonList } from '@/components/HackathonList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const hackathons = await getHackathons();

  return (
    <HackathonList initialHackathons={hackathons} />
  );
}
