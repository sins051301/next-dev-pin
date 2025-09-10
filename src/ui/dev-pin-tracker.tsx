"use client";

import { useState, useRef } from "react";
import useLocalStorage from "../context/useLocalStorage";
import { useDevPin } from "@/context/dev-pin-provider";
import "./dev-pin-tracker.css";

function DevPinTracker() {
  const { todos } = useDevPin();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(true);
  const [pos, setPos] = useState({ x: 5, y: 5 });
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>(
    "dev-pin",
    {}
  );

  const toggleCheck = (todo: string) => {
    setChecked((prev) => ({
      ...prev,
      [todo]: !prev[todo],
    }));
  };

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="devpin-tracker" style={{ top: pos.y, left: pos.x }}>
      <div
        className="tracker-header"
        onMouseDown={handleMouseDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setOpen(!open);
          }
        }}
      >
        <h2 className="tracker-title">📍 Issue Tracker</h2>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse tracker" : "Expand tracker"}
          className="tracker-toggle"
        >
          {open ? "▾" : "▸"}
        </button>
      </div>

      {open && (
        <ul className="tracker-list">
          {todos.map((t) => {
            const isCollapsed = collapsed[t.id] ?? false;
            return (
              <li key={t.id} className="tracker-item">
                <div
                  className="tracker-group"
                  onClick={() => toggleGroup(t.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      toggleGroup(t.id);
                    }
                  }}
                >
                  <div className="tracker-url">{t.url}</div>
                  <span className="tracker-arrow">
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                </div>

                {!isCollapsed && (
                  <ul className="todo-sublist">
                    {t.todos.map((todo) => (
                      <li key={todo} className="todo-item">
                        <input
                          type="checkbox"
                          checked={!!checked[todo]}
                          onChange={() => toggleCheck(todo)}
                        />
                        <span className={checked[todo] ? "checked" : ""}>
                          {todo}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default DevPinTracker;
