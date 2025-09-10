# 📌 next-dev-pin

A lightweight **Next.js (App Router)** development tool that lets you create and track in-app **todo pins** directly during development.

[![npm version](https://img.shields.io/npm/v/next-dev-pin.svg?style=flat&color=blue)](https://www.npmjs.com/package/next-dev-pin)  
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **Alt + Click** anywhere on the screen to open a todo creation popup.
- Write down:
  - **Assignee** (who is responsible)
  - **Issue description**
  - **Todo list items**
- Delete todos anytime with one click.
- Includes a **page-aware issue tracker** to see all todos grouped by route.
- ⚡ **Zero cost in production** — components are tree-shaken and removed from your deployed app.

---

## 📦 Installation

```bash
npm install next-dev-pin
```

---

## ⚙️ Setup

### 1. Initialize once

Run in your project root:

```bash
npx next-dev-pin init
```

### 2. Import styles

Add this to your `globals.css` or directly in `layout.tsx`:

```ts
import "next-dev-pin/dist/index.css";
```

### 3. Wrap your app

Add the provider in `layout.tsx`:

```tsx
import { DevPinProvider } from "next-dev-pin";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DevPinProvider>{children}</DevPinProvider>
      </body>
    </html>
  );
}
```

---

## 📋 Usage

- During development, **Alt + Click** anywhere on the screen to create a todo pin.
- Add assignee, description, and list of todos.
- Check off or delete todos anytime.
- Use the floating Issue Tracker panel to view all todos grouped by page/route.

---

## 🚀 Production

`next-dev-pin` is only active when:

```bash
process.env.NEXT_PUBLIC_DEV_PIN_ENV === "development"
```

In production, all components are **tree-shaken** and will not affect your bundle size.
