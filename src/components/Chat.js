// src/components/Chat.js
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react";
import MessageBubble from "./MessageBubble";
import ChartBubble from "./ChartBubble";
import FunctionPlotBubble from "./FunctionPlotBubble";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import "../styles/chat.css";
import { UserContext } from "../context/UserContext";
import Login from "./Login";
import Register from "./Register";

function tryParseChart(msg) {
  if (msg.role === "assistant" && typeof msg.content === "string") {
    try {
      const parsed = JSON.parse(msg.content);
      if (parsed.type === "chart" && parsed.data) return { chart: parsed };
      if (parsed.type === "function-plot" && parsed.fn)
        return { functionPlot: parsed };
    } catch {}
  }
  return {};
}

const Chat = ({ estiloBalon }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const safeMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMsg, setTypingMsg] = useState(null);
  const [fullTypingMsg, setFullTypingMsg] = useState(null);
  const typingTimeoutRef = useRef(null);

  const lastUserMessageRef = useRef(null);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);

  // contador de uso
  const [usageCount, setUsageCount] = useState(0);
  const LIMIT = 5; // 👈 número de mensajes gratis antes de pedir login

  useEffect(() => {
    if (!loading && inputRef.current) inputRef.current.focus();
  }, [loading]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [safeMessages, typingMsg]);

  const stopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingMsg(null);
    if (fullTypingMsg) {
      setMessages([
        ...safeMessages,
        { role: "assistant", content: fullTypingMsg },
      ]);
      setFullTypingMsg(null);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // si pasó del límite y no está logado, bloquea
    if (usageCount >= LIMIT && !currentUser) {
      return;
    }

    const userMessage = { role: "user", content: input };

    const nextMessages = [...safeMessages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setTypingMsg(null);
    setFullTypingMsg(null);

    try {
      const response = await axios.post(
        "https://educachat-backend-fabio-2890cbc27e00.herokuapp.com/api/chat",
        {
          userId: currentUser?.uid || null,
          messages: nextMessages,
        }
      );

      setUsageCount((prev) => prev + 1); // 👈 suma al contador

      const aiMsg = response.data.message;
      if (
        aiMsg.role === "assistant" &&
        typeof aiMsg.content === "string" &&
        !aiMsg.content.trim().startsWith("{")
      ) {
        let idx = 0;
        setTypingMsg("");
        setFullTypingMsg(aiMsg.content);
        const typeText = () => {
          idx++;
          setTypingMsg(aiMsg.content.slice(0, idx));
          if (idx < aiMsg.content.length) {
            typingTimeoutRef.current = setTimeout(typeText, 17);
          } else {
            setTypingMsg(null);
            setFullTypingMsg(null);
            setMessages([...safeMessages, userMessage, aiMsg]);
          }
        };
        typeText();
      } else {
        setMessages([...safeMessages, userMessage, aiMsg]);
      }
    } catch (err) {
      setMessages([
        ...safeMessages,
        userMessage,
        {
          role: "assistant",
          content: "¡Uy! Hubo un error. ¿Quieres intentarlo de nuevo?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBubbleClass = () => {
    if (estiloBalon === "ultracompacto") return "ultracompacto";
    if (estiloBalon === "intermediario") return "intermediario";
    return "";
  };

  return (
    <div className="chat-container">
      {/* Caja de chat */}
      <div className="chat-box" ref={chatBoxRef}>
        {safeMessages.map((msg, idx) => {
          const { chart, functionPlot } = tryParseChart(msg);
          if (chart)
            return (
              <ChartBubble key={idx} data={chart.data} title={chart.title} />
            );
          if (functionPlot)
            return (
              <FunctionPlotBubble
                key={idx}
                fn={functionPlot.fn}
                domain={functionPlot.domain}
                title={functionPlot.title}
              />
            );
          const isLastUserMsg =
            msg.role === "user" &&
            idx === safeMessages.map((m) => m.role).lastIndexOf("user");
          return (
            <MessageBubble
              key={idx}
              message={msg}
              ref={isLastUserMsg ? lastUserMessageRef : null}
              className={getBubbleClass()}
            />
          );
        })}
        {typingMsg !== null && (
          <MessageBubble
            message={{ role: "assistant", content: typingMsg }}
            loading
            className={getBubbleClass()}
          />
        )}
        {loading && typingMsg === null && (
          <MessageBubble
            message={{ role: "assistant", content: "..." }}
            loading
            className={getBubbleClass()}
          />
        )}
      </div>

      {/* Barra de entrada */}
      <form className="input-bar" onSubmit={handleSend}>
        <TextareaAutosize
          className="input-textarea"
          ref={inputRef}
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          minRows={1}
          maxRows={6}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading && input.trim()) {
                handleSend(e);
              }
            }
          }}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Enviar
        </button>
        {typingMsg !== null && (
          <button type="button" onClick={stopTyping} className="stop-btn">
            Stop
          </button>
        )}
      </form>

      {/* Popup de login si alcanzó el límite */}
      {usageCount >= LIMIT && !currentUser && (
        <div className="popup">
          <div className="popup-content">
            <h3>Para continuar, haz login o regístrate</h3>
            <Login onLoginSuccess={setCurrentUser} />
            <Register onRegisterSuccess={setCurrentUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
