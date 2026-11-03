// Drives the loading screen defined in index.html: milk pours in and its
// level follows the real loading progress; once the first-view assets are
// ready the screen fills, the pour stops and the screen lifts away.

const MIN_VISIBLE_MS = 1400
const MAX_WAIT_MS = 6000
const FILL_MS = 750
const LIFT_MS = 1100

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const pageLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) =>
        window.addEventListener("load", () => resolve(), { once: true }),
      )

export function revealWhenReady() {
  const loader = document.getElementById("boot-loader")
  if (!loader) return

  const setLevel = (percent: number) =>
    loader.style.setProperty("--level", `${percent}%`)

  // The hero cheeses, box photo and logo are what people see first, so wait
  // for them to be decoded too (not just downloaded).
  const images = [
    ...document.querySelectorAll<HTMLImageElement>(
      ".dairy-hero-cheese, .cheese-box > img, header img",
    ),
  ].map((image) => image.decode().catch(() => undefined))
  const tasks = [pageLoaded(), document.fonts?.ready ?? Promise.resolve(), ...images]

  // Milk rises as each task finishes, from a small start up to 85%;
  // the last stretch is filled once everything is ready.
  let done = 0
  setLevel(12)
  for (const task of tasks) {
    task.then(() => {
      done += 1
      setLevel(12 + Math.round((73 * done) / tasks.length))
    })
  }

  const started = performance.now()
  Promise.race([Promise.all(tasks), wait(MAX_WAIT_MS)])
    .then(() => wait(Math.max(0, MIN_VISIBLE_MS - (performance.now() - started))))
    .then(async () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      if (!reduceMotion) {
        setLevel(112)
        loader.classList.add("is-full")
        await wait(FILL_MS)
      }
      loader.classList.add("is-lift")
      document.documentElement.classList.remove("is-booting")
      await wait(reduceMotion ? 400 : LIFT_MS)
      loader.remove()
    })
}
