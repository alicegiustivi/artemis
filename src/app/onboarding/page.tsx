'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState('28');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const cycleLength = averageCycleLength.trim() === '' ? 28 : parseInt(averageCycleLength, 10);
    const birthYearValue = birthYear.trim() === '' ? null : parseInt(birthYear, 10);

    const { error: upsertError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        last_period_date: lastPeriodDate,
        average_cycle_length: cycleLength,
        birth_year: birthYearValue,
      },
      { onConflict: 'id' }
    );

    setLoading(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main>
      <h1>Complete your profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="last_period_date">Last period start date</label>
          <input
            id="last_period_date"
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="average_cycle_length">Average cycle length (days)</label>
          <input
            id="average_cycle_length"
            type="number"
            min={1}
            max={99}
            value={averageCycleLength}
            onChange={(e) => setAverageCycleLength(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="birth_year">Birth year</label>
          <input
            id="birth_year"
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="Optional"
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save and continue'}
        </button>
      </form>
    </main>
  );
}
