"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/context/dev-pin-provider.tsx
import {
  createContext,
  useContext,
  useState as useState5,
  useCallback as useCallback2,
  useMemo
} from "react";

// src/ui/dev-pin-tracker.tsx
import { useState as useState2, useRef } from "react";

// src/context/useLocalStorage.tsx
import { useState, useEffect } from "react";
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}
var useLocalStorage_default = useLocalStorage;

// src/ui/dev-pin-tracker.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function DevPinTracker() {
  const { todos } = useDevPin();
  const [collapsed, setCollapsed] = useState2({});
  const [open, setOpen] = useState2(true);
  const [pos, setPos] = useState2({ x: 5, y: 5 });
  const [checked, setChecked] = useLocalStorage_default(
    "dev-pin",
    {}
  );
  const toggleCheck = (todo) => {
    setChecked((prev) => __spreadProps(__spreadValues({}, prev), {
      [todo]: !prev[todo]
    }));
  };
  const dragRef = useRef(null);
  const toggleGroup = (id) => {
    setCollapsed((prev) => __spreadProps(__spreadValues({}, prev), { [id]: !prev[id] }));
  };
  const handleMouseDown = (e) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy
    });
  };
  const handleMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  return /* @__PURE__ */ jsxs("div", { className: "devpin-tracker", style: { top: pos.y, left: pos.x }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "tracker-header",
        onMouseDown: handleMouseDown,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            setOpen(!open);
          }
        },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "tracker-title", children: "\u{1F4CD} Issue Tracker" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setOpen(!open),
              "aria-label": open ? "Collapse tracker" : "Expand tracker",
              className: "tracker-toggle",
              children: open ? "\u25BE" : "\u25B8"
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("ul", { className: "tracker-list", children: todos.map((t) => {
      var _a;
      const isCollapsed = (_a = collapsed[t.id]) != null ? _a : false;
      return /* @__PURE__ */ jsxs("li", { className: "tracker-item", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "tracker-group",
            onClick: () => toggleGroup(t.id),
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                toggleGroup(t.id);
              }
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "tracker-url", children: t.url }),
              /* @__PURE__ */ jsx("span", { className: "tracker-arrow", children: isCollapsed ? "\u25B8" : "\u25BE" })
            ]
          }
        ),
        !isCollapsed && /* @__PURE__ */ jsx("ul", { className: "todo-sublist", children: t.todos.map((todo) => /* @__PURE__ */ jsxs("li", { className: "todo-item", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: !!checked[todo],
              onChange: () => toggleCheck(todo)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: checked[todo] ? "checked" : "", children: todo })
        ] }, todo)) })
      ] }, t.id);
    }) })
  ] });
}
var dev_pin_tracker_default = DevPinTracker;

// src/ui/dev-pin-global-client.tsx
import { usePathname } from "next/navigation";
import { useCallback, useEffect as useEffect2, useState as useState4 } from "react";

// src/ui/dev-safe-form.tsx
import { useRef as useRef2, useState as useState3 } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function SafeDevForm({
  children,
  onSubmit,
  title,
  disabled,
  buttonClassName = "",
  formClassName = "",
  style,
  handleClose
}) {
  const isLoadingRef = useRef2(false);
  const [reRender, setReRender] = useState3(false);
  return /* @__PURE__ */ jsxs2(
    "form",
    {
      style,
      className: `safe-form ${formClassName}`,
      onSubmit: async (e) => {
        if (isLoadingRef.current) {
          return;
        }
        isLoadingRef.current = true;
        setReRender((prev) => !prev);
        await onSubmit(e);
        isLoadingRef.current = false;
        setReRender((prev) => !prev);
      },
      children: [
        children,
        /* @__PURE__ */ jsxs2("div", { className: "safe-form__actions", children: [
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "button",
              onClick: handleClose,
              className: "safe-form__button safe-form__button--cancel",
              children: "\uCDE8\uC18C"
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "submit",
              disabled: isLoadingRef.current || disabled,
              className: `safe-form__button safe-form__button--submit ${buttonClassName}`,
              children: isLoadingRef.current ? "\uB85C\uB529 \uC911..." : title
            }
          )
        ] })
      ]
    }
  );
}
var dev_safe_form_default = SafeDevForm;

