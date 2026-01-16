import React from "react";
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <p className="text-sm sm:text-base font-medium text-gray-800">
          {title}
        </p>
        <ScoreBadge score={score} />
      </div>

      <p className="text-base sm:text-lg font-semibold">
        <span className={textColor}>{score}</span>
        <span className="text-gray-400 text-sm"> / 100</span>
      </p>
    </div>
  );
};


const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <ScoreGauge score={feedback.overallScore} />

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Your Resume Score
          </h2>
          <p className="text-sm text-gray-500 max-w-md">
            This score is calculated based on the categories listed below
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </div>
  );
};


export default Summary;
