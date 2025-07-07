// src/components/Login.js
import React, { useEffect, useRef } from "react";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const auth = getAuth(app);

function Login({ onLogin }) {
  const uiRef = useRef(null);

  useEffect(() => {
    if (!window.firebaseUiWidget) {
      window.firebaseUiWidget = new firebaseui.auth.AuthUI(auth);
    }
    window.firebaseUiWidget.start(uiRef.current, {
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/", // Fica na home
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          onLogin(authResult.user); // Passa o usuário para o App
          return false; // Não redireciona sozinho
        },
      },
    });

    // Limpeza do componente
    return () => window.firebaseUiWidget.reset();
  }, [onLogin]);

  return (
    <div>
      <h2>Entrar com Google</h2>
      <div ref={uiRef}></div>
    </div>
  );
}

export default Login;