// src/ui/dev-pin-global-client.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function DevPinGlobalClient() {
  const [open, setOpen] = useState4(false);
  const [x, setX] = useState4(0);
  const [y, setY] = useState4(0);
  const [name, setName] = useState4("");
  const [description, setDescription] = useState4("");
  const [todos, setTodos] = useState4([]);
  const [newTodo, setNewTodo] = useState4("");
  const pathname = usePathname();
  const [relativePath, setRelativePath] = useState4("");
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  useEffect2(() => {
    const handler = (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      setX(e.clientX);
      setY(e.clientY);
      setOpen(true);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);
  useEffect2(() => {
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
  const removeTodo = (idx) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const props = { relativePath, name, description, todos, x, y };
    try {
      const res = await fetch("/api/dev-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props)
      });
      const data = await res.json();
      console.log("\u2705 DevPin \uC800\uC7A5 \uC644\uB8CC:", data);
      setOpen(false);
      setName("");
      setDescription("");
      setTodos([]);
      setNewTodo("");
    } catch (err) {
      console.error("\u274C \uC804\uC1A1 \uC2E4\uD328", err);
    }
  };
  if (!open) return null;
  return /* @__PURE__ */ jsxs3(
    dev_safe_form_default,
    {
      title: "\uC800\uC7A5",
      buttonClassName: "btn-save",
      onSubmit: handleSubmit,
      handleClose,
      style: {
        position: "absolute",
        top: Math.max(y, 200),
        left: x,
        transform: "translate(-50%, -50%)",
        zIndex: 9999
      },
      formClassName: "form-container",
      children: [
        /* @__PURE__ */ jsx3("div", { className: "form-header", children: /* @__PURE__ */ jsx3("h2", { children: "Issue" }) }),
        /* @__PURE__ */ jsxs3("div", { className: "form-body", children: [
          /* @__PURE__ */ jsx3("label", { className: "form-label", children: "Name" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              placeholder: "\uB2F4\uB2F9\uC790",
              className: "form-input",
              value: name,
              onChange: (e) => setName(e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx3("label", { className: "form-label", children: "Description" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              placeholder: "\uC124\uBA85",
              className: "form-input",
              value: description,
              onChange: (e) => setDescription(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxs3("div", { className: "todo-section", children: [
            /* @__PURE__ */ jsx3("label", { className: "form-label", children: "Todo" }),
            /* @__PURE__ */ jsxs3("div", { className: "todo-input-wrapper", children: [
              /* @__PURE__ */ jsx3(
                "input",
                {
                  id: "todo-input",
                  type: "text",
                  placeholder: "\uD574\uC57C \uD560 \uC77C \uC785\uB825 \uD6C4 +",
                  className: "form-input",
                  value: newTodo,
                  onChange: (e) => setNewTodo(e.target.value)
                }
              ),
              /* @__PURE__ */ jsx3(
                "button",
                {
                  type: "button",
                  onClick: addTodo,
                  className: "btn-add",
                  "aria-label": "Add todo",
                  title: "\uD560 \uC77C \uCD94\uAC00",
                  children: "+"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs3("ul", { className: "todo-list", children: [
              todos.map((t, idx) => /* @__PURE__ */ jsxs3("li", { className: "todo-item", children: [
                /* @__PURE__ */ jsx3("span", { className: "todo-text", children: t }),
                /* @__PURE__ */ jsx3(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeTodo(idx),
                    className: "btn-delete",
                    "aria-label": "remove",
                    title: "\uC0AD\uC81C",
                    children: "\uC0AD\uC81C"
                  }
                )
              ] }, t)),
              todos.length === 0 && /* @__PURE__ */ jsx3("li", { className: "todo-placeholder", children: "\uD560 \uC77C\uC744 \uCD94\uAC00\uD574\uBCF4\uC138\uC694." })
            ] })
          ] })
        ] })
      ]
    }
  );
}

// src/context/dev-pin-provider.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var DevPinContext = createContext(void 0);
function DevPinProvider({ children }) {
  const [todos, setTodos] = useState5([]);
  const register = useCallback2((item) => {
    setTodos((prev) => {
      const exists = prev.find((t) => t.id === item.id);
      if (exists) {
        return prev.map((t) => t.id === item.id ? item : t);
      }
      return [...prev, item];
    });
  }, []);
  const remove = useCallback2((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const value = useMemo(
    () => ({ todos, register, remove }),
    [todos, register, remove]
  );
  return /* @__PURE__ */ jsxs4(DevPinContext.Provider, { value, children: [
    process.env.NEXT_PUBLIC_DEV_PIN_ENV === "development" && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx4(dev_pin_tracker_default, {}),
      /* @__PURE__ */ jsx4(DevPinGlobalClient, {})
    ] }),
    children
  ] });
}
function useDevPin() {
  const context = useContext(DevPinContext);
  if (!context) {
    throw new Error("useDevPin must be used within DevPinProvider");
  }
  return context;
}

// src/ui/dev-pin.tsx
import { useEffect as useEffect3, useState as useState6 } from "react";
import { usePathname as usePathname2 } from "next/navigation";
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function DevPin({
  id,
  profileImg,
  name,
  description,
  x = 20,
  y = 20,
  todos,
  root = false
}) {
  const [todoOpen, setTodoOpen] = useState6(false);
  const [removed, setRemoved] = useState6(false);
  const [deleting, setDeleting] = useState6(false);
  const pathname = usePathname2();
  const { register, remove } = useDevPin();
  const [checked, setChecked] = useLocalStorage_default(
    `dev-pin-${id}`,
    {}
  );
  const toggleCheck = (todo) => {
    setChecked((prev) => __spreadProps(__spreadValues({}, prev), {
      [todo]: !prev[todo]
    }));
  };
  useEffect3(() => {
    register({
      id,
      x,
      y,
      url: pathname,
      todos
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
        body: JSON.stringify({ id, relativePath, run: true })
      });
      const data = await res.json();
      console.log("\u{1F5D1}\uFE0F DevPin \uC0AD\uC81C \uC694\uCCAD:", data);
      setRemoved(true);
      remove(id);
    } catch (err) {
      console.error("\u274C \uC0AD\uC81C \uC2E4\uD328", err);
    } finally {
      setDeleting(false);
    }
  };
  if (removed) return null;
  if (root && pathname !== "/") return null;
  return /* @__PURE__ */ jsx5(
    "div",
    {
      className: "devpin-container",
      style: { top: y, left: x },
      onMouseEnter: () => setTodoOpen(true),
      onMouseLeave: () => setTodoOpen(false),
      children: todoOpen ? /* @__PURE__ */ jsxs5(Fragment2, { children: [
        /* @__PURE__ */ jsxs5("div", { className: "devpin-header", children: [
          /* @__PURE__ */ jsx5("p", { className: "devpin-title", children: name }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              type: "button",
              onClick: handleDelete,
              disabled: deleting,
              className: "devpin-delete-btn",
              title: "\uC774 DevPin \uC0AD\uC81C",
              children: deleting ? "\uC0AD\uC81C\uC911\u2026" : "\uC0AD\uC81C"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "devpin-body", children: [
          /* @__PURE__ */ jsx5("h2", { className: "devpin-section-title", children: "Dev Issue" }),
          description && /* @__PURE__ */ jsx5("p", { className: "devpin-description", children: description }),
          /* @__PURE__ */ jsx5("h3", { className: "devpin-section-title", children: "Todo" }),
          /* @__PURE__ */ jsx5("ul", { className: "devpin-todo-list", children: todos.map((todo) => /* @__PURE__ */ jsxs5("li", { className: "devpin-todo-item", children: [
            /* @__PURE__ */ jsx5(
              "input",
              {
                type: "checkbox",
                checked: !!checked[todo],
                onChange: () => toggleCheck(todo)
              }
            ),
            /* @__PURE__ */ jsx5("span", { className: checked[todo] ? "checked" : "", children: todo })
          ] }, todo)) })
        ] })
      ] }) : /* @__PURE__ */ jsx5("div", { className: "devpin-avatar-wrapper", children: /* @__PURE__ */ jsxs5("div", { className: "devpin-avatar", children: [
        /* @__PURE__ */ jsx5(
          "img",
          {
            src: profileImg || "https://api.dicebear.com/7.x/notionists/png?size=40",
            alt: name || "\uD504\uB85C\uD544 \uC774\uBBF8\uC9C0",
            width: 20,
            height: 20,
            className: "avatar-img"
          }
        ),
        /* @__PURE__ */ jsx5("div", { className: "devpin-pointer" })
      ] }) })
    }
  );
}
var dev_pin_default = DevPin;
export {
  dev_pin_default as DevPin,
  DevPinProvider
};
