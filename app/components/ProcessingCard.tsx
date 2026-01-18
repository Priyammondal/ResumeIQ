import React from "react";

const STEPS = [
  { label: "Uploading resume", color: "from-sky-500 to-blue-600" },
  { label: "Generating preview", color: "from-purple-500 to-fuchsia-500" },
  { label: "Uploading preview", color: "from-indigo-500 to-purple-600" },
  { label: "Saving data", color: "from-violet-500 to-indigo-600" },
  { label: "AI analyzing", color: "from-fuchsia-500 to-pink-500" },
  { label: "Finalizing", color: "from-emerald-500 to-green-500" },
];

const ProcessingCard = ({ currentStep }: { currentStep: number }) => {
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const activeStep = STEPS[currentStep];

  return (
    <div className="mt-12 w-full max-w-md mx-auto rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl p-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${activeStep.color} shadow-md animate-softGlow`}
        >
          {activeStep.label}
        </div>

        <p className="text-xs text-gray-500 tracking-wide">
          ResumeIQ AI is working behind the scenes
        </p>
      </div>

      {/* Progress */}
      <div className="mt-8 space-y-2">
        <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${activeStep.color} transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          />
          {/* Shimmer */}
          <div className="absolute inset-0 animate-progressShimmer opacity-40" />
        </div>

        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Visual */}
      <div className="mt-8 relative overflow-hidden rounded-2xl">
        <img
          src="/images/resume-scan.gif"
          alt="AI analyzing resume"
          className="w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 via-cyan-400/10 to-transparent" />
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-center text-gray-400">
        This usually completes in under 60 seconds
      </p>
    </div>
  );
};

export default ProcessingCard;
