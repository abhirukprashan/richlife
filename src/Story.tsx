import type { CSSProperties, ReactNode } from "react"
import { useReveal } from "./useReveal"
import WaveDivider from "./WaveDivider"

const icons: Record<string, ReactNode> = {
  carton: <path d="M8 3h8l2 4v14H6V7l2-4Zm-2 4h12M12 7v14" />,
  handshake: (
    <path d="M3 12l4-4 4 3 3-3 7 5-4 4-4-3-3 3-7-5Zm4 1l3 3m1-5l3 3" />
  ),
  leaf: <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Zm0 0 7-7" />,
  cheese: <path d="M3 15 15 6l6 3v9H3v-3Zm0 0h18" />,
}

// Facts from Renuka Group, Daily FT (2012, 2025) and Renuka Foods.
const milestones = [
  {
    year: "1995",
    icon: "carton",
    title: "Richlife Dairies begins",
    text: "Founded as Sri Lanka's first maker of UHT-treated, shelf-stable dairy in Tetra Pak packs.",
  },
  {
    year: "2012",
    icon: "handshake",
    title: "Joins the Renuka group",
    text: "Becomes part of Renuka, certified to ISO 22000 food safety and ISO 14001 environmental standards.",
  },
  {
    year: "2025",
    icon: "leaf",
    title: "ECO Label, again",
    text: "The whole dairy range is awarded the Sri Lanka ECO Label by the National Cleaner Production Centre.",
  },
  {
    year: "Today",
    icon: "cheese",
    title: "From milk to cheese",
    text: "Milk, flavoured milk, yoghurt, curd, cream and a growing range of cheese, made with fresh local milk.",
  },
]

const facts = [
  { value: "1995", label: "Making Sri Lankan dairy since" },
  { value: "1st", label: "UHT dairy maker in Sri Lanka" },
  { value: "Wadduwa", label: "Home of our Molligoda factory" },
  { value: "ECO", label: "Label certified range" },
]

export default function Story() {
  const ref = useReveal<HTMLElement>()

  return (
    <section className="story-section" id="story" ref={ref}>
      <WaveDivider color="#ffffff" />
      <div className="mx-auto max-w-[1200px]">
        <div className="story-intro" data-reveal>
          <p className="story-kicker">Our story</p>
          <h2 className="story-title">
            Sri Lankan milk,
            <br />
            <span>since 1995.</span>
          </h2>
          <p className="story-lead">
            For three decades Rich Life has turned fresh milk from Sri Lankan
            farms into dairy that families trust, from the first long-life
            milk cartons to the cheese in this year's Christmas box.
          </p>
        </div>

        <ol className="timeline" data-reveal>
          {milestones.map((milestone, index) => (
            <li
              className="timeline-item"
              key={milestone.title}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="timeline-year">{milestone.year}</span>
              <span aria-hidden="true" className="timeline-dot" />
              <div className="timeline-card">
                <span aria-hidden="true" className="timeline-icon">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                  >
                    {icons[milestone.icon]}
                  </svg>
                </span>
                <h3 className="timeline-title">{milestone.title}</h3>
                <p className="timeline-text">{milestone.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <dl className="story-facts">
          {facts.map((fact, index) => (
            <div
              className="story-fact"
              data-reveal
              key={fact.label}
              style={{ "--i": index } as CSSProperties}
            >
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
