import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { usePuterStore } from "./lib/puter";
import { useEffect } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <html lang="en">
      <head>
        {/* Basic */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>ResumeIQ — AI Resume Feedback & Scoring</title>
        <meta
          name="description"
          content="ResumeIQ helps you improve your resume with AI-powered feedback, ATS scoring, strengths, and personalized suggestions — land your dream job faster."
        />

        {/* Favicon */}
        <link
          rel="icon"
          href="https://api.iconify.design/mdi:brain.svg?color=%237c3aed"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, LinkedIn, WhatsApp, Slack) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ResumeIQ" />
        <meta
          property="og:title"
          content="ResumeIQ — AI Resume Feedback & Scoring"
        />
        <meta
          property="og:description"
          content="Upload your resume and get instant AI-powered insights, ATS scores, and improvement tips tailored to your job role."
        />
        <meta property="og:image" content="https://api.iconify.design/mdi:brain.svg?color=%237c3aed" />
        <meta
          property="og:image:alt"
          content="ResumeIQ AI resume analysis dashboard preview"
        />

        <meta property="og:url" content="https://resumeeiq.netlify.app" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ResumeIQ — AI Resume Feedback" />
        <meta
          name="twitter:description"
          content="AI-powered resume review with ATS scoring and actionable improvement suggestions."
        />
        <meta name="twitter:image" content="https://api.iconify.design/mdi:brain.svg?color=%237c3aed" />

        {/* Apple Touch  */}
        <link
          rel="apple-touch-icon"
          href="https://api.iconify.design/mdi:brain.svg?color=%237c3aed"
        />

        <link rel="canonical" href="https://resumeeiq.netlify.app" />


        {/* Theme (Mobile Chrome / Android) */}
        <meta name="theme-color" content="#7C3AED" />

        <Meta />
        <Links />
      </head>

      <body>
        <script src="https://js.puter.com/v2/"></script>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
