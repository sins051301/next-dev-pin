"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SafeDevForm from "./dev-safe-form";
import "./dev-pin-global.css";

export default function DevPinGlobalClient() {
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const pathname = usePathname();
  const [relativePath, setRelativePath] = useState("");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!e.altKey) return;
      e.preventDefault();
      setX(e.clientX);
      setY(e.clientY);
      setOpen(true);
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const normalized = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    setRelativePath(normalized || "page");
  }, [pathname]);

  const addTodo = () => {
    const t = newTodo.trim();
    if (!t) return;
    if (todos.includes(t)) {
      setNewTodo("");
      return;
    }
    setTodos((prev) => [...prev, t]);
    setNewTodo("");
  };

  const removeTodo = (idx: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const props = { relativePath, name, description, todos, x, y };

    try {
      const res = await fetch("/api/dev-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = await res.json();

      console.log("✅ DevPin 저장 완료:", data);
      setOpen(false);
      setName("");
      setDescription("");
      setTodos([]);
      setNewTodo("");
    } catch (err) {
      console.error("❌ 전송 실패", err);
    }
  };

  if (!open) return null;

  return (
    <SafeDevForm
      title="저장"
      buttonClassName="btn-save"
      onSubmit={handleSubmit}
      handleClose={handleClose}
      style={{
        position: "absolute",
        top: Math.max(y, 200),
        left: x,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
      formClassName="form-container"
    >
      <div className="form-header">
        <h2>Issue</h2>
      </div>

      <div className="form-body">
        <label className="form-label">Name</label>
        <input
          type="text"
          placeholder="담당자"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="form-label">Description</label>
        <input
          type="text"
          placeholder="설명"
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="todo-section">
          <label className="form-label">Todo</label>
          <div className="todo-input-wrapper">
            <input
              id="todo-input"
              type="text"
              placeholder="해야 할 일 입력 후 +"
              className="form-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="button"
              onClick={addTodo}
              className="btn-add"
              aria-label="Add todo"
              title="할 일 추가"
            >
              +
            </button>
          </div>

          <ul className="todo-list">
            {todos.map((t, idx) => (
              <li key={t} className="todo-item">
                <span className="todo-text">{t}</span>
                <button
                  type="button"
                  onClick={() => removeTodo(idx)}
                  className="btn-delete"
                  aria-label="remove"
                  title="삭제"
                >
                  삭제
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="todo-placeholder">할 일을 추가해보세요.</li>
            )}
          </ul>
        </div>
      </div>
    </SafeDevForm>
  );
}
