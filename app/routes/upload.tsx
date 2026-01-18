import { type FormEvent, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import type { Route } from "../+types/root";
import ProcessingCard from "~/components/ProcessingCard";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Upload Resume – Get Instant AI Feedback | ResumeIQ",
    },
    {
      name: "description",
      content:
        "Upload your resume to ResumeIQ and receive instant AI-powered scoring, ATS insights, and personalized improvement tips in seconds.",
    },
  ];
}

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/upload`);
  }, [auth.isAuthenticated, isLoading]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const fail = (message: string) => {
    setError(message);
    setIsProcessing(false);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setError(null);
      setIsProcessing(true);

      setCurrentStep(0);
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile)
        return fail("Failed to upload resume. Please try again.");

      setCurrentStep(1);
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) return fail("Failed to generate resume preview.");

      setCurrentStep(2);
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) return fail("Failed to upload preview image.");

      setCurrentStep(3);
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setCurrentStep(4);
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription }),
      );
      if (!feedback) return fail("AI analysis failed. Please retry.");

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setCurrentStep(5);
      navigate(`/resume/${uuid}`);
    } catch (err) {
      console.error(err);
      fail("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file || !(file instanceof File)) {
      alert("Please upload a PDF from your device");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          <h1>Upgrade Your Resume, Unlock Opportunities</h1>
          {isProcessing && !error && (
            <ProcessingCard currentStep={currentStep} />
          )}

          {error && (
            <div className="mt-8 max-w-md mx-auto rounded-2xl bg-red-50 border border-red-200 p-6 text-center shadow-lg animate-fadeIn">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="font-semibold text-red-700 mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-red-600 mb-4">{error}</p>

              <button
                onClick={() => {
                  setError(null);
                  setIsProcessing(false);
                }}
                className="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-6"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                type="submit"
                className="
          inline-flex items-center justify-center gap-2
          rounded-full
          bg-gradient-to-r from-purple-500 to-cyan-400
          px-5 py-2.5
          sm:px-8 sm:py-3
          text-sm sm:text-lg
          font-semibold
          text-white
          shadow-md sm:shadow-lg
          transition-all
          hover:scale-101 hover:shadow-xl w-full cursor-pointer
        "
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
export default Upload;
