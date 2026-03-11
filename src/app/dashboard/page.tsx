import { createSupabaseServerClient } from '@/lib/supabase';
import { getPhaseForDate } from '@/lib/phases';
import { Profile, CalendarDay } from '@/lib/types';

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

async function getPhaseContent(supabase: any, phase: string): Promise<{ energy: string; nutrition: string; movement: string } | null> {
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

function generateCalendarStrip(lastPeriodDate: string, cycleLength: number): CalendarDay[] {
  const calendar: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const phaseData = getPhaseForDate(lastPeriodDate, cycleLength, currentDate);
    calendar.push({
      date: currentDate,
      phase: phaseData.phase,
      dayInCycle: phaseData.dayInCycle,
      isToday: currentDate.getTime() === today.getTime()
    });
  }

  return calendar;
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const profile = await getUserProfile(supabase);

  if (!profile) {
    return (
      <main style={{minHeight: '100vh', backgroundColor: '#12100E', color: '#F2EDE8', padding: '40px 24px'}}>
        <h1 style={{fontFamily: 'var(--font-display)', color: '#8B3A2A', fontSize: '48px'}}>Welcome to Artemis</h1>
        <p style={{marginTop: '16px', opacity: 0.8}}>Please complete your profile to see personalized recommendations.</p>
      </main>
    );
  }

  const today = new Date();
  const currentPhaseData = getPhaseForDate(profile.last_period_date, profile.average_cycle_length, today);
  const phaseContent = await getPhaseContent(supabase, currentPhaseData.phase);
  const calendarStrip = generateCalendarStrip(profile.last_period_date, profile.average_cycle_length);

  return (
    <main style={{minHeight: '100vh', backgroundColor: '#12100E', color: '#F2EDE8', padding: '40px 24px'}}>
      <div style={{maxWidth: '600px', margin: '0 auto'}}>

        <div style={{marginBottom: '48px'}}>
          <p style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6, marginBottom: '8px'}}>
            Day {currentPhaseData.dayInCycle}
          </p>
          <h1 style={{fontSize: '48px', fontFamily: 'var(--font-display)', color: '#8B3A2A', textTransform: 'capitalize', lineHeight: 1.1}}>
            {currentPhaseData.phase} Phase
          </h1>
        </div>

        {phaseContent && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px'}}>
            {(['energy', 'nutrition', 'movement'] as const).map((cat) => (
              <div key={cat} style={{backgroundColor: '#1C1916', padding: '24px'}}>
                <p style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8B3A2A', marginBottom: '8px'}}>
                  {cat}
                </p>
                <p style={{fontSize: '18px', fontFamily: 'var(--font-body)'}}>
                  {phaseContent[cat]}
                </p>
              </div>
            ))}
          </div>
        )}

        <div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '12px'}}>
          {calendarStrip.map((day, index) => (
            <div key={index} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '12px', minWidth: '60px',
              border: day.isToday ? '1px solid #8B3A2A' : '1px solid transparent'
            }}>
              <p style={{fontSize: '11px', marginBottom: '8px'}}>
                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', marginBottom: '8px',
                backgroundColor: day.phase === 'menstrual' ? '#8B3A2A' : day.phase === 'follicular' ? '#D4A574' : day.phase === 'ovulatory' ? '#F2EDE8' : '#4A3428'
              }}/>
              <p style={{fontSize: '11px', opacity: 0.6}}>{day.dayInCycle}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}