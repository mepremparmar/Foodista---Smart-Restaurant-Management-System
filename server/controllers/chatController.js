const pool = require('../config/db');

exports.processChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "I didn't quite catch that." });
    
    const msg = message.toLowerCase();
    
    // 1. Greetings
    if (msg.match(/\b(hi|hello|hey|greetings)\b/)) {
      return res.json({ reply: "Hello! I am the Foodista Chef. How can I help you today?" });
    }

    // 2. Personalized Context (Highest Priority)
    const isPersonalizedQuery = msg.match(/\b(order|orders|track|status|reservation|booking|bookings|table|preference|dietary|collection|favorite|saved)\b/);

    if (isPersonalizedQuery) {
      if (!req.user) {
        return res.json({ reply: "Please log in to your account so I can look up your personal details like orders, reservations, and preferences." });
      }

      // Authenticated queries
      if (msg.match(/\b(order|orders|track|status)\b/)) {
        const [orders] = await pool.query('SELECT * FROM Orders WHERE customer_id = ? ORDER BY order_date DESC LIMIT 1', [req.user.customer_id]);
        if (orders.length > 0) {
          const o = orders[0];
          const stat = o.tracking_status || o.status;
          return res.json({ reply: `Your most recent order (#${o.order_id}) is currently ${stat}. The total was $${Number(o.total_amount).toFixed(2)}.` });
        } else {
          return res.json({ reply: "You don't have any recent orders." });
        }
      }
      
      if (msg.match(/\b(reservation|table|booking|bookings)\b/)) {
        const [reservations] = await pool.query('SELECT r.*, ts.start_time, ts.end_time FROM Reservation r JOIN TimeSlot ts ON r.slot_id = ts.slot_id WHERE r.customer_id = ? ORDER BY r.date DESC LIMIT 1', [req.user.customer_id]);
        if (reservations.length > 0) {
          const r = reservations[0];
          return res.json({ reply: `You have a reservation for Table ${r.table_id} on ${new Date(r.date).toLocaleDateString()} from ${r.start_time} to ${r.end_time}.` });
        } else {
          return res.json({ reply: "You don't have any upcoming reservations." });
        }
      }
      
      if (msg.match(/\b(preference|dietary)\b/)) {
        const [users] = await pool.query('SELECT * FROM Customer WHERE customer_id = ?', [req.user.customer_id]);
        if (users.length > 0) {
           return res.json({ reply: `Your recorded email is ${users[0].email} and phone is ${users[0].phone}. I can help you update your preferences on the Dashboard!` });
        }
      }
      
      if (msg.match(/\b(collection|favorite|saved)\b/)) {
        const [cols] = await pool.query('SELECT m.name FROM Collection c JOIN MenuItem m ON c.menuitem_id = m.menuitem_id WHERE c.customer_id = ?', [req.user.customer_id]);
        if (cols.length > 0) {
          const names = cols.map(c => c.name).join(', ');
          return res.json({ reply: `You have ${cols.length} item(s) in your collection: ${names}.` });
        } else {
          return res.json({ reply: "Your collection is currently empty. Go to the menu to add some favorites!" });
        }
      }
    }
    
    // 3. FAQs (Lower Priority)
    if (msg.match(/\b(hours|time|open|closing)\b/)) {
      return res.json({ reply: "We are open Monday to Sunday, from 10:00 AM to 11:00 PM." });
    }
    if (msg.match(/\b(location|address|where)\b/)) {
      return res.json({ reply: "We are located at 123 Culinary Street, Foodville. See you soon!" });
    }
    if (msg.match(/\b(menu|food|serve|eat)\b/)) {
      return res.json({ reply: "We serve a variety of cuisines including Indian, Italian, and Continental. Check out our Menu page for more details!" });
    }
    
    return res.json({ reply: "I'm still learning! I can help you with FAQs, or look up your recent orders, reservations, and collections." });
  } catch (error) {
    next(error);
  }
};
