import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";

function LoginPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?technology,office')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg text-white text-center">
        <h1 className="text-4xl font-bold mb-8">Employee Portal</h1>
        <a
          href="http://localhost:3000/auth"
          className="bg-green-500 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
        >
          Login with ServiceNow
        </a>
      </div>
    </div>
  );
}

function HomePage({ user, logout }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-6"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?workspace,corporate')",
      }}
    >
      <header className="flex justify-between items-center p-4 bg-gray-800 bg-opacity-80 rounded-lg">
        <h2 className="text-2xl font-semibold">Welcome, {user.user_name}!</h2>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-lg">
          Logout
        </button>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-6 bg-black bg-opacity-70 p-6 rounded-lg">
        <ProfilePanel user={user} />
        <UserAssets assets={user.assets} />
        <UserIncidents incidents={user.incidents} />
      </div>
    </div>
  );
}

function ProfilePanel({ user }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Profile Details</h3>
      <p>
        <strong>Name:</strong> {user.user_name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Department:</strong> {user.department}
      </p>
    </div>
  );
}

function UserAssets({ assets }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Allocated Assets</h3>
      <ul>
        {assets.map((asset, index) => (
          <li key={index} className="mt-2">
            {asset.name} - {asset.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserIncidents({ incidents }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Your Incidents</h3>
      <ul>
        {incidents.map((incident, index) => (
          <li key={index} className="mt-2">
            {incident.issue} - {incident.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
      });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <HomePage user={user} logout={handleLogout} />
            ) : (
              <LoginPage />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
