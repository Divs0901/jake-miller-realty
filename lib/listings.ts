export type Listing = {
  id: string;
  address: string;
  city: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  tag: string;
  image: string;
  blurb: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=crop`;

export const listings: Listing[] = [
  {
    id: "barton-hills",
    address: "1842 Barton Hills Dr",
    city: "Austin, TX 78704",
    neighborhood: "Barton Hills",
    price: 875_000,
    beds: 4,
    baths: 3,
    sqft: 2_640,
    tag: "New listing",
    image: img("photo-1564013799919-ab600027ffc6"),
    blurb:
      "Pool, mature oaks and a five-minute walk to the Greenbelt trailhead.",
  },
  {
    id: "mueller",
    address: "3307 Mueller Blvd",
    city: "Austin, TX 78723",
    neighborhood: "Mueller",
    price: 549_000,
    beds: 3,
    baths: 2.5,
    sqft: 1_980,
    tag: "Open house Sat 1–3",
    image: img("photo-1570129477492-45c003edd2be"),
    blurb:
      "Corner lot facing the park, updated kitchen, two blocks from the farmers market.",
  },
  {
    id: "cherrywood",
    address: "612 Cherrywood Ave",
    city: "Austin, TX 78722",
    neighborhood: "Cherrywood",
    price: 389_000,
    beds: 2,
    baths: 2,
    sqft: 1_240,
    tag: "Price reduced",
    image: img("photo-1568605114967-8130f3a36994"),
    blurb:
      "1940s bungalow with a detached studio. Ideal first home or rental.",
  },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
