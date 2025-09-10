"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

import DevPinTracker from "../ui/dev-pin-tracker";
import DevPinGlobalClient from "../ui/dev-pin-global-client";

type TodoItem = {
  id: string;
  x: number;
  y: number;
  url: string;
  todos: string[];
};

type DevPinContextType = {
  todos: TodoItem[];
  register: (item: TodoItem) => void;
  remove: (id: string) => void;
};

const DevPinContext = createContext<DevPinContextType | undefined>(undefined);

export function DevPinProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const register = useCallback((item: TodoItem) => {
    setTodos((prev) => {
      const exists = prev.find((t) => t.id === item.id);
      if (exists) {
        return prev.map((t) => (t.id === item.id ? item : t));
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ todos, register, remove }),
    [todos, register, remove]
  );

  return (
    <DevPinContext.Provider value={value}>
      {process.env.NEXT_PUBLIC_DEV_PIN_ENV === "development" && (
        <>
          <DevPinTracker />
          <DevPinGlobalClient />
        </>
      )}
      {children}
    </DevPinContext.Provider>
  );
}

export function useDevPin() {
  const context = useContext(DevPinContext);
  if (!context) {
    throw new Error("useDevPin must be used within DevPinProvider");
  }
  return context;
}
