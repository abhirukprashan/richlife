import type { CSSProperties } from "react"
import { useReveal } from "./useReveal"
import WaveDivider from "./WaveDivider"

type IdeaProduct = { id: number; name: string; image: string }

// Ways to use Rich Life cheese; `productIds` match the builder's products.
// Each card shows the finished dish rather than the packaging. Photos are
// CC0 (Rawpixel / Wikimedia Commons): cheese board, chicken kottu, grilled
// cheese, paneer jalfrezi, baked pasta and brie on crackers.
const ideas = [
  {
    title: "Christmas cheese board",
    text: "Cube the cheddar, fan out the wedges and add crackers and woodapple jam. Done in ten minutes.",
    image: "/ideas/cheese-board.webp",
    productIds: [19, 1],
    tag: "Party",
  },
  {
    title: "Cheese kottu",
    text: "Toss grated cheese through hot chicken or vegetable kottu at the very end so it melts into every bite.",
    image: "/ideas/kottu.jpg",
    productIds: [2],
    tag: "Street food",
  },
  {
    title: "Grilled cheese toast",
    text: "Two slices between buttered bread, toasted until golden and stretchy. Perfect with evening tea.",
    image: "/ideas/grilled-cheese.webp",
    productIds: [18],
    tag: "Tea time",
  },
  {
    title: "Devilled paneer",
    text: "Fry paneer cubes, then toss with onion, capsicum, chilli and a splash of tomato sauce.",
    image: "/ideas/paneer.jpg",
    productIds: [5],
    tag: "Spicy",
  },
  {
    title: "Creamy pasta bake",
    text: "Swiss cooking cheese melts smoothly over baked pasta, vegetables or a Christmas gratin.",
    image: "/ideas/pasta-bake.webp",
    productIds: [3],
    tag: "Family dinner",
  },
  {
    title: "Cracker bites",
    text: "Spread on cream crackers, top with a pepper wedge slice and a drizzle of kithul treacle.",
    image: "/ideas/crackers.webp",
    productIds: [4, 21],
    tag: "Snack",
  },
]

export default function CheeseIdeas({
  products,
  onAdd,
}: {
  products: IdeaProduct[]
  onAdd: (productIds: number[], title: string) => void
}) {
  const ref = useReveal<HTMLElement>()
  const byId = new Map(products.map((product) => [product.id, product]))

  return (
    <section className="ideas-section" id="ideas" ref={ref}>
      <WaveDivider back="#ffffff" color="#eef4ff" />
      <div className="mx-auto max-w-[1200px]">
        <div className="ideas-intro" data-reveal>
          <p className="ideas-kicker">Cheese, six ways</p>
          <h2 className="ideas-title">Ways to enjoy Rich Life cheese</h2>
          <p className="ideas-lead">
            Easy ideas for the Christmas table and everyday Sri Lankan
            favourites. Add the cheese you need straight to your box.
          </p>
        </div>

        <div className="ideas-grid">
          {ideas.map((idea, index) => {
            const used = idea.productIds
              .map((id) => byId.get(id))
              .filter((product): product is IdeaProduct => !!product)

            return (
              <article
                className="idea-card"
                data-reveal
                key={idea.title}
                style={{ "--i": index } as CSSProperties}
              >
                <div aria-hidden="true" className="idea-stage">
                  <img
                    alt=""
                    decoding="async"
                    loading="lazy"
                    src={idea.image}
                  />
                  <span className="idea-tag">{idea.tag}</span>
                </div>
                <h3 className="idea-title">{idea.title}</h3>
                <p className="idea-text">{idea.text}</p>
                <p className="idea-uses">
                  Uses {used.map((product) => product.name).join(" + ")}
                </p>
                <button
                  className="idea-add"
                  onClick={() => onAdd(idea.productIds, idea.title)}
                >
                  Add to my box
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
