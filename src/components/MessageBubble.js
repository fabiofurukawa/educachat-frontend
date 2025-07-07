import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const MessageBubble = forwardRef(({ message, loading, className }, ref) => (
  <div
    ref={ref}
    className={`message-bubble ${message.role} ${loading ? "loading" : ""} ${className || ""}`}
  >
    {message.role === "assistant" ? (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          li: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
          strong: ({ children }) => <strong style={{ color: "#0d3796" }}>{children}</strong>,
          h2: ({ children }) => (
            <h2
              style={{
                color: "#2151a7",
                margin: "14px 0 6px 0",
                fontSize: "1.22em",
              }}
            >
              {children}
            </h2>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    ) : (
      <span>{message.content}</span>
    )}
  </div>
));

export default MessageBubble;
