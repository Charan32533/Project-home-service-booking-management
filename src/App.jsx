
import React, { useState, useEffect } from "react";
import {
  Home, Search, User, Wrench, Zap, Paintbrush,
  Sparkles, Snowflake, Hammer, CalendarDays,
  ShieldCheck, Star, LogOut, Trash2, Menu, X
} from "lucide-react";

const services = [
  { id: 1, name: "Home Cleaning", category: "Cleaning", price: 799, icon: Sparkles, description: "Professional home cleaning services." },
  { id: 2, name: "Plumbing", category: "Repair", price: 499, icon: Wrench, description: "Expert plumbing repairs and maintenance." },
  { id: 3, name: "Electrical Repair", category: "Repair", price: 599, icon: Zap, description: "Safe electrical installation and repair." },
  { id: 4, name: "AC Service", category: "Maintenance", price: 899, icon: Snowflake, description: "Complete AC servicing and maintenance." },
  { id: 5, name: "Home Painting", category: "Painting", price: 2499, icon: Paintbrush, description: "Professional painting for your home." },
  { id: 6, name: "Carpentry", category: "Repair", price: 699, icon: Hammer, description: "Furniture and carpentry solutions." }
];

const getData = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [users, setUsers] = useState(() => getData("he_users", []));
  const [bookings, setBookings] = useState(() => getData("he_bookings", []));
  const [currentUser, setCurrentUser] = useState(() => getData("he_currentUser", null));
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [adminMode, setAdminMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => localStorage.setItem("he_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("he_bookings", JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem("he_currentUser", JSON.stringify(currentUser)), [currentUser]);

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const go = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const logout = () => {
    setCurrentUser(null);
    go("home");
    notify("Logged out successfully.");
  };

  const openBooking = (service) => {
    if (!currentUser) {
      setSelectedService(service);
      setAuthMode("login");
      setAdminMode(false);
      go("auth");
      notify("Please log in to book a service.");
    } else {
      setSelectedService(service);
      go("booking");
    }
  };

  const register = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name").trim();
    const email = data.get("email").trim().toLowerCase();
    const password = data.get("password");

    if (users.some(u => u.email === email)) {
      notify("Email already registered.");
      return;
    }

    const user = { id: Date.now(), name, email, password };
    setUsers(old => [...old, user]);
    setCurrentUser(user);
    go("home");
    notify("Account created successfully!");
  };

  const login = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email").trim().toLowerCase();
    const password = data.get("password");

    if (adminMode) {
      if (email === "admin@homeease.com" && password === "admin123") {
        setCurrentUser({ id: "admin", name: "Administrator", email, role: "admin" });
        go("admin");
        notify("Welcome Admin!");
      } else {
        notify("Invalid admin login details.");
      }
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      notify("Incorrect email or password.");
      return;
    }

    setCurrentUser(user);
    go("home");
    notify("Login successful!");
  };

  const createBooking = (e) => {
    e.preventDefault();
    if (!selectedService || !currentUser) return;

    const data = new FormData(e.currentTarget);
    const booking = {
      id: Date.now(),
      userId: currentUser.id,
      customer: currentUser.name,
      email: currentUser.email,
      service: selectedService.name,
      price: selectedService.price,
      phone: data.get("phone"),
      address: data.get("address"),
      date: data.get("date"),
      time: data.get("time"),
      status: "Pending"
    };

    setBookings(old => [booking, ...old]);
    setSelectedService(null);
    go("dashboard");
    notify("Booking created successfully!");
  };

  const updateStatus = (id, status) => {
    setBookings(old => old.map(b => b.id === id ? { ...b, status } : b));
    notify("Booking status updated.");
  };

  const deleteBooking = (id) => {
    if (!window.confirm("Delete this booking?")) return;
    setBookings(old => old.filter(b => b.id !== id));
    notify("Booking deleted.");
  };

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);
  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#f6f8fc;color:#172033}
        button,input,select,textarea{font:inherit}
        button{cursor:pointer}
        .navbar{height:75px;background:white;display:flex;align-items:center;justify-content:space-between;padding:0 7%;box-shadow:0 3px 20px #0000000c;position:sticky;top:0;z-index:5}
        .logo{font-size:25px;font-weight:800;color:#dc2626;cursor:pointer}
        .logo span{color:#172033}
        .nav{display:flex;align-items:center;gap:25px}
        .nav button{border:0;background:none;font-weight:600;color:#475569}
        .nav button:hover{color:#dc2626}
        .primary,.secondary,.danger{border:0;border-radius:9px;padding:12px 19px;font-weight:700}
        .primary{background:#dc2626;color:white}
        .primary:hover{background:#b91c1c}
        .secondary{background:#fee2e2;color:#dc2626}
        .danger{background:#fee2e2;color:#b91c1c}
        .hero{padding:85px 7%;display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center;background:linear-gradient(120deg,#fef2f2,#fee2e2)}
        .hero h1{font-size:clamp(38px,5vw,62px);line-height:1.15;margin:15px 0}
        .hero h1 span{color:#dc2626}
        .hero p{font-size:17px;line-height:1.8;color:#64748b;margin-bottom:25px}
        .hero-art{height:330px;border-radius:28px;background:linear-gradient(140deg,#dc2626,#f87171);display:grid;place-items:center;color:white}
        .hero-art svg{width:130px;height:130px}
        .section,.page{padding:65px 7%}
        .heading{text-align:center;margin-bottom:35px}
        .heading h2,.page h1{font-size:34px;margin-bottom:12px}
        .muted{color:#718096;line-height:1.7}
        .eyebrow{color:#dc2626;font-weight:800;letter-spacing:2px;font-size:12px;text-transform:uppercase}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:30px}
        .service-card,.card,.stat{background:white;border:1px solid #e9edf4;border-radius:17px;padding:25px;box-shadow:0 7px 24px #00000008}
        .service-card{transition:.2s}
        .service-card:hover{transform:translateY(-5px);box-shadow:0 14px 30px #00000012}
        .service-icon{width:55px;height:55px;border-radius:14px;background:#fef2f2;color:#dc2626;display:grid;place-items:center;margin-bottom:18px}
        .service-card h3{margin-bottom:10px}
        .service-card p{color:#718096;font-size:14px;line-height:1.6;min-height:45px}
        .service-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:10px}
        .price{font-size:20px;color:#dc2626;font-weight:800}
        .features{background:#172f59;color:white;padding:55px 7%;display:grid;grid-template-columns:repeat(3,1fr);gap:25px;text-align:center}
        .features svg{color:#fca5a5;width:32px;height:32px;margin-bottom:12px}
        .features p{color:#cbd5e1;margin-top:10px;font-size:14px}
        .footer{background:#101f3b;color:white;padding:30px 7%;display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}
        .search{width:100%;padding:14px;border:1px solid #dce2eb;border-radius:10px;margin:25px 0}
        .auth{min-height:75vh;display:grid;place-items:center;padding:35px 15px;background:#fef2f2}
        .form-card{background:white;border:1px solid #e9edf4;border-radius:18px;padding:32px;width:100%;max-width:460px;box-shadow:0 10px 35px #0000000b}
        .form-card h2{font-size:28px;margin-bottom:8px}
        .field{margin:17px 0}
        .field label{display:block;font-size:13px;font-weight:700;margin-bottom:8px}
        .field input,.field textarea,.field select{width:100%;padding:13px;border:1px solid #dce2eb;border-radius:9px;outline:none}
        .field input:focus,.field textarea:focus,.field select:focus{border-color:#dc2626}
        .field textarea{min-height:85px}
        .full{width:100%}
        .link{border:0;background:none;color:#dc2626;font-weight:700}
        .auth-switch{text-align:center;margin-top:20px;color:#64748b}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:25px 0 35px}
        .stat span{color:#718096;font-size:13px}
        .stat h2{font-size:30px;color:#dc2626;margin-top:8px}
        .table-wrap{overflow-x:auto;background:white;border-radius:14px;border:1px solid #e9edf4;margin-top:20px}
        table{border-collapse:collapse;width:100%;min-width:680px}
        th,td{text-align:left;padding:15px;border-bottom:1px solid #edf0f5;font-size:13px}
        th{background:#f8fafc;color:#64748b}
        .status{padding:6px 10px;border-radius:20px;font-size:11px;font-weight:800}
        .pending{background:#fff7ed;color:#c2410c}
        .confirmed{background:#dcfce7;color:#15803d}
        .completed{background:#dbeafe;color:#b91c1c}
        .cancelled{background:#fee2e2;color:#b91c1c}
        .table-wrap select{padding:7px;border:1px solid #dce2eb;border-radius:7px}
        .empty{text-align:center;padding:45px;background:white;border-radius:15px;margin-top:20px}
        .toast{position:fixed;bottom:25px;right:25px;background:#172f59;color:white;padding:15px 22px;border-radius:10px;z-index:10}
        @media(max-width:800px){.hero{grid-template-columns:1fr}.grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.navbar{padding:0 5%}.nav{gap:8px}.nav button{font-size:12px}.hero,.section,.page{padding:40px 5%}.grid,.features,.stats{grid-template-columns:1fr}.hero-art{height:220px}.hero h1{font-size:40px}.heading h2,.page h1{font-size:27px}}
      `}</style>

      <header className="navbar">
        <div className="logo" onClick={() => go("home")}>⌂ Home<span>Ease</span></div>
        <nav className="nav">
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("services")}>Services</button>
          <button onClick={() => go("about")}>About</button>
          {currentUser?.role === "admin" && <button onClick={() => go("admin")}>Admin</button>}
          {currentUser?.role !== "admin" && currentUser && <button onClick={() => go("dashboard")}>My Bookings</button>}
          {currentUser ? <button className="primary" onClick={logout}>Logout</button> : <button className="primary" onClick={() => { setAdminMode(false); setAuthMode("login"); go("auth"); }}>Login / Sign Up</button>}
        </nav>
      </header>

      {page === "home" && <>
        <section className="hero">
          <div>
            <div className="eyebrow">Your home, our responsibility</div>
            <h1>Professional Home Services, <span>Made Easy.</span></h1>
            <p>Find trusted professionals for all your home needs. Book services easily, save time and enjoy a comfortable home.</p>
            <button className="primary" onClick={() => go("services")}>Explore Services →</button>
          </div>
          <div className="hero-art"><Home /></div>
        </section>

        <section className="section">
          <div className="heading"><div className="eyebrow">What we offer</div><h2>Our Popular Services</h2><p className="muted">Reliable solutions for every corner of your home.</p></div>
          <div className="grid">
            {services.slice(0, 3).map(s => {
              const Icon = s.icon;
              return <div className="service-card" key={s.id}>
                <div className="service-icon"><Icon /></div>
                <h3>{s.name}</h3><p>{s.description}</p>
                <div className="service-bottom"><div className="price">₹{s.price}</div><button className="secondary" onClick={() => openBooking(s)}>Book Now</button></div>
              </div>;
            })}
          </div>
          <div style={{textAlign:"center",marginTop:30}}><button className="primary" onClick={() => go("services")}>View All Services</button></div>
        </section>

        <section className="features">
          <div><ShieldCheck /><h3>Trusted Professionals</h3><p>Quality-focused home services.</p></div>
          <div><CalendarDays /><h3>Easy Booking</h3><p>Schedule services conveniently.</p></div>
          <div><Star /><h3>Customer First</h3><p>Your comfort matters to us.</p></div>
        </section>
      </>}

      {page === "services" && <section className="page">
        <div className="eyebrow">Our services</div><h1>Explore Our Services</h1>
        <p className="muted">Choose a service for your home.</p>
        <input className="search" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="grid">
          {filteredServices.map(s => {
            const Icon = s.icon;
            return <div className="service-card" key={s.id}>
              <div className="service-icon"><Icon /></div><h3>{s.name}</h3><p>{s.description}</p>
              <div className="service-bottom"><div className="price">₹{s.price}</div><button className="primary" onClick={() => openBooking(s)}>Book Now</button></div>
            </div>;
          })}
        </div>
        {filteredServices.length === 0 && <div className="empty">No services found.</div>}
      </section>}

      {page === "about" && <section className="page">
        <div className="eyebrow">About HomeEase</div><h1>Making Home Services Simple</h1>
        <p className="muted" style={{maxWidth:700,marginTop:20}}>HomeEase is a home-service booking application that connects customers with convenient home maintenance and repair services. Customers can explore services, schedule bookings and track requests. Administrators can manage bookings and registered users.</p>
        <div className="features" style={{marginTop:40,borderRadius:15}}>
          <div><User /><h3>Customer Focused</h3><p>Easy service booking.</p></div>
          <div><CalendarDays /><h3>Easy Management</h3><p>Organized booking system.</p></div>
          <div><ShieldCheck /><h3>Convenient</h3><p>Information in one place.</p></div>
        </div>
      </section>}

      {page === "auth" && <section className="auth">
        <div className="form-card">
          <div className="logo" style={{marginBottom:20}}>⌂ Home<span>Ease</span></div>
          <h2>{adminMode ? "Admin Login" : authMode === "login" ? "Welcome Back!" : "Create Account"}</h2>
          <p className="muted">{adminMode ? "Sign in to manage HomeEase." : "Enter your details to continue."}</p>
          <form onSubmit={adminMode || authMode === "login" ? login : register}>
            {!adminMode && authMode === "signup" && <div className="field"><label>Full Name</label><input name="name" placeholder="Your name" required /></div>}
            <div className="field"><label>Email Address</label><input name="email" type="email" placeholder="Your email" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" minLength="6" placeholder="Your password" required /></div>
            <button className="primary full">{adminMode || authMode === "login" ? "Login" : "Create Account"}</button>
          </form>
          {!adminMode && <div className="auth-switch">
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button className="link" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>{authMode === "login" ? "Sign Up" : "Login"}</button>
          </div>}
          <div style={{textAlign:"center",marginTop:18}}><button className="link" onClick={() => setAdminMode(!adminMode)}>{adminMode ? "User Login" : "Administrator Login"}</button></div>
          {adminMode && <p className="muted" style={{fontSize:12,marginTop:15}}>Demo email: admin@homeease.com<br/>Password: admin123</p>}
        </div>
      </section>}

      {page === "booking" && <section className="page">
        <div className="eyebrow">Schedule a service</div><h1>Complete Your Booking</h1>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:25,marginTop:25}}>
          <div className="card"><h2>{selectedService?.name}</h2><p className="muted">{selectedService?.description}</p><div className="price" style={{marginTop:20}}>₹{selectedService?.price}</div></div>
          <form className="form-card" onSubmit={createBooking}>
            <h2>Booking Details</h2>
            <div className="field"><label>Phone Number</label><input name="phone" type="tel" pattern="[0-9]{10}" placeholder="10-digit number" required /></div>
            <div className="field"><label>Address</label><textarea name="address" placeholder="Enter your address" required /></div>
            <div className="field"><label>Preferred Date</label><input name="date" type="date" min={new Date().toISOString().split("T")[0]} required /></div>
            <div className="field"><label>Preferred Time</label><select name="time" defaultValue="" required><option value="" disabled>Select time</option><option>09:00 AM</option><option>11:00 AM</option><option>01:00 PM</option><option>03:00 PM</option><option>05:00 PM</option></select></div>
            <button className="primary full" disabled={!selectedService}>Confirm Booking</button>
          </form>
        </div>
      </section>}

      {page === "dashboard" && <section className="page">
        <div className="eyebrow">Customer dashboard</div><h1>Welcome, {currentUser?.name}</h1>
        <p className="muted">Manage your home service bookings.</p>
        <div className="stats">
          <div className="stat"><span>Total Bookings</span><h2>{myBookings.length}</h2></div>
          <div className="stat"><span>Pending</span><h2>{myBookings.filter(b => b.status === "Pending").length}</h2></div>
          <div className="stat"><span>Completed</span><h2>{myBookings.filter(b => b.status === "Completed").length}</h2></div>
        </div>
        <h2>My Booking History</h2>
        {myBookings.length === 0 ? <div className="empty"><h3>No bookings yet</h3><p className="muted">Start by exploring our services.</p><button className="primary" style={{marginTop:15}} onClick={() => go("services")}>Explore Services</button></div> :
          <div className="table-wrap"><table><thead><tr><th>Service</th><th>Date</th><th>Time</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody>
            {myBookings.map(b => <tr key={b.id}><td>{b.service}</td><td>{b.date}</td><td>{b.time}</td><td>₹{b.price}</td><td><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></td><td>{b.status === "Pending" && <button className="danger" onClick={() => deleteBooking(b.id)}>Cancel</button>}</td></tr>)}
          </tbody></table></div>}
      </section>}

      {page === "admin" && <section className="page">
        <div className="eyebrow">Administration</div><h1>Admin Dashboard</h1>
        <p className="muted">Manage HomeEase bookings and users.</p>
        <div className="stats">
          <div className="stat"><span>Total Bookings</span><h2>{bookings.length}</h2></div>
          <div className="stat"><span>Registered Users</span><h2>{users.length}</h2></div>
          <div className="stat"><span>Pending Requests</span><h2>{bookings.filter(b => b.status === "Pending").length}</h2></div>
        </div>
        <h2>Manage All Bookings</h2>
        {bookings.length === 0 ? <div className="empty">No bookings available yet.</div> :
          <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th><th>Update</th><th>Delete</th></tr></thead><tbody>
            {bookings.map(b => <tr key={b.id}><td>{b.customer}<br/>{b.email}</td><td>{b.service}</td><td>{b.date}</td><td>₹{b.price}</td><td><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></td><td><select value={b.status} onChange={e => updateStatus(b.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></td><td><button className="danger" onClick={() => deleteBooking(b.id)}><Trash2 size={15}/></button></td></tr>)}
          </tbody></table></div>}
        <h2 style={{marginTop:35}}>Registered Users</h2>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th></tr></thead><tbody>
          {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td></tr>)}
          {users.length === 0 && <tr><td colSpan="2">No users registered.</td></tr>}
        </tbody></table></div>
      </section>}

      <footer className="footer"><div><strong>HomeEase</strong><p>Making home services simple.</p></div><p>© 2026 HomeEase | Academic Project</p></footer>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}
