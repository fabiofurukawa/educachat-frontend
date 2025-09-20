// src/App.jsx
import React, { useContext } from "react";
import { UserProvider, UserContext } from "./context/UserContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import { signOut, auth } from "./firebase"; // 👈 corregido

const AppInner = () => {
  const { currentUser, setCurrentUser, loading } = useContext(UserContext);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Cargando sesión…</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {!currentUser ? (
        <>
          <h2>EducaChat Pro</h2>
          <Login onLoginSuccess={setCurrentUser} />
          <hr style={{ margin: "20px 0" }} />
          <Register onRegisterSuccess={setCurrentUser} />
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{currentUser.email}</h3>
            <button onClick={handleLogout}>Salir</button>
          </div>
          <Chat />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  );
}
