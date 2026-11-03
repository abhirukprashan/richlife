import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type Category = "All" | "Cheese" | "Crackers" | "Pairings"

type Product = {
  id: number
  name: string
  brand: string
  note: string
  price: number
  category: Exclude<Category, "All">
  image: string
  // Footprint inside the live box, relative to a standard slot.
  scale?: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Cheese Wedges",
    brand: "Rich Life",
    note: "8 portions · 120g",
    price: 560,
    category: "Cheese",
    image: "/products/richlife-cheese-wedges.webp",
    scale: 1.15,
  },
  {
    id: 2,
    name: "Processed Cheese",
    brand: "Rich Life",
    note: "Classic block · 100g",
    price: 490,
    category: "Cheese",
    image: "/products/richlife-processed-cheese.webp",
  },
  {
    id: 3,
    name: "Swiss Cooking Cheese",
    brand: "Rich Life",
    note: "Melts beautifully · 150g",
    price: 900,
    category: "Cheese",
    image: "/products/richlife-swiss-cooking-cheese.webp",
    scale: 1.1,
  },
  {
    id: 4,
    name: "Cheese Spread",
    brand: "Rich Life",
    note: "Creamy jar · 175g",
    price: 750,
    category: "Cheese",
    image: "/products/richlife-cheese-spread.webp",
    scale: 0.9,
  },
  {
    id: 5,
    name: "Paneer",
    brand: "Rich Life",
    note: "Fresh & mild · 200g",
    price: 880,
    category: "Cheese",
    image: "/products/richlife-paneer.webp",
  },
  {
    id: 6,
    name: "Super Cream Cracker",
    brand: "Munchee",
    note: "Light & crisp · 490g",
    price: 420,
    category: "Crackers",
    image: "/products/munchee-super-cream-cracker.webp",
    scale: 1.1,
  },
  {
    id: 7,
    name: "Real Bran Cracker",
    brand: "Maliban",
    note: "Wholesome bran · 140g",
    price: 260,
    category: "Crackers",
    image: "/products/maliban-real-bran-cracker.webp",
    scale: 1.15,
  },
  {
    id: 8,
    name: "Cheesebits",
    brand: "Maliban",
    note: "Tangy cheese crackers · 170g",
    price: 320,
    category: "Crackers",
    image: "/products/maliban-cheesebits.webp",
  },
  {
    id: 9,
    name: "Woodapple Jam",
    brand: "MD",
    note: "Sri Lankan classic · 300g",
    price: 650,
    category: "Pairings",
    image: "/products/md-woodapple-jam.webp",
    scale: 0.95,
  },
  {
    id: 10,
    name: "Date & Lime Chutney",
    brand: "MD",
    note: "Sweet & tangy · 450g",
    price: 720,
    category: "Pairings",
    image: "/products/md-date-lime-chutney.webp",
    scale: 0.95,
  },
]

const daysToChristmas = (() => {
  const today = new Date()
  const christmas = new Date(today.getFullYear(), 11, 25)
  if (today > christmas) christmas.setFullYear(christmas.getFullYear() + 1)
  return Math.ceil((christmas.getTime() - today.getTime()) / 86_400_000)
})()

const formatPrice = (price: number) => `Rs ${price.toLocaleString("en-LK")}`

// Rich Life's WhatsApp order line in international format, digits only
// (e.g. "94771234567"). Left empty, WhatsApp asks the customer to pick a chat.
const WHATSAPP_NUMBER = ""

const PACKING_MS = 3000

type Order = { products: Product[]; title?: string; price?: number }

const orderTotal = (order: Order) =>
  order.price ??
  order.products.reduce((sum, product) => sum + product.price, 0)

