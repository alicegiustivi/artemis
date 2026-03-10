import { createSupabaseServerClient } from '@/lib/supabase';
import { getPhaseForDate } from '@/lib/phases';
import { Profile, PhaseContent, CalendarDay } from '@/lib/types';

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

async function getPhaseContent(supabase: any, phase: string): Promise<PhaseContent | null> {
  const { data } = await supabase
    .from('phase_content')
    .select('*')
    .eq('phase', phase)
    .single();

  return data;
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
      <main>
        <h1>Welcome to Artemis</h1>
        <p>Please complete your profile to see personalized recommendations.</p>
      </main>
    );
  }

  const today = new Date();
  const currentPhaseData = getPhaseForDate(profile.last_period_date, profile.average_cycle_length, today);
  const phaseContent = await getPhaseContent(supabase, currentPhaseData.phase);
  const calendarStrip = generateCalendarStrip(profile.last_period_date, profile.average_cycle_length);

  return (
    <main>
      <h1>Welcome to Artemis</h1>
      
      <section>
        <h2>Current Phase: {currentPhaseData.phase}</h2>
        <p>Day {currentPhaseData.dayInCycle} of your cycle</p>
      </section>

      {phaseContent && (
        <section>
          <h2>Today's Recommendations</h2>
          <div>
            <h3>Energy</h3>
            <p>{phaseContent.energy}</p>
          </div>
          <div>
            <h3>Nutrition</h3>
            <p>{phaseContent.nutrition}</p>
          </div>
          <div>
            <h3>Movement</h3>
            <p>{phaseContent.movement}</p>
          </div>
        </section>
      )}

      <section>
        <h2>14-Day Calendar</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {calendarStrip.map((day, index) => (
            <div
              key={index}
              style={{
                border: day.isToday ? '2px solid black' : '1px solid #ccc',
                padding: '8px',
                minWidth: '60px',
                textAlign: 'center',
                backgroundColor: day.isToday ? '#f0f0f0' : 'white'
              }}
            >
              <div style={{ fontSize: '12px' }}>
                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>
                {day.phase}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                Day {day.dayInCycle}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
