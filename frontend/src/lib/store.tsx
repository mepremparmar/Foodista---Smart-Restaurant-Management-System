import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  customer_id?: string;
  fullName: string;
  username: string; // Will map to email/phone conceptually or actual username
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  avatar?: string;
  preferences?: string[];
  dietary?: string[];
};

export type CartItem = { id: string; name: string; price: number; image: string; qty: number };
export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: "received" | "preparing" | "cooking" | "serving" | "delivered" | "completed";
  createdAt: string;
  scheduledFor?: string;
};
export type Booking = {
  id: string;
  table: string;
  table_id: string;
  seats: number;
  date: string;
  time: string;
  guests: number;
};

export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  rating: number;
  orders: number;
  popular?: boolean;
};

export type Table = {
  id: string;
  name: string;
  seats: number;
  vibe: string;
  popular?: boolean;
};

type Theme = "dark" | "light";

type AppState = {
  user: User | null;
  theme: Theme;
  cart: CartItem[];
  orders: Order[];
  bookings: Booking[];
  collections: string[];
  dishes: Dish[];
  tables: Table[];
  login: (id: string, pwd: string) => Promise<boolean>;
  signup: (u: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (u: Partial<User>) => Promise<void>;
  setTheme: (t: Theme) => void;
  addToCart: (i: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMode?: string, scheduledFor?: string) => Promise<Order>;
  addBooking: (b: Omit<Booking, "id">) => Promise<Booking>;
  toggleCollection: (id: string) => Promise<void>;
  submitFeedback: (rating: number, comment: string, orderId?: string | null) => Promise<void>;
  submitContactNote: (name: string, email: string, message: string) => Promise<boolean>;
};

const Ctx = createContext<AppState | null>(null);

const KEY = "foodista-state";
const TOKEN_KEY = "foodista-token";
const API_URL = "http://localhost:5000/api";

// Single fetch helper that always attaches the stored JWT as Bearer token
export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = headers["Content-Type"] || "application/json";
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
};

const FOOD_IMAGES: Record<string, string> = {
  "paneer tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
  "idli": "https://www.awesomecuisine.com/wp-content/uploads/2007/11/Idli-with-sambar-and-chutney.jpg",
  "veg thali": "https://bjtkesamose.com/wp-content/uploads/2025/06/Best-Veg-Thali-Restaurants-in-Indore-You-Must-Try.png",
  "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
  "salad bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  "ice cream": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&q=80",
  "cold coffee": "https://www.milkmaid.in/sites/default/files/2024-05/Cold-Coffee-335x300.jpg",
  "butter chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80",
  "dal makhani": "https://www.funfoodfrolic.com/wp-content/uploads/2023/04/Dal-Makhani-Blog-500x500.jpg",
  "tandoori roti": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMbbh04lsttJ0bVAl538JqmrSiVyGc5_XPYg&s",
  "garlic naan": "https://cdn.tasteatlas.com/images/dishes/bb78aadeae4e4a1c87b3843d8120aa9a.jpg",
  "fish curry": "https://www.thedeliciouscrescent.com/wp-content/uploads/2023/07/Fish-Curry-4.jpg",
  "chicken tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80",
  "gulab jamun": "https://www.cadburydessertscorner.com/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp",
  "mango lassi": "https://aroundtheyum.com/wp-content/uploads/2024/09/mango-lassi-recipe.jpg",
  "mushroom risotto": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&q=80",
  "masala dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
  "cheese pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
  "fresh lime soda": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80",
};

