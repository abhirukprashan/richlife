import { type CSSProperties } from "react"
import { useReveal } from "./useReveal"
import WaveDivider from "./WaveDivider"

type IdeaProduct = { id: number; name: string; image: string }

// Ways to use Rich Life cheese; `productIds` match the builder's products.
// Each card shows the finished dish rather than the packaging. Photos are
// CC0 (Rawpixel / Wikimedia Commons / Flickr / Public Domain Photos): cheese
// board, chicken kottu, grilled cheese, paneer jalfrezi, baked pasta, brie on
// crackers, omelette, pizza, garlic bread, cutlets, queso dip and cheese straws.
const ideas = [
  {
    title: "Christmas cheese board",
    text: "Cube the cheddar, fan out the wedges and add crackers and woodapple jam. Done in ten minutes.",
    image: "/ideas/cheese-board.jpg",
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
    image: "/ideas/grilled-cheese.jpg",
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
    image: "/ideas/pasta-bake.jpg",
    productIds: [3],
    tag: "Family dinner",
  },
  {
    title: "Cracker bites",
    text: "Spread on cream crackers, top with a pepper wedge slice and a drizzle of kithul treacle.",
    image: "/ideas/crackers.jpg",
    productIds: [4, 21],
    tag: "Snack",
  },
]

// The second rail: more everyday ways to cook with the same cheeses.
const moreIdeas = [
  {
    title: "Cheese omelette",
    text: "Whisk two eggs, pour into melted butter and fold a slice of cheese through for a soft golden breakfast.",
    image: "/ideas/omelette.jpg",
    productIds: [18],
    tag: "Breakfast",
  },
  {
    title: "Cheese pizza night",
    text: "Top a readymade base with tomato sauce, capsicum and grated cheddar, then bake until bubbling.",
    image: "/ideas/pizza.jpg",
    productIds: [19, 3],
    tag: "Party",
  },
  {
    title: "Cheese garlic bread",
    text: "Spread garlic butter on a baguette, cover with processed cheese and grill until the top turns golden.",
    image: "/ideas/cheese-garlic-bread.jpg",
    productIds: [2],
    tag: "Tea time",
  },
  {
    title: "Cheese cutlets",
    text: "Mix grated paneer with mashed potato, green chilli and herbs, then crumb and fry until crisp.",
    image: "/ideas/cutlets.jpg",
    productIds: [5],
    tag: "Snack",
  },
  {
    title: "Warm cheese dip",
    text: "Melt cooking cheese with a splash of milk and chilli, then serve warm with chips or veggie sticks.",
    image: "/ideas/cheese-dip.jpg",
    productIds: [3, 4],
    tag: "Sharing",
  },
  {
    title: "Cheese straws",
    text: "Grate cheddar into rough puff pastry, twist into straws and bake for a Christmas nibble.",
    image: "/ideas/cheese-straws.jpg",
    productIds: [19],
    tag: "Festive",
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

  const renderIdea = (idea: (typeof ideas)[number], index: number) => {
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
          <img alt="" decoding="async" loading="lazy" src={idea.image} />
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
  }

  return (
    <section className="ideas-section" id="ideas" ref={ref}>
      <WaveDivider back="#ffffff" color="#eef4ff" />
      <div className="mx-auto max-w-[1200px] ideas-head">
        <div className="ideas-intro">
          <p
            className="ideas-kicker"
            data-reveal
            style={{ "--i": 0 } as CSSProperties}
          >
            Cheese, twelve ways
          </p>
          <h2
            className="ideas-title"
            data-reveal
            style={{ "--i": 1 } as CSSProperties}
          >
            Ways to enjoy Rich Life cheese
          </h2>
          <p
            className="ideas-lead"
            data-reveal
            style={{ "--i": 2 } as CSSProperties}
          >
            Easy ideas for the Christmas table and everyday Sri Lankan
            favourites. Add the cheese you need straight to your box.
          </p>
        </div>
      </div>

      <div className="ideas-rail">
        <div className="ideas-grid">{ideas.map(renderIdea)}</div>
      </div>

      <div className="ideas-rail">
        <div className="ideas-grid">{moreIdeas.map(renderIdea)}</div>
      </div>
    </section>
  )
}
