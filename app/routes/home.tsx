import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RESUMIND" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const loadResumes = async () => {
      // If user is not logged in, don't try to load resumes
      if (!auth.isAuthenticated) {
        setResumes([]);
        setLoadingResumes(false);
        return;
      }

      setLoadingResumes(true);

      try {
        const resumes = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
        setResumes(parsedResumes || []);
      } catch (err) {
        console.error("Error loading resumes:", err);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [auth.isAuthenticated, refreshToken]);


  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        {/* HERO */}
        <div className="page-heading">
          <h1>
            AI-Powered Resume <br /> Feedback & Tracking
          </h1>

          {!loadingResumes && resumes.length === 0 ? (
            <h2>
              Upload your resume and get instant insights to improve your chances.
            </h2>
          ) : (
            <h2>
              Review your submissions and track AI feedback over time.
            </h2>
          )}
        </div>

        {/* Upload Button - Mobile Only */}
        {!loadingResumes && resumes.length > 0 && <Link
          to="/upload"
          className="
    inline-flex sm:hidden
    items-center justify-center gap-2
    rounded-full
    bg-gradient-to-r from-purple-500 to-cyan-400
    px-5 py-2.5
    text-sm
    font-semibold
    text-white
    shadow-md
    transition-all
    hover:scale-105 hover:shadow-xl
  "
        >
          Upload Resume
        </Link>}


        {/* LOADING */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center mt-16 animate-fadeIn">
            <img
              src="/images/resume-scan-2.gif"
              alt="Analyzing resume"
              className="w-[220px]"
            />
          </div>
        )}

        {/* RESUME GRID */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section mt-10">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={() => setRefreshToken(prev => prev + 1)} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="relative mt-10 w-full max-w-xl">
            {/* Glow border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 via-cyan-400/30 to-indigo-500/30 blur-xl opacity-70" />

            {/* Card */}
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 p-10 text-center flex flex-col gap-5 shadow-xl">

              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0 1.105-1.567 2-3.5 2S5 12.105 5 11s1.567-2 3.5-2S12 9.895 12 11zm0 0v2m0 4h.01M12 5h.01M19 11c0 1.105-1.567 2-3.5 2S12 12.105 12 11s1.567-2 3.5-2S19 9.895 19 11zm0 0v2"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-dark-900">
                No resumes yet
              </h3>

              {/* Description */}
              <p className="text-dark-300 leading-relaxed">
                Upload your resume to receive <span className="font-medium text-dark-500">AI-powered scoring</span>,
                strengths, and personalized improvement suggestions.
              </p>

              {/* CTA */}
              <Link
                to="/upload"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Upload Your First Resume
                <span className="text-xl">🚀</span>
              </Link>
            </div>
          </div>

        )}
      </section>
    </main>
  );
}
