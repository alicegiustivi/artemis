"use client"

import { useRef } from "react"

const BG_DARK    = "#1A1510"
const STRIP_BG   = "#F2EDE8"
const STRIP_TEXT = "#12100E"
const TEXT       = "#F2EDE8"
const ACCENT     = "#8B3A2A"
const DIVIDER    = "#3A2E28"

type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal"

interface CalendarDay {
  date: string
  month: string
  cycleDay: number
  phase: Phase
  isToday: boolean
}

interface RecommendationCard {
  category: string
  content: string
}

interface DashboardProps {
  currentPhase: Phase
  dayInCycle: number
  hormonalNote: string
  recommendations: RecommendationCard[]
  calendarDays: CalendarDay[]
}

const PHASE_COLORS: Record<Phase, string> = {
  menstrual:  "#8B3A2A",
  follicular: "#D4A574",
  ovulatory:  "#C8BFB0",
  luteal:     "#4A3428",
}

const PHASE_LABELS: Record<Phase, string> = {
  menstrual:  "Menstrual",
  follicular: "Follicular",
  ovulatory:  "Ovulatory",
  luteal:     "Luteal",
}

function TopBar() {
  return (
    <header style={{
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      borderBottom: `1px solid ${DIVIDER}`
    }}>
      <span style={{
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "11px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: TEXT,
      }}>
        Artemis
      </span>
      <span style={{ color: TEXT, fontSize: "14px" }}>☽</span>
    </header>
  )
}

function CalendarStrip({ calendarDays }: { calendarDays: CalendarDay[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section style={{ borderBottom: `1px solid ${DIVIDER}` }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          scrollbarWidth: "none",
          padding: "12px 20px",
          gap: "4px",
        }}
      >
        {calendarDays.map((day) => (
          <div
            key={`${day.month}-${day.date}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              width: "52px",
              padding: "6px 2px",
              border: day.isToday ? `1px solid ${ACCENT}` : "1px solid transparent",
            }}
          >
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 300,
              textTransform: "uppercase",
              color: TEXT,
              whiteSpace: "nowrap",
            }}>
              {day.month} {day.date}
            </span>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "9999px",
              backgroundColor: PHASE_COLORS[day.phase],
              marginTop: "5px",
              marginBottom: "5px",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              color: TEXT,
            }}>
              {day.cycleDay}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        padding: "8px 20px 12px",
        flexWrap: "wrap",
      }}>
        {(Object.keys(PHASE_COLORS) as Phase[]).map((phase) => (
          <div key={phase} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "9999px",
              backgroundColor: PHASE_COLORS[phase],
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: TEXT,
              opacity: 0.6,
            }}>
              {PHASE_LABELS[phase]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PhaseHeader({ currentPhase, dayInCycle, hormonalNote }: {
  currentPhase: Phase
  dayInCycle: number
  hormonalNote: string
}) {
  const phaseName = currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)

  return (
    <header style={{
      padding: "32px 24px",
      borderBottom: `1px solid ${DIVIDER}`,
    }}>
      <p style={{
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: TEXT,
        opacity: 0.5,
        marginBottom: "12px",
      }}>
        Day {dayInCycle}
      </p>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
        <div style={{
          width: "1px",
          minHeight: "64px",
          backgroundColor: ACCENT,
          marginTop: "4px",
          flexShrink: 0,
        }} />
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "52px",
          lineHeight: 1.0,
          color: ACCENT,
          letterSpacing: "-0.01em",
        }}>
          {phaseName}<br />Phase
        </h1>
      </div>

      <p style={{
        fontFamily: "var(--font-body)",
        fontWeight: 300,
        fontStyle: "italic",
        fontSize: "13px",
        color: TEXT,
        opacity: 0.6,
        lineHeight: 1.6,
      }}>
        {hormonalNote}
      </p>
    </header>
  )
}

function RecommendationStrip({ card, isLast }: { card: RecommendationCard, isLast: boolean }) {
  return (
    <article style={{
      backgroundColor: STRIP_BG,
      borderLeft: `3px solid ${ACCENT}`,
      padding: "16px 20px",
      marginBottom: isLast ? 0 : "8px",
    }}>
      <p style={{
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: ACCENT,
        marginBottom: "8px",
      }}>
        {card.category}
      </p>
      <p style={{
        fontFamily: "var(--font-body)",
        fontWeight: 300,
        fontSize: "14px",
        color: STRIP_TEXT,
        lineHeight: 1.6,
      }}>
        {card.content}
      </p>
    </article>
  )
}

export function ArtemisDashboard({
  currentPhase,
  dayInCycle,
  hormonalNote,
  recommendations,
  calendarDays,
}: DashboardProps) {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      maxWidth: "480px",
      margin: "0 auto",
      backgroundColor: BG_DARK,
      display: "flex",
      flexDirection: "column",
    }}>
      <TopBar />
      <CalendarStrip calendarDays={calendarDays} />
      <PhaseHeader currentPhase={currentPhase} dayInCycle={dayInCycle} hormonalNote={hormonalNote} />
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {recommendations.map((card, i) => (
          <RecommendationStrip
            key={card.category}
            card={card}
            isLast={i === recommendations.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
