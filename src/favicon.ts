const ICON_HREF = "/richlife-icon.svg?v=2"

// The Make preview injects its own icon into the document head, which can
// replace the one in index.html. Re-assert the Rich Life mark after the app
// mounts so the browser tab keeps showing it.
export function setFavicon() {
  const head = document.head

  head
    .querySelectorAll<HTMLLinkElement>(
      'link[rel~="icon"], link[rel="apple-touch-icon"]',
    )
    .forEach((link) => {
      if (link.getAttribute("href") !== ICON_HREF) link.remove()
    })

  if (head.querySelector(`link[rel="icon"][href="${ICON_HREF}"]`)) return

  const icons: Array<{ rel: string; type?: string }> = [
    { rel: "icon", type: "image/svg+xml" },
    { rel: "shortcut icon" },
    { rel: "apple-touch-icon" },
  ]

  for (const icon of icons) {
    const link = document.createElement("link")
    link.rel = icon.rel
    if (icon.type) link.type = icon.type
    link.href = ICON_HREF
    head.append(link)
  }
}