function load() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [user, setUser] = useState<User | null>(initial.user ?? null);
  const [theme, setThemeState] = useState<Theme>(initial.theme ?? "dark");
  const [cart, setCart] = useState<CartItem[]>(initial.cart ?? []);
  const [orders, setOrders] = useState<Order[]>(initial.orders ?? []);
  const [bookings, setBookings] = useState<Booking[]>(initial.bookings ?? []);
  const [collections, setCollections] = useState<string[]>(initial.collections ?? []);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      return;
    }

    authFetch(`/menu/items`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const mapped = d.data.map((m: any) => ({
            id: m.menuitem_id,
            name: m.name,
            desc: m.description,
            price: Number(m.price),
            image: FOOD_IMAGES[m.name?.toLowerCase().trim()] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
            category: m.category || "Main Course",
            tags: m.dietary_type ? [m.dietary_type] : [],
            rating: 4.5,
            orders: 100
          }));
          setDishes(mapped);
        }
      }).catch(console.error);

    authFetch(`/reservations/tables`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const mapped = d.data.map((t: any, i: number) => ({
            id: t.table_id,
            name: `Table ${i + 1} — ${t.seating_capacity} Seater`,
            seats: t.seating_capacity,
            vibe: t.status === "Available" ? "Ready for booking" : "Currently reserved",
            popular: i < 2
          }));
          setTables(mapped);
        }
      }).catch(console.error);

    authFetch(`/collections`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCollections(d.data.map((item: any) => item.menuitem_id));
        }
      }).catch(console.error);
  }, [user?.customer_id]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const fetchOrders = () => {
      authFetch(`/orders`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            const mapped: Order[] = d.data.map((o: any) => ({
              id: o.order_id,
              items: (o.items || []).map((i: any) => ({
                id: i.menuitem_id,
                name: i.name,
                price: Number(i.price) / i.quantity,
                image: FOOD_IMAGES[i.name?.toLowerCase()] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
                qty: i.quantity
              })),
              total: Number(o.total_amount),
              status: (o.tracking_status || "received").toLowerCase() as any,
              createdAt: `${o.order_date ? o.order_date.split('T')[0] : ''}T${o.order_time || ''}`,
              scheduledFor: o.scheduled_time
            }));
            setOrders(mapped);
          }
        }).catch(console.error);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [user?.customer_id]);

  useEffect(() => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ user, theme, cart, orders, bookings, collections })
    );
  }, [user, theme, cart, orders, bookings, collections]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [theme]);

  const value: AppState = {
    user, theme, cart, orders, bookings, collections, dishes, tables,
    login: async (identifier, password) => {
      try {
        const res = await authFetch(`/auth/login`, {
          method: "POST",
          body: JSON.stringify({ identifier, password }),
        });
        const data = await res.json();
        if (data.success) {
          // Store token in localStorage for Bearer auth
          if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
          setUser({
            customer_id: data.data.customer_id,
            fullName: data.data.name,
            username: data.data.email,
            email: data.data.email,
            phone: data.data.phone,
            avatar: data.data.profile_photo,
          } as User);
          if (data.data.theme) setThemeState(data.data.theme);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Login failed", err);
        return false;
      }
    },
    signup: async (u) => {
      const res = await authFetch(`/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          name: u.fullName || u.username,
          email: u.email,
          phone: u.phone,
          password: u.password,
          profile_photo: u.avatar
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Signup failed");
      // Store token in localStorage
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      setUser({
        customer_id: data.data.customer_id,
        fullName: data.data.name,
        username: data.data.email,
        email: data.data.email,
        phone: data.data.phone,
        avatar: data.data.profile_photo,
      });
    },
    logout: async () => {
      try {
        await authFetch(`/auth/logout`, { method: "POST" });
      } catch (err) {}
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    },
    updateUser: async (u) => {
      // Typically an API call to update user
      setUser((cur) => (cur ? { ...cur, ...u } : cur));
    },
    setTheme: setThemeState,
    addToCart: (i) =>
      setCart((c) => {
        const ex = c.find((x) => x.id === i.id);
        return ex ? c.map((x) => (x.id === i.id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...i, qty: 1 }];
      }),
    removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
    setQty: (id, qty) =>
      setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
    clearCart: () => setCart([]),
    placeOrder: async (paymentMode = "UPI", scheduledFor) => {
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      let order: Order = {
        id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        items: cart, total, status: "received",
        createdAt: new Date().toISOString(), scheduledFor,
      };
      
      if (user && user.customer_id) {
        // Sync cart to server first
        await authFetch('/cart/clear', { method: 'DELETE' });
        for (const item of cart) {
          const cartRes = await authFetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ menuitem_id: item.id, quantity: item.qty })
          });
          const cartData = await cartRes.json();
          if (!cartData.success) console.warn('Cart sync failed for item', item.id, cartData);
        }

        // Place the actual order
        let dbPaymentMode = "UPI";
        const modeLower = paymentMode.toLowerCase();
        if (modeLower === "card") {
          dbPaymentMode = "Card";
        } else if (modeLower === "cod" || modeLower === "cash") {
          dbPaymentMode = "Cash";
        }

        const res = await authFetch(`/orders`, {
          method: "POST",
          body: JSON.stringify({
            payment_mode: dbPaymentMode,
            scheduled_time: scheduledFor || null
          })
        });
        const data = await res.json();
        console.log('[placeOrder] API response:', data);
        if (data.success) {
          order.id = data.data.order_id;
        } else {
          throw new Error(data.message || 'Order placement failed');
        }
      }

      setOrders((o) => [order, ...o]);
      setCart([]);
      return order;
    },
    addBooking: async (b) => {
      const booking: Booking = { ...b, id: "RES-" + Math.random().toString(36).slice(2, 8).toUpperCase() };
      
      if (user && user.customer_id) {
        const res = await authFetch(`/reservations/book`, {
          method: "POST",
          body: JSON.stringify({
            table_id: b.table_id,
            date: b.date,
            time: b.time,
            guests: b.guests
          })
        });
        const data = await res.json();
        console.log('[addBooking] API response:', data);
        if (data.success) {
          // Use the DB-generated reservation ID
          booking.id = data.data.reservation_id;
        } else {
          throw new Error(data.message || 'Reservation failed');
        }
      }

      setBookings((bs) => [booking, ...bs]);
      return booking;
    },
    toggleCollection: async (id) => {
      const isAdded = !collections.includes(id);
      setCollections((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

      if (user && user.customer_id) {
        try {
          if (isAdded) {
            await authFetch(`/collections/add`, {
              method: "POST",
              body: JSON.stringify({ menuitem_id: id })
            });
          } else {
            await authFetch(`/collections/remove/${id}`, {
              method: "DELETE"
            });
          }
        } catch (error) {
          console.error("Failed to sync collection with database", error);
        }
      }
    },
    submitFeedback: async (rating, comment, orderId = null) => {
      if (user && user.customer_id) {
        const res = await authFetch(`/feedback`, {
          method: "POST",
          body: JSON.stringify({
            order_id: orderId,
            rating,
            comment
          })
        });
        const data = await res.json();
        console.log('[submitFeedback] API response:', data);
        if (!data.success) {
          throw new Error(data.message || 'Feedback submission failed');
        }
      }
    },
    submitContactNote: async (name, email, message) => {
      try {
        const res = await authFetch(`/contact`, {
          method: "POST",
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();
        return data.success;
      } catch (err) {
        console.error("Failed to submit contact note", err);
        return false;
      }
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
