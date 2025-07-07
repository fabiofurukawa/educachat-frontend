import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import "./styles/sidebar.css";
import "./styles/header.css";

function getInitialConversations() {
  try {
    const saved = JSON.parse(localStorage.getItem("conversations"));
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch {}
  const agora = new Date();
  return [
    {
      id: String(Date.now()),
      name: `Nova conversa`,
      messages: [
        {
          role: "assistant",
          content: "¡Hola! Soy EducaChat, tu profe virtual. ¿Sobre qué tema te gustaría aprender hoy?",
        },
      ],
      createdAt: agora.toISOString(),
      updatedAt: agora.toISOString(),
      autoNamed: false,
    },
  ];
}

function App() {
  const [conversations, setConversations] = useState(getInitialConversations());
  const [currentId, setCurrentId] = useState(conversations[0].id);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const addConversation = () => {
    const count = conversations.filter(c => c.name?.startsWith("Nova conversa")).length;
    const agora = new Date();
    const newConv = {
      id: String(Date.now() + Math.random()),
      name: `Nova conversa${count > 0 ? ` ${count + 1}` : ""}`,
      messages: [
        {
          role: "assistant",
          content: "¡Hola! Soy EducaChat, tu profe virtual. ¿Sobre qué tema te gustaría aprender hoy?",
        },
      ],
      createdAt: agora.toISOString(),
      updatedAt: agora.toISOString(),
      autoNamed: false,
    };
    setConversations([newConv, ...conversations]);
    setCurrentId(newConv.id);
  };

  const deleteConversation = (id) => {
    let newList = conversations.filter((c) => c.id !== id);
    setConversations(newList);
    if (id === currentId) {
      if (newList.length) setCurrentId(newList[0].id);
      else addConversation();
    }
  };

  const renameConversation = (id, name) => {
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, name, autoNamed: true } : c))
    );
  };

  const updateMessages = (id, messages) => {
    setConversations(conversations => conversations.map((c) => {
      if (c.id !== id) return c;
      let newName = c.name;
      let autoNamed = c.autoNamed;
      if (!autoNamed) {
        const firstUserMsg = messages.find(m => m.role === "user");
        if (firstUserMsg && firstUserMsg.content) {
          newName = firstUserMsg.content.slice(0, 35) + (firstUserMsg.content.length > 35 ? "..." : "");
          autoNamed = true;
        }
      }
      return {
        ...c,
        messages,
        updatedAt: new Date().toISOString(),
        name: newName,
        autoNamed
      };
    }));
  };

  const currentConv = conversations.find((c) => c.id === currentId);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff" }}>
      {/* CABEÇALHO GLOBAL */}
      <header className="top-header">
        <img src="/logo.png" alt="EducaChat Logo" className="main-logo" />
      </header>
      <div style={{ display: "flex", height: "calc(100vh - 84px)", overflow: "hidden" }}>
        <Sidebar
          conversations={conversations}
          currentId={currentId}
          onSelect={setCurrentId}
          onStartNew={addConversation}
          onDelete={deleteConversation}
          onRename={renameConversation}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Chat
            messages={currentConv?.messages || []}
            setMessages={(msgs) => updateMessages(currentId, msgs)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
