import { type FormEvent, useEffect, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import type { Route } from '../+types/root';

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
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated)
          navigate(`/auth?next=/upload`);
      }, [auth.isAuthenticated, isLoading]);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({
        companyName,
        jobTitle,
        jobDescription,
        file,
    }: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File
    }) => {
        setIsProcessing(true);

        setStatusText('Uploading your resume…');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Oops! Failed to upload the resume.');

        setStatusText('Converting your resume to preview image…');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Oops! Failed to generate preview image.');

        setStatusText('Uploading preview image…');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Oops! Failed to upload preview image.');

        setStatusText('Saving your resume data…');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',
        };
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing your resume with AI…');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        );
        if (!feedback) return setStatusText('Oops! AI analysis failed.');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysis complete! Redirecting you…');
        console.log(data);
        navigate(`/resume/${uuid}`);
    };


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading">
                    <h1>Upgrade Your Resume, Unlock Opportunities</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button type="submit" className="
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
        ">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload