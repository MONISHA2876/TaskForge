<div align="center">

<img src="https://placehold.co/1200x280/0f172a/ffffff?text=TaskForge&font=raleway" alt="TaskForge banner" width="100%" />

## Your AI-Powered Productivity Companion

**Plan smarter. Track better. Stay focused.** TaskForge blends a beautiful, animated UI with Gemini AI to help you turn goals into actionable, personalized plans.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

<br />

<!-- 🔗 TODO: Replace the # below with your actual deployed app URL -->

[**🌐 Live Demo**](#) &nbsp;•&nbsp; [**🎥 Demo Video**](#-demo-video) &nbsp;•&nbsp; [**✨ Features**](#-features) &nbsp;•&nbsp; [**⚡ Quick Start**](#-getting-started) &nbsp;•&nbsp; [**🐛 Report a Bug**](../../issues)

</div>

<br />

---

## 🎥 Demo Video

<div align="center">

<a href="#">
  <img src="https://placehold.co/900x500/1e1b4b/ffffff?text=%E2%96%B6%EF%B8%8F+Full+Demo+Video+Coming+Soon" alt="TaskForge demo video placeholder" width="80%" />
</a>

</div>

---

## 🌐 Live Demo

<div align="center">

[![Live Demo](https://img.shields.io/badge/🔗_Live_App-Coming_Soon-6366F1?style=for-the-badge)](#)

</div>

---

## ✨ Features

TaskForge packs a focused set of features, each with a quick preview below — GIFs are placeholders for now and will be swapped with real walkthroughs.

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Email & Password Authentication</h3>
      <p>Secure, classic sign-up and login flow backed by Firebase Authentication, with validation and friendly error handling baked in.</p>
      <img src="@file:Authentication.gif" alt="Email and password authentication demo" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>🤖 AI-Powered Planning Flows</h3>
      <p>Gemini AI (<code>@google/generative-ai</code>) generates personalized, context-aware plans tailored to each user's goals.</p>
      <img src="@file:AI_Planner.gif" alt="AI-powered planning demo" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎨 Modern, Animated UI</h3>
      <p>A responsive interface styled with Tailwind CSS and brought to life with smooth Framer Motion animations and transitions.</p>
      <img src="@file:UI.gif" alt="Modern animated UI demo" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>📊 Authenticated Dashboard</h3>
      <p>Signed-in users land on a dynamic, personalized dashboard for tracking plans and progress at a glance.</p>
      <img src="@file:UI.gif" alt="Authenticated dashboard demo" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🧠 AI Help</h3>
      <p>On-demand AI assistance helps users stay on track, answer planning questions, and fine-tune their task strategy instantly.</p>
      <img src="@AI_Help.gif" alt="AI Help demo" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>🏠 Guest Landing Page</h3>
      <p>Signed-out visitors are greeted with an immersive, conversion-focused landing experience designed to showcase TaskForge at its best.</p>
      <img src="@file:Landing_Page.gif" alt="Guest landing page demo" width="100%" />
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Layer           | Technology                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org/)                                                                                                     |
| UI Library      | [React](https://react.dev/)                                                                                                        |
| Language        | [TypeScript](https://www.typescriptlang.org/)                                                                                      |
| Styling         | [Tailwind CSS](https://tailwindcss.com/)                                                                                           |
| Animation       | [Framer Motion](https://www.framer.com/motion/)                                                                                    |
| Auth & Database | [Firebase Authentication](https://firebase.google.com/products/auth) & [Firestore](https://firebase.google.com/products/firestore) |
| AI              | [Gemini AI](https://ai.google.dev/)                                                                                                |
| Icons           | [Lucide React](https://lucide.dev/)                                                                                                |

---

## 📁 Project Structure

```
taskforge/
├── app/          # Next.js app routes and pages
├── components/   # React UI components
├── lib/          # Firebase initialization and auth context
├── public/       # Static assets
└── types/        # TypeScript types
```

---

## ⚡ Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/taskforge.git
cd taskforge
npm install
```

### 2️⃣ Configure Environment Variables

Create a `.env.local` file in the project root — see the [Environment Variables](#-environment-variables) section below for the full list.

### 3️⃣ Enable Firebase Authentication Providers

In your [Firebase Console](https://console.firebase.google.com/), enable:

- ✅ Email/Password
- ✅ Google
- ✅ GitHub

### 4️⃣ Add Authorized Domains

In **Firebase Console → Authentication → Settings → Authorized domains**, add:

- Your production app domain
- `localhost` (for local development)

### 5️⃣ Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see TaskForge in action. 🎉

---

## 🔑 Environment Variables

| Variable                                   | Description                                     |
| ------------------------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase project API key                        |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain                            |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID                             |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket                         |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                    |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID                                 |
| `GEMINI_API_KEY`                           | API key for Gemini AI (`@google/generative-ai`) |

---

## 📜 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the production app     |
| `npm run start` | Run the production server    |
| `npm run lint`  | Run ESLint                   |

---

## 📝 Notes

- `app/page.tsx` renders the authenticated dashboard (`HomePage`) when a user is signed in, otherwise it shows the guest landing page (`HomepageNew`).
- Firebase config is loaded from public environment variables in `lib/firebase.ts`.
- OAuth sign-in is implemented in `lib/auth-context.tsx` using Firebase `signInWithPopup` for Google and GitHub.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues) or open a pull request.

---

<div align="center">

Made with ❤️ and a lot of ☕ — **TaskForge**

</div>
