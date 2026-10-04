import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
export default function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  return loggedIn ? (
    <Dashboard onSignOut={() => setLoggedIn(false)} />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}
