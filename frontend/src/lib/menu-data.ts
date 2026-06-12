import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";
import dish6 from "@/assets/dish-6.jpg";

export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: "Mains" | "Pizza" | "Salads" | "Desserts" | "Drinks";
  tags: string[];
  rating: number;
  orders: number;
  popular?: boolean;
};

export const dishes: Dish[] = [
  { id: "d1", name: "Truffle Tagliatelle", desc: "Hand-rolled ribbons, black truffle, aged parmesan.", price: 24, image: dish1, category: "Mains", tags: ["vegetarian"], rating: 4.9, orders: 1284, popular: true },
  { id: "d2", name: "Smoked Ribeye", desc: "Cherry-wood smoked, charred shallots, bone marrow jus.", price: 38, image: dish2, category: "Mains", tags: ["gluten-free"], rating: 4.8, orders: 942, popular: true },
  { id: "d3", name: "Wood-Fired Margherita", desc: "San Marzano, fior di latte, garden basil, 90s in the oven.", price: 18, image: dish3, category: "Pizza", tags: ["vegetarian"], rating: 4.9, orders: 1620, popular: true },
  { id: "d4", name: "Molten Caramel Cube", desc: "Single-origin chocolate, salted caramel, edible gold.", price: 14, image: dish4, category: "Desserts", tags: ["vegetarian"], rating: 4.7, orders: 770 },
  { id: "d5", name: "Citrus & Pomegranate", desc: "Sumac dressing, blood orange, herbs from our roof.", price: 16, image: dish5, category: "Salads", tags: ["vegan", "gluten-free"], rating: 4.6, orders: 510 },
  { id: "d6", name: "Smoked Old Fashioned", desc: "Apple-wood smoke, copper mug, single barrel bourbon.", price: 17, image: dish6, category: "Drinks", tags: [], rating: 4.8, orders: 880 },
];

export const reviews = [
  { name: "Aanya Mehta", rating: 5, text: "The truffle tagliatelle is a religious experience. The room glows.", role: "Food critic, Eaterly" },
  { name: "Marcus Cole", rating: 5, text: "Service felt choreographed. Smoked ribeye is now a personality trait.", role: "Regular guest" },
  { name: "Priya R.", rating: 4, text: "Booked the corner banquette — perfect anniversary dinner.", role: "Verified diner" },
  { name: "Kenji Tanaka", rating: 5, text: "Cocktails arrive theatrically. The smoked old fashioned is unreal.", role: "Mixology blog" },
];

export const tables = [
  { id: "t1", name: "Banquette 04", seats: 2, vibe: "Window, golden hour", popular: true },
  { id: "t2", name: "Corner 11", seats: 4, vibe: "Quiet, brick wall", popular: true },
  { id: "t3", name: "Chef's Counter", seats: 2, vibe: "Front-row to the open kitchen" },
  { id: "t4", name: "Lounge 07", seats: 6, vibe: "Plush, low light, perfect for groups" },
  { id: "t5", name: "Garden 02", seats: 4, vibe: "Outdoor courtyard, fairy lights" },
  { id: "t6", name: "Private Room", seats: 10, vibe: "Whole room, dedicated server" },
];
