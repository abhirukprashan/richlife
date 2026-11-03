import { useEffect, useRef } from "react"

// Adds `is-visible` to every [data-reveal] element inside the returned ref
// once it scrolls into view, so sections can animate their cards in.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return ref
}
