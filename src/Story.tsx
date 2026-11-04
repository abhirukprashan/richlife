import gsap from "gsap"
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react"
import { useReveal } from "./useReveal"
import WaveDivider from "./WaveDivider"

// The client's line drawing, used twice over the list: a faded copy as the
// full-length rail and a solid copy that is scaled down to the scroll
// progress. `preserveAspectRatio="none"` lets the 150-wide stroke fill a 4px
// column of any height.
function TimelineLine({
  className,
  svgRef,
}: {
  className: string
  svgRef?: Ref<SVGSVGElement>
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      ref={svgRef}
      viewBox="0 0 150 2844"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M75 0V1191V2423.5V2886" stroke="currentColor" strokeWidth="150" />
    </svg>
  )
}

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

export default function Story() {
  const ref = useReveal<HTMLElement>()
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGSVGElement>(null)

  // The line is drawn by scrolling: its tip stays level with a guide line a
  // little above the middle of the screen, and each milestone reveals as the
  // tip reaches its dot. Everything is visible by default — the hidden start
  // state is only applied here, so a failure to run JS can never blank it.
  useLayoutEffect(() => {
    const wrap = timelineRef.current
    const line = lineRef.current
    if (!wrap || !line) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const items = Array.from(
      wrap.querySelectorAll<HTMLElement>(".timeline-item"),
    )

    wrap.classList.add("is-animated")

    const update = () => {
      const box = wrap.getBoundingClientRect()
      const guide = window.innerHeight * 0.72
      const progress = Math.min(1, Math.max(0, (guide - box.top) / box.height))

      // Read every dot before writing anything, so one layout pass is enough.
      const passed = items.map((item) => {
        const dot = item.querySelector(".timeline-dot")
        return dot ? dot.getBoundingClientRect().top <= guide : false
      })

      gsap.set(line, { scaleY: progress })
      items.forEach((item, index) =>
        item.classList.toggle("is-visible", passed[index]),
      )
    }

    // Runs straight from the scroll event (browsers already fire at most once
    // per frame) and the capture phase also catches scrolling that happens
    // inside a wrapper such as a preview pane, not just the window.
    update()
    window.addEventListener("scroll", update, { capture: true, passive: true })
    window.addEventListener("resize", update)

    // Fonts and images can change the list height after mount.
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(wrap)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
      wrap.classList.remove("is-animated")
    }
  }, [])

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

        <div className="timeline-wrap" ref={timelineRef}>
          <TimelineLine className="timeline-track" />
          <TimelineLine className="timeline-line" svgRef={lineRef} />

          <ol className="timeline">
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
        </div>
      </div>
    </section>
  )
}
