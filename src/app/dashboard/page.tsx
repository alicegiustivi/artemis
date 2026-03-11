import { createSupabaseServerClient } from '@/lib/supabase';
import { getPhaseForDate } from '@/lib/phases';
import { Profile } from '@/lib/types';
import { ArtemisDashboard } from '@/components/Dashboard';

async function getUserProfile(supabase: any): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}

async function getPhaseContent(supabase: any, phase: string) {
  const { data } = await supabase
    .from('phase_content')
    .select('*')
    .eq('phase', phase);
  if (!data || data.length === 0) return null;
  const content = { energy: '', nutrition: '', movement: '' };
  data.forEach((row: any) => {
    if (row.category === 'energy') content.energy = row.content;
    if (row.category === 'nutrition') content.nutrition = row.content;
    if (row.category === 'movement') content.movement = row.content;
  });
  return content;
}

function getHormonalNote(phase: string): string {
  switch (phase) {
    case 'menstrual':  return 'Progesterone low. Energy turning inward.';
    case 'follicular': return 'Estrogen rising. Creative energy building.';
    case 'ovulatory':  return 'Peak estrogen. High energy and clarity.';
    case 'luteal':     return 'Progesterone peaking. Time for reflection.';
    default:           return '';
  }
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const profile = await getUserProfile(supabase);

  if (!profile) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#1A1510', color: '#F2EDE8', padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: '#8B3A2A', fontSize: '48px' }}>
          Welcome to Artemis
        </h1>
        <p style={{ marginTop: '16px', opacity: 0.8 }}>
          Please complete your profile to see personalized recommendations.
        </p>
      </main>
    );
  }

  const today = new Date();
  const currentPhaseData = getPhaseForDate(
    profile.last_period_date,
    profile.average_cycle_length,
    today
  );
  const phaseContent = await getPhaseContent(supabase, currentPhaseData.phase);

  const recommendations = phaseContent ? [
    { category: 'ENERGY',    content: phaseContent.energy },
    { category: 'NUTRITION', content: phaseContent.nutrition },
    { category: 'MOVEMENT',  content: phaseContent.movement },
  ] : [];

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);

  const calendarDays = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const phaseData = getPhaseForDate(profile.last_period_date, profile.average_cycle_length, d);
    return {
      date: d.getDate().toString(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      cycleDay: phaseData.dayInCycle,
      phase: phaseData.phase as "menstrual" | "follicular" | "ovulatory" | "luteal",
      isToday: d.getTime() === new Date(today.setHours(0,0,0,0)).getTime(),
    };
  });

  return (
    <ArtemisDashboard
      currentPhase={currentPhaseData.phase as "menstrual" | "follicular" | "ovulatory" | "luteal"}
      dayInCycle={currentPhaseData.dayInCycle}
      hormonalNote={getHormonalNote(currentPhaseData.phase)}
      recommendations={recommendations}
      calendarDays={calendarDays}
    />
  );
}