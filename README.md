# GlowUp Beauty

A responsive cosmetics e-commerce frontend built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Lucide React icons
- Mock JSON data

## Features

- Fake authentication with localStorage persistence
- Shopping cart with localStorage persistence
- 9 pages: Splash, Login, Home, Categories, Product List, Product Detail, Cart, Checkout, Profile
- Multi-step checkout flow (address → delivery → payment → confirmation)
- Mobile-first responsive design matching the GlowUp Beauty UI designs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Login

Use any email and a password with at least 4 characters to sign in.

## Project Structure

```
src/
  components/   # Shared UI components
  contexts/     # Auth & Cart providers
  data/         # Mock JSON (products, categories, user)
  pages/        # Route pages
  types/        # TypeScript interfaces
  utils/        # Helpers (storage, formatting)
```