const buildWhatsAppUrl = (order: Order) => {
  const items = order.products
  const lines = new Map<number, { product: Product; quantity: number }>()
  for (const product of items) {
    const line = lines.get(product.id)
    if (line) line.quantity += 1
    else lines.set(product.id, { product, quantity: 1 })
  }
  const message = [
    order.title
      ? `Hi Rich Life! I'd like to order the ${order.title} box:`
      : "Hi Rich Life! I'd like to order this Christmas cheese box:",
    "",
    ...[...lines.values()].map(({ product, quantity }) =>
      order.title
        ? `• ${quantity} × ${product.brand} ${product.name} (${product.note})`
        : `• ${quantity} × ${product.brand} ${product.name} (${product.note}) — ${formatPrice(
            product.price * quantity,
          )}`,
    ),
    "",
    `Total: ${formatPrice(orderTotal(order))}`,
  ].join("\n")

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Ready-made boxes are shown with their actual contents, packed into the
// same wooden box as the builder. Bundle prices sit below the item total.
const premadeBoxes = [
  {
    name: "The Colombo Christmas",
    detail: "3 Rich Life cheeses · 2 crackers · woodapple jam · Serves 4",
    price: 3450,
    productIds: [1, 3, 4, 6, 7, 9],
    badge: "Bestseller",
  },
  {
    name: "Hill Country Feast",
    detail: "All 5 Rich Life cheeses · 3 crackers · 2 pairings · Serves 8",
    price: 5650,
    productIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    badge: "Family size",
  },
  {
    name: "The Little Festive Board",
    detail: "2 Rich Life cheeses · cream crackers · chutney · Serves 2",
    price: 2090,
    productIds: [1, 2, 6, 10],
    badge: "For two",
  },
]

function Icon({
  name,
  size = 20,
}: {
  name: "x" | "plus" | "minus" | "chat"
  size?: number
}) {
  const paths = {
    chat: (
      <>
        <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6l-3.9.9Z" />
        <path d="M9.2 8.6c.3-.6.9-.6 1.1-.1l.6 1.4c.1.3 0 .6-.2.8l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.2-.2.5-.3.8-.2l1.4.6c.5.2.5.8-.1 1.1-1.2.7-2.7.5-4.3-.9-1.7-1.6-2.3-3.6-1.6-5Z" />
      </>
    ),
    x: <path d="m7 7 10 10M17 7 7 17" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  )
}

// A product placed in the box. left/top are the item's top-left corner as a
// percentage of the box, so arrangements survive resizing.
type BoxItem = {
  uid: number
  product: Product
  left: number
  top: number
  rotation: number
  z: number
}

let nextBoxUid = 1

// Narrow (phone) boxes get a roomier 3-column layout with bigger items.
const isCompactBox = () =>
  typeof window !== "undefined" && window.innerWidth <= 640

const createBoxItem = (
  product: Product,
  index: number,
  at?: { left: number; top: number },
): BoxItem => {
  const compact = isCompactBox()
  const columns = compact ? 3 : 6
  const perLayer = columns * 3
  const slot = index % perLayer
  const layer = Math.floor(index / perLayer)
  const column = slot % columns
  const row = Math.floor(slot / columns)
  const rotations = [-8, 4, -3, 7, -5, 6]

  return {
    uid: nextBoxUid++,
    product,
    left:
      at?.left ??
      (compact ? 12 + column * 26 : 22 + column * 11.2) + (layer % 3) * 1.6,
    top:
      at?.top ??
      (compact ? 22 + row * 19 : 24 + row * 15) + (layer % 4) * 1.4,
    rotation: rotations[column],
    z: 10 + index,
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export default function App() {
  const [boxItems, setBoxItems] = useState<BoxItem[]>(() =>
    [products[0], products[5], products[8]].map((product, index) =>
      createBoxItem(product, index),
    ),
  )
  const boxProducts = boxItems.map((item) => item.product)
  const boxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    uid: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const [draggingUid, setDraggingUid] = useState<number | null>(null)
  const [selectedUid, setSelectedUid] = useState<number | null>(null)

  // Dragging a product card into the box. Mouse drags start after a small
  // move; touch drags start after a short press so the row still scrolls.
  const cardDragRef = useRef<{
    product: Product
    pointerId: number
    isTouch: boolean
    startX: number
    startY: number
    x: number
    y: number
    active: boolean
    timer?: number
  } | null>(null)
  const cardRowRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const overBoxRef = useRef(false)
  const [ghostProduct, setGhostProduct] = useState<Product | null>(null)

  useEffect(() => {
    const row = cardRowRef.current
    if (!row) return
    // Must be non-passive so an active touch drag can stop the page scrolling.
    const blockScroll = (event: TouchEvent) => {
      if (cardDragRef.current?.active) event.preventDefault()
    }
    row.addEventListener("touchmove", blockScroll, { passive: false })
    return () => row.removeEventListener("touchmove", blockScroll)
  }, [])
  const [openGifts, setOpenGifts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".gift-card")
    const observer = new IntersectionObserver(
      (entries) =>
        setOpenGifts((open) => {
          const next = new Set(open)
          for (const entry of entries) {
            const name = (entry.target as HTMLElement).dataset.box!
            if (entry.isIntersecting) next.add(name)
            else next.delete(name)
          }
          return next
        }),
      // Open while the card crosses the middle band of the screen, whatever
      // its height.
      { rootMargin: "-30% 0px -30% 0px" },
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [toast, setToast] = useState("")
  const [packingPhase, setPackingPhase] = useState<
    "idle" | "packing" | "sending"
  >("idle")
  const [packingOrder, setPackingOrder] = useState<Order>({ products: [] })
  const boxTotal = boxProducts.reduce((sum, product) => sum + product.price, 0)

  const orderOnWhatsApp = (order: Order = { products: boxProducts }) => {
    if (order.products.length === 0 || packingPhase !== "idle") return
    const url = buildWhatsAppUrl(order)
    setPackingOrder(order)
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const duration = reduceMotion ? 600 : PACKING_MS

    setPackingPhase("packing")
    window.setTimeout(() => setPackingPhase("sending"), duration * 0.8)
    window.setTimeout(() => {
      window.location.href = url
      // Leave the overlay up briefly so it doesn't flash before WhatsApp opens.
      window.setTimeout(() => setPackingPhase("idle"), 1200)
    }, duration)
  }
  const filteredProducts = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  )
  const topZ = () => Math.max(10, ...boxItems.map((item) => item.z)) + 1

  const addProduct = (
    product: Product,
    at?: { left: number; top: number },
  ) => {
    setBoxItems((items) => [
      ...items,
      { ...createBoxItem(product, items.length, at), z: topZ() },
    ])
  }

  const countInBox = (product: Product) =>
    boxItems.filter((item) => item.product.id === product.id).length

  // Removes the most recently added item of this product.
  const removeOne = (product: Product) => {
    setBoxItems((items) => {
      const index = items
        .map((item) => item.product.id)
        .lastIndexOf(product.id)
      return index < 0 ? items : items.filter((_, i) => i !== index)
    })
  }

  // Converts a pointer position to the item's top-left corner in box %.
  const toBoxPosition = (
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const rect = boxRef.current!.getBoundingClientRect()
    return {
      left: clamp(((clientX - rect.left - offsetX) / rect.width) * 100, -2, 88),
      top: clamp(((clientY - rect.top - offsetY) / rect.height) * 100, 6, 82),
    }
  }

  const startArranging = (
    event: ReactPointerEvent<HTMLDivElement>,
    uid: number,
  ) => {
    if ((event.target as HTMLElement).closest(".packed-remove")) return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      uid,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    }
    setDraggingUid(uid)
    setSelectedUid(uid)
    const z = topZ()
    setBoxItems((items) =>
      items.map((item) => (item.uid === uid ? { ...item, z } : item)),
    )
  }

  const moveArranging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const position = toBoxPosition(
      event.clientX,
      event.clientY,
      drag.offsetX,
      drag.offsetY,
    )
    setBoxItems((items) =>
      items.map((item) =>
        item.uid === drag.uid ? { ...item, ...position } : item,
      ),
    )
  }

  const stopArranging = () => {
    dragRef.current = null
    setDraggingUid(null)
  }

  const placeGhost = (element: HTMLDivElement | null) => {
    const drag = cardDragRef.current
    if (!element || !drag) return
    element.style.transform = `translate3d(${drag.x - 48}px, ${drag.y - 64}px, 0)`
  }

  const isOverBox = (x: number, y: number) => {
    const rect = boxRef.current?.getBoundingClientRect()
    return (
      !!rect &&
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    )
  }

  const activateCardDrag = () => {
    const drag = cardDragRef.current
    if (!drag) return
    drag.active = true
    setGhostProduct(drag.product)
    if (drag.isTouch) navigator.vibrate?.(12)
  }

  const endCardDrag = (drop: boolean) => {
    const drag = cardDragRef.current
    if (!drag) return
    window.clearTimeout(drag.timer)
    if (drop && drag.active && isOverBox(drag.x, drag.y)) {
      const rect = boxRef.current!.getBoundingClientRect()
      const [width, height] = isCompactBox() ? [0.24, 0.19] : [0.135, 0.22]
      addProduct(
        drag.product,
        toBoxPosition(
          drag.x,
          drag.y,
          (rect.width * width) / 2,
          (rect.height * height) / 2,
        ),
      )
    }
    cardDragRef.current = null
    overBoxRef.current = false
    setGhostProduct(null)
    setIsDraggingOver(false)
  }

  const startCardDrag = (
    event: ReactPointerEvent<HTMLElement>,
    product: Product,
  ) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button"))
      return
    const isTouch = event.pointerType !== "mouse"
    cardDragRef.current = {
      product,
      pointerId: event.pointerId,
      isTouch,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      active: false,
      timer: isTouch ? window.setTimeout(activateCardDrag, 220) : undefined,
    }
    if (!isTouch) event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveCardDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = cardDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    drag.x = event.clientX
    drag.y = event.clientY

    if (!drag.active) {
      const moved = Math.hypot(drag.x - drag.startX, drag.y - drag.startY)
      if (moved < 6) return
      // A touch that moves before the press completes is a scroll.
      if (drag.isTouch) return endCardDrag(false)
      activateCardDrag()
    }

    placeGhost(ghostRef.current)
    const over = isOverBox(drag.x, drag.y)
    if (over !== overBoxRef.current) {
      overBoxRef.current = over
      setIsDraggingOver(over)
    }
    // Keep the box reachable when it has scrolled out of view.
    if (drag.y < 90) window.scrollBy(0, -14)
    else if (drag.y > window.innerHeight - 90) window.scrollBy(0, 14)
  }

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#13306b]">
      {toast && (
        <div
          aria-live="polite"
          className="fixed left-4 right-4 top-4 z-50 rounded-full bg-[#13306b] px-5 py-3 text-center text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5"
        >
          {toast}
        </div>
      )}

      {boxItems.length > 0 && packingPhase === "idle" && (
        <button
          aria-label={`Order your box of ${boxItems.length} items on WhatsApp`}
          className="whatsapp-fab fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-full bg-[#1fa855] py-2 pl-2 pr-5 text-left text-white shadow-[0_14px_30px_rgba(19,48,107,0.32)] transition hover:-translate-y-0.5 hover:bg-[#178f47] sm:inset-x-auto sm:bottom-6 sm:right-6"
          onClick={() => orderOnWhatsApp()}
        >
          <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white/15">
            <Icon name="chat" size={24} />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c41e3a] px-1 text-[11px] font-bold">
              {boxItems.length}
            </span>
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight">
              Order on WhatsApp
            </span>
            <span className="block text-[11px] font-semibold text-white/80">
              Your box · {formatPrice(boxTotal)}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ml-auto pl-2 text-xl leading-none sm:hidden"
          >
            →
          </span>
        </button>
      )}

      {ghostProduct && (
        <div
          aria-hidden="true"
          className="drag-ghost"
          ref={(element) => {
            ghostRef.current = element
            placeGhost(element)
          }}
        >
          <img alt="" src={ghostProduct.image} />
        </div>
      )}

      {packingPhase !== "idle" && (
        <div
          aria-live="assertive"
          className="packing-overlay fixed inset-0 z-[60] grid place-items-center px-6"
          role="status"
        >
          <div className="relative flex flex-col items-center text-center">
            <div className="pack-scene" aria-hidden="true">
              <div className="pack-back" />
              {packingOrder.products.slice(0, 5).map((product, index, shown) => (
                <img
                  alt=""
                  className="pack-item"
                  key={`${product.id}-${index}`}
                  src={product.image}
                  style={
                    {
                      "--x": `${(index - (shown.length - 1) / 2) * 46}px`,
                      "--r": `${[-9, 6, -4, 8, -6][index]}deg`,
                      "--delay": `${index * 140}ms`,
                    } as CSSProperties
                  }
                />
              ))}
              <div className="pack-front">
                <span className="pack-ribbon-front" />
                <img alt="" className="pack-stamp" src="/richlife-logo.svg" />
              </div>
              <div className="pack-lid">
                <span className="pack-ribbon-lid" />
                <span className="pack-bow pack-bow-left" />
                <span className="pack-bow pack-bow-right" />
                <span className="pack-bow-knot" />
              </div>
              <span className="pack-sparkle pack-sparkle-1" />
              <span className="pack-sparkle pack-sparkle-2" />
              <span className="pack-sparkle pack-sparkle-3" />
            </div>
            <p className="mt-8 font-display text-3xl leading-tight sm:text-4xl">
              {packingPhase === "packing"
                ? `Packing your ${packingOrder.title ?? "Rich Life box"}…`
                : "Opening WhatsApp…"}
            </p>
            <p className="mt-2 text-sm text-[#13306b]/60">
              {packingOrder.products.length}{" "}
              {packingOrder.products.length === 1 ? "item" : "items"} ·{" "}
              {formatPrice(orderTotal(packingOrder))}
            </p>
          </div>
        </div>
      )}

      <div className="festive-bar truncate px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs sm:tracking-[0.18em]">
        {daysToChristmas} days to Christmas
        <span className="hidden sm:inline"> · Say cheese with Rich Life</span> ·
        #RichLifeChristmas
      </div>

      <header className="border-b border-[#13306b]/15 bg-[#f7f2e8]/95 px-4 backdrop-blur sm:px-5">
        <div className="mx-auto grid h-[68px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center sm:h-[80px]">
          <nav className="hidden text-[13px] font-semibold md:block">
            <a className="transition hover:opacity-55" href="#builder">
              Build a box
            </a>
          </nav>
          <a
            className="group col-start-2"
            href="#"
            aria-label="Rich Life home"
          >
            <img
              alt="Rich Life"
              className="h-11 w-auto transition group-hover:scale-[1.03] sm:h-[52px]"
              src="/richlife-logo.svg"
            />
          </a>
          <nav className="hidden justify-self-end text-[13px] font-semibold md:block">
            <a className="transition hover:opacity-55" href="#premade">
              Ready-made
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="builder"
          className="festive-hero relative overflow-hidden px-4 pb-14 pt-5 sm:px-5 sm:pt-7 lg:pb-20 lg:pt-10"
        >
          <div className="snowfall pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="builder-frame flex flex-col rounded-[28px] border border-[#13306b]/10 bg-[#fffaf1]/90 p-3 shadow-[0_24px_70px_rgba(19,48,107,0.10)] backdrop-blur-sm sm:rounded-[36px] sm:p-5">
              <div className="order-1">
                <div
                  className={`cheese-box relative min-h-[410px] overflow-hidden rounded-[22px] transition sm:min-h-[500px] sm:rounded-[30px] ${
                    isDraggingOver ? "ring-4 ring-[#c41e3a]/55" : ""
                  }`}
                  onPointerDown={(event) => {
                    if (!(event.target as HTMLElement).closest(".packed-item"))
                      setSelectedUid(null)
                  }}
                  ref={boxRef}
                >
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1640095109426-b0a083fb7144?auto=format&fit=crop&w=1400&q=88"
                  />
                  <div className="absolute inset-0 bg-[#17221b]/5" />

                  <div className="absolute right-4 top-4 z-30 sm:right-7 sm:top-7">
                    {boxItems.length > 0 && (
                      <button
                        className="whitespace-nowrap rounded-full bg-[#f7f2e8]/90 px-4 py-2 text-xs font-bold shadow-sm backdrop-blur transition hover:bg-white"
                        onClick={() => setBoxItems([])}
                      >
                        Clear box
                      </button>
                    )}
                  </div>

                  <div className="packed-products absolute inset-0 z-20">
                    {boxItems.map(({ uid, product, left, top, rotation, z }) => (
                      <div
                        className={`packed-item group ${
                          draggingUid === uid ? "is-arranging" : ""
                        } ${selectedUid === uid ? "is-selected" : ""}`}
                        key={uid}
                        onLostPointerCapture={stopArranging}
                        onPointerCancel={stopArranging}
                        onPointerDown={(event) => startArranging(event, uid)}
                        onPointerMove={moveArranging}
                        onPointerUp={stopArranging}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: `rotate(${
                            draggingUid === uid ? 0 : rotation
                          }deg) rotateX(5deg) scale(${
                            (product.scale ?? 1) * (draggingUid === uid ? 1.08 : 1)
                          })`,
                          zIndex: z,
                        }}
                      >
                        <img
                          alt={`${product.brand} ${product.name}`}
                          className="product-cutout"
                          draggable={false}
                          src={product.image}
                        />
                        <button
                          aria-label={`Remove ${product.name}`}
                          className="packed-remove"
                          onClick={() => {
                            setBoxItems((items) =>
                              items.filter((item) => item.uid !== uid),
                            )
                            setSelectedUid(null)
                          }}
                        >
                          <Icon name="x" size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {boxItems.length === 0 && (
                    <div className="absolute inset-0 z-20 grid place-items-center">
                      <div className="rounded-[22px] border border-white/50 bg-[#13306b]/85 px-7 py-5 text-center text-white shadow-xl backdrop-blur-sm">
                        <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border border-dashed border-white/60">
                          <Icon name="plus" size={17} />
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.15em]">
                          Drop products into the box
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#13306b]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md backdrop-blur">
                    {isDraggingOver
                      ? "Drop it in the box"
                      : `${boxItems.length} ${
                          boxItems.length === 1 ? "item" : "items"
                        } · Drag to arrange`}
                  </div>
                </div>
              </div>

              <div className="order-2 mt-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 max-w-full">
                    <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.17em] text-[#c41e3a]">
                      Choose your products
                    </p>
                    <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#13306b]/15 bg-white/25 p-1">
                      {([
                        "All",
                        "Cheese",
                        "Crackers",
                        "Pairings",
                      ] as Category[]).map((category) => (
                        <button
                          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                            activeCategory === category
                              ? "bg-[#13306b] text-white"
                              : "hover:bg-white/60"
                          }`}
                          key={category}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="no-scrollbar -mx-3 flex snap-x snap-mandatory scroll-px-3 gap-3 overflow-x-auto px-3 pb-3 sm:mx-0 sm:px-0"
                  ref={cardRowRef}
                >
                  {filteredProducts.map((product) => (
                    <article
                      className={`product-card group w-[64vw] max-w-[260px] shrink-0 snap-start rounded-[22px] border border-[#13306b]/12 bg-[#fffaf1] p-3 sm:w-[240px] ${
                        ghostProduct?.id === product.id ? "is-lifted" : ""
                      }`}
                      key={product.id}
                      onContextMenu={(event) => event.preventDefault()}
                      onLostPointerCapture={() => endCardDrag(false)}
                      onPointerCancel={() => endCardDrag(false)}
                      onPointerDown={(event) => startCardDrag(event, product)}
                      onPointerMove={moveCardDrag}
                      onPointerUp={() => endCardDrag(true)}
                    >
                      <div className="product-stage relative h-40 overflow-hidden rounded-[15px]">
                        <img
                          alt={`${product.brand} ${product.name}`}
                          className="product-stage-image transition duration-500 group-hover:scale-105"
                          draggable={false}
                          src={product.image}
                        />
                        {countInBox(product) > 0 ? (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-[#13306b] p-1 text-white shadow-md">
                            <button
                              aria-label={`Remove one ${product.name} from box`}
                              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/15 sm:h-8 sm:w-8"
                              onClick={() => removeOne(product)}
                            >
                              <Icon name="minus" size={16} />
                            </button>
                            <span
                              aria-live="polite"
                              className="min-w-5 text-center text-sm font-bold"
                            >
                              {countInBox(product)}
                            </span>
                            <button
                              aria-label={`Add another ${product.name} to box`}
                              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/15 sm:h-8 sm:w-8"
                              onClick={() => addProduct(product)}
                            >
                              <Icon name="plus" size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            aria-label={`Add ${product.name} to box`}
                            className="absolute bottom-2 right-2 grid h-12 w-12 place-items-center rounded-full bg-[#f7f2e8] shadow-sm transition hover:scale-105 hover:bg-white sm:h-10 sm:w-10"
                            onClick={() => addProduct(product)}
                          >
                            <Icon name="plus" size={18} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c41e3a]">
                            {product.brand}
                          </p>
                          <h3 className="mt-0.5 text-sm font-bold">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#13306b]/55">
                            {product.note}
                          </p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-bold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-[0.17em] text-[#13306b]/40">
                  <span className="md:hidden">
                    Tap + or hold &amp; drag into the box
                  </span>
                  <span className="hidden md:inline">
                    Drag your favourites up into the live box
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="premade"
          className="festive-premade relative overflow-hidden bg-[#13306b] px-4 py-16 text-[#fff8eb] sm:px-5 sm:py-20 lg:py-28"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]">
                  Christmas, wrapped
                </p>
                <h2 className="font-display text-[clamp(3rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.05em]">
                  Ready to gift.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                Rich Life cheeses paired with Sri Lankan favourites. Just choose
                your occasion.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {premadeBoxes.map((box) => (
                <article
                  className={`gift-card group ${
                    openGifts.has(box.name) ? "is-open" : ""
                  }`}
                  data-box={box.name}
                  key={box.name}
                >
                  <div className="gift-box-scene relative aspect-[1.2] overflow-hidden rounded-[22px] sm:rounded-[26px]">
                    <div
                      aria-label={`${box.name}: ${box.productIds
                        .map((id) => {
                          const product = products.find((p) => p.id === id)!
                          return `${product.brand} ${product.name}`
                        })
                        .join(", ")}`}
                      className="gift-box-photo absolute inset-0 transition duration-700 group-hover:scale-105"
                      role="img"
                    >
                      <div className="blue-box">
                        <img
                          alt=""
                          className="blue-box-logo"
                          src="/richlife-logo.svg"
                        />
                      </div>
                      <div
                        className={`gift-contents ${
                          box.productIds.length > 6 ? "is-full" : ""
                        }`}
                      >
                        {box.productIds.map((id, index) => (
                          <img
                            alt=""
                            key={id}
                            src={products.find((p) => p.id === id)!.image}
                            style={
                              {
                                "--r": `${[-7, 5, -3, 6, -5, 4, -6, 3, -4, 7][index]}deg`,
                              } as CSSProperties
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="gift-box-shine pointer-events-none absolute inset-0" />
                    <div
                      className="gift-lid pointer-events-none"
                      aria-hidden="true"
                    >
                      <div className="gift-lid-top">
                        <span className="gift-ribbon-vertical" />
                        <span className="gift-ribbon-horizontal" />
                        <span className="gift-bow gift-bow-left" />
                        <span className="gift-bow gift-bow-right" />
                        <span className="gift-bow-knot" />
                      </div>
                      <div className="gift-lid-edge" />
                    </div>
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-[#f7f2e8] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#13306b]">
                      {box.badge}
                    </span>
                    <button
                      aria-label={`Order ${box.name} on WhatsApp`}
                      className="absolute bottom-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-[#1fa855] text-white shadow-lg transition hover:scale-105 hover:bg-[#178f47]"
                      onClick={() =>
                        orderOnWhatsApp({
                          products: box.productIds.map(
                            (id) => products.find((p) => p.id === id)!,
                          ),
                          title: box.name,
                          price: box.price,
                        })
                      }
                    >
                      <Icon name="chat" size={24} />
                    </button>
                  </div>
                  <div className="flex items-start justify-between gap-4 px-1 pt-5">
                    <div>
                      <h3 className="font-display text-2xl">{box.name}</h3>
                      <p className="mt-1 text-xs text-white/60">{box.detail}</p>
                    </div>
                    <p className="whitespace-nowrap pt-1 text-sm font-bold">
                      {formatPrice(box.price)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="story"
          className="festive-story bg-[#13306b] px-5 pb-28 pt-14 text-[#f7f2e8] sm:pb-14"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-center">
            <p className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">
              A generous Sri Lankan Christmas starts with good cheese.
            </p>
            <div className="text-sm leading-6 text-white/65 md:text-right">
              <p>Rich Life cheese, made with fresh local milk.</p>
              <p>Hand-packed for the festive season.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
