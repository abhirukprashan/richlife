import type { CSSProperties } from "react"

// The Rich Life range standing in the milk: milk cartons at the back,
// cheeses in front (later items overlap earlier ones). `bottom` is in px
// above the hero's lower edge, so each item sits partly under the milk.
const heroProducts = [
  { src: "/hero/richlife-strawberry-milk.webp", x: 4, w: 11, bottom: 82, r: -7, delay: 0.2 },
  { src: "/hero/richlife-full-cream-milk.webp", x: 15, w: 9, bottom: 90, r: -2, delay: 0 },
  { src: "/hero/richlife-drinking-yoghurt.webp", x: 62, w: 7, bottom: 90, r: 4, delay: 0.8 },
  { src: "/hero/richlife-chocolate-milk.webp", x: 70, w: 11, bottom: 86, r: 5, delay: 0.5 },
  { src: "/hero/richlife-vanilla-milk.webp", x: 82, w: 11, bottom: 80, r: 9, delay: 1.1 },
  { src: "/hero/richlife-kiri-pani.webp", x: 31, w: 15, bottom: 120, r: -3, delay: 0.7 },
  { src: "/products/richlife-cheddar-cheese.webp", x: 0, w: 22, bottom: 92, r: -6, delay: 0.4 },
  { src: "/products/richlife-cheese-wedges.webp", x: 24, w: 17, bottom: 86, r: 3, delay: 0.9 },
  { src: "/products/richlife-cheese-slices.webp", x: 43, w: 16, bottom: 96, r: 5, delay: 1.3 },
  { src: "/products/richlife-cheese-wedges-pepper.webp", x: 58, w: 16, bottom: 84, r: -4, delay: 0.3 },
]

// Droplets splashing up from the milk surface.
const droplets = Array.from({ length: 14 }, (_, index) => ({
  x: 4 + ((index * 37) % 92),
  size: 6 + ((index * 5) % 9),
  delay: (index * 0.37) % 3.2,
  height: 40 + ((index * 23) % 70),
}))

const waveLayers = [
  { fill: "#cfe2ff", top: 0, duration: 9, reverse: true },
  { fill: "#eaf3ff", top: 14, duration: 7, reverse: false },
  { fill: "#ffffff", top: 28, duration: 5.5, reverse: true },
]

const WAVE_PATH =
  "M0 40 Q150 0 300 40 T600 40 T900 40 T1200 40 T1500 40 T1800 40 T2100 40 T2400 40 V120 H0Z"

export default function Hero() {
  return (
    <section className="dairy-hero" aria-labelledby="hero-title">
      <div aria-hidden="true" className="dairy-hero-glow" />

      <div className="dairy-hero-inner">
        <div className="dairy-hero-copy">
          <p className="dairy-hero-kicker">Fresh from Sri Lankan farms</p>
          <h1 className="dairy-hero-title" id="hero-title">
            <span className="hero-line">Real milk.</span>
            <span className="hero-line">Real cheese.</span>
            <span className="hero-line hero-line-accent">Merry Christmas.</span>
          </h1>
          <p className="dairy-hero-text">
            Fresh Sri Lankan milk, made into cheese for your Christmas table.
          </p>
        </div>

        <div aria-hidden="true" className="dairy-hero-products">
          {heroProducts.map((product, index) => (
            <img
              alt=""
              className="dairy-hero-cheese"
              decoding="async"
              key={product.src}
              src={product.src}
              style={
                {
                  left: `${product.x}%`,
                  width: `${product.w}%`,
                  zIndex: index,
                  "--bottom": product.bottom,
                  "--r": `${product.r}deg`,
                  "--delay": `${product.delay}s`,
                } as CSSProperties
              }
            />
          ))}
          <div className="dairy-hero-seal">
            <span className="dairy-hero-seal-top">100%</span>
            <span className="dairy-hero-seal-main">Sri Lankan</span>
            <span className="dairy-hero-seal-bottom">milk</span>
          </div>
        </div>
      </div>

      {/* Rolling milk with splashes. */}
      <div aria-hidden="true" className="dairy-hero-milk">
        {droplets.map((drop, index) => (
          <span
            className="dairy-hero-drop"
            key={index}
            style={
              {
                left: `${drop.x}%`,
                width: drop.size,
                height: drop.size,
                "--delay": `${drop.delay}s`,
                "--jump": `-${drop.height}px`,
              } as CSSProperties
            }
          />
        ))}
        {waveLayers.map((wave) => (
          <div
            className="dairy-hero-wave"
            key={wave.fill}
            style={
              {
                top: wave.top,
                fill: wave.fill,
                "--duration": `${wave.duration}s`,
                "--direction": wave.reverse ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            <svg preserveAspectRatio="none" viewBox="0 0 2400 120">
              <path d={WAVE_PATH} />
            </svg>
          </div>
        ))}
      </div>
    </section>
  )
}
