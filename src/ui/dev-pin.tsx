"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useLocalStorage from "../context/useLocalStorage";
import { useDevPin } from "../context/dev-pin-provider";
import "./dev-pin.css";

interface DevPinProps {
  id: string;
  profileImg?: string;
  name: string;
  description?: string;
  x?: number;
  y?: number;
  todos: string[];
  root?: boolean;
}

function DevPin({
  id,
  profileImg,
  name,
  description,
  x = 20,
  y = 20,
  todos,
  root = false,
}: DevPinProps) {
  const [todoOpen, setTodoOpen] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pathname = usePathname();
  const { register, remove } = useDevPin();

  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>(
    `dev-pin-${id}`,
    {}
  );

  const toggleCheck = (todo: string) => {
    setChecked((prev) => ({
      ...prev,
      [todo]: !prev[todo],
    }));
  };

  useEffect(() => {
    register({
      id,
      x,
      y,
      url: pathname,
      todos,
    });
  }, [pathname]);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    const path = window.location.pathname;
    const normalized = path.startsWith("/") ? path.slice(1) : path;
    const relativePath = normalized || "page";

    try {
      const res = await fetch("/api/dev-pin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, relativePath, run: true }),
      });
      const data = await res.json();
      console.log("🗑️ DevPin 삭제 요청:", data);
      setRemoved(true);
      remove(id);
    } catch (err) {
      console.error("❌ 삭제 실패", err);
    } finally {
      setDeleting(false);
    }
  };

  if (removed) return null;
  if (root && pathname !== "/") return null;

  return (
    <div
      className="devpin-container"
      style={{ top: y, left: x }}
      onMouseEnter={() => setTodoOpen(true)}
      onMouseLeave={() => setTodoOpen(false)}
    >
      {todoOpen ? (
        <>
          <div className="devpin-header">
            <p className="devpin-title">{name}</p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="devpin-delete-btn"
              title="이 DevPin 삭제"
            >
              {deleting ? "삭제중…" : "삭제"}
            </button>
          </div>

          <div className="devpin-body">
            <h2 className="devpin-section-title">Dev Issue</h2>
            {description && <p className="devpin-description">{description}</p>}

            <h3 className="devpin-section-title">Todo</h3>
            <ul className="devpin-todo-list">
              {todos.map((todo) => (
                <li key={todo} className="devpin-todo-item">
                  <input
                    type="checkbox"
                    checked={!!checked[todo]}
                    onChange={() => toggleCheck(todo)}
                  />
                  <span className={checked[todo] ? "checked" : ""}>{todo}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="devpin-avatar-wrapper">
          <div className="devpin-avatar">
            <img
              src={
                profileImg ||
                "https://api.dicebear.com/7.x/notionists/png?size=40"
              }
              alt={name || "프로필 이미지"}
              width={20}
              height={20}
              className="avatar-img"
            />
            <div className="devpin-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DevPin;
