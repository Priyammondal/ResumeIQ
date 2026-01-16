import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { RxCross2 } from "react-icons/rx";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
  onDelete,
}: {
  resume: Resume;
  onDelete?: () => void;
}) => {
  const { fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      setResumeUrl(URL.createObjectURL(blob));
    };
    loadResume();
  }, [imagePath]);

  const handleDelete = async (e: React.MouseEvent) => {
    console.log("hey-->", kv)
    e.preventDefault();
    e.stopPropagation();
    if (!kv) return;

    try {
      console.log("heyyyyyy-->",`resume:${id}` )
      await kv.delete(`resume:${id}`);
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  return (
    <div className="relative group w-[350px] lg:w-[430px] xl:w-[490px]">
      {/* Delete Cross (appears only on hover) */}
      <button
        onClick={handleDelete}
        className="
    absolute top-2 right-2
    w-6 h-6 flex items-center justify-center
    text-black
    sm:opacity-0 sm:group-hover:opacity-100
    transition-all duration-300
    cursor-pointer
    z-50
    fade-in animate-in
  "
        title="Delete Resume"
      >
        <RxCross2 size={18} />
      </button>

      <Link
        to={`/resume/${id}`}
        className="
    flex flex-col gap-4
    bg-white rounded-2xl p-4
    transition-all
    sm:hover:-translate-y-1 sm:hover:shadow-xl
    animate-in fade-in duration-700
  "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="!text-black font-semibold truncate">
              {companyName || "Resume"}
            </h2>
            {jobTitle && (
              <p className="text-sm text-dark-200 truncate">{jobTitle}</p>
            )}
          </div>

          <div className="shrink-0">
            <ScoreCircle score={feedback.overallScore} />
          </div>
        </div>

        {/* PREVIEW */}
        <div className="gradient-border p-3">
          <div className="relative overflow-hidden rounded-2xl w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px]">
            {!resumeUrl && <div className="shimmer w-full h-full rounded-2xl" />}

            {resumeUrl && (
              <img
                src={resumeUrl}
                alt="resume preview"
                className="absolute inset-0 w-full h-full object-cover object-top animate-in fade-in duration-1000 group-hover:scale-105"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-black text-sm font-semibold backdrop-blur shadow-lg translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                View Resume
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ResumeCard;
