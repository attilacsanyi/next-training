import { verifyAuthSession } from '@/lib/auth';
import { getTrainings } from '@/lib/training-dao';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const TrainingPage = async () => {
  const { user } = await verifyAuthSession();
  if (!user) {
    return redirect('/');
  }

  const trainingSessions = getTrainings();

  return (
    <main>
      <h1>Find your favorite activity</h1>
      <ul id="training-sessions">
        {trainingSessions.map((training) => (
          <li key={training.id}>
            <Image src={`/trainings${training.image}`} alt={training.title} width={200} height={200} />
            <div>
              <h2>{training.title}</h2>
              <p>{training.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default TrainingPage;