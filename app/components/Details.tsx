import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        `
        flex items-center
        gap-1 sm:gap-1.5
        px-2 sm:px-2.5
        py-0.5
        rounded-full
        w-fit
        `,
        score > 69
          ? "bg-badge-green"
          : score > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-3 sm:size-4"
      />

      <p
        className={cn(
          `
          text-xs sm:text-sm
          font-medium
          whitespace-nowrap
          `,
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div
      className="
        flex flex-col gap-2
        sm:flex-row sm:items-center sm:gap-4
        py-2
      "
    >
      <p className="text-lg sm:text-2xl font-semibold">
        {title}
      </p>

      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Quick tips */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-2 items-start">
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              className="size-4 mt-0.5"
            />
            <p className="text-sm sm:text-base text-gray-600">
              {tip.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed explanations */}
      <div className="flex flex-col gap-3">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "rounded-xl p-4 flex flex-col gap-2 text-sm sm:text-base",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex items-center gap-2">
              <img
                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                className="size-4"
              />
              <p className="font-semibold">{tip.tip}</p>
            </div>
            <p className="leading-relaxed">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
