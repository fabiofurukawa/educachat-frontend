import React, { useState } from "react";

// Função para agrupar conversas por data
function groupByDate(conversations) {
  const groups = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (date.toDateString() === today.toDateString()) return "Hoy";
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";
    return date.toLocaleDateString();
  };

  conversations.forEach(conv => {
    const label = formatDate(conv.createdAt || conv.updatedAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
  });

  return Object.entries(groups).sort((a, b) => {
    const order = { "Hoy": 0, "Ayer": 1 };
    const aOrd = order[a[0]] ?? 2;
    const bOrd = order[b[0]] ?? 2;
    if (aOrd !== bOrd) return aOrd - bOrd;
    const aDate = a[1][0].createdAt || a[1][0].updatedAt;
    const bDate = b[1][0].createdAt || b[1][0].updatedAt;
    return new Date(bDate) - new Date(aDate);
  });
}

const Sidebar = ({
  conversations,
  currentId,
  onSelect,
  onStartNew,
  onDelete,
  onRename,
}) => {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const startRenaming = (id, oldName) => {
    setRenamingId(id);
    setRenameValue(oldName || "");
    setMenuOpenId(null);
  };

  const finishRenaming = (id) => {
    onRename(id, renameValue.trim() || "Sin título");
    setRenamingId(null);
    setRenameValue("");
  };

  const grouped = groupByDate(conversations);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Tus chats</span>
        <button className="sidebar-new-btn" onClick={onStartNew}>
          Crear Chat
        </button>
      </div>
      <div className="sidebar-scroll">
        {grouped.map(([dateLabel, convs]) => (
          <div key={dateLabel}>
            <div className="sidebar-date-label">{dateLabel}</div>
            <ul>
              {convs.map((conv) => (
                <li
                  key={conv.id}
                  className={conv.id === currentId ? "active" : ""}
                  onClick={() => onSelect(conv.id)}
                  onMouseLeave={() => setMenuOpenId(null)}
                  style={{ position: "relative" }}
                >
                  {renamingId === conv.id ? (
                    <input
                      className="rename-input"
                      value={renameValue}
                      autoFocus
                      onBlur={() => finishRenaming(conv.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishRenaming(conv.id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span
                        className="conv-title"
                        onDoubleClick={() => startRenaming(conv.id, conv.name)}
                        title="Doble click para renombrar"
                      >
                        {conv.name || "Sin título"}
                      </span>
                      <span
                        className="sidebar-more-btn"
                        title="Más opciones"
                        onClick={e => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginLeft: 6,
                          fontSize: "1.25em",
                          color: "#888",
                          cursor: "pointer",
                          opacity: 0.6
                        }}
                        onMouseEnter={e => setMenuOpenId(conv.id)}
                      >
                        ⋯
                      </span>
                      {menuOpenId === conv.id && (
                        <div className="sidebar-popup-menu"
                          onClick={e => e.stopPropagation()}
                        >
                          <div
                            className="sidebar-popup-item"
                            onClick={() => { onDelete(conv.id); setMenuOpenId(null); }}
                          >Borrar</div>
                          <div
                            className="sidebar-popup-item"
                            onClick={() => startRenaming(conv.id, conv.name)}
                          >Renombrar</div>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
