import Navbar from "~/components/Navbar";
import {type FormEvent, useState} from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import {useNavigate} from "react-router";

const upload = () => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const {auth, isLoading, fs, kv, ai} = usePuterStore();
    const navigate = useNavigate();

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setIsProcessing(true);
        setStatus("Uploading your resume...");
        const uploadedFile = await fs.upload([file]);

        if (!uploadedFile) return setStatus("Error: failed to upload the file");

        setStatus("Converting the pdf to image..");
        const imageFile = await convertPdfToImage(file);

        if (!imageFile.file) return setStatus("Error: Failed to convert the file to an image");

        setStatus("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);

        if (!uploadedImage) return setStatus("Error: Failed to upload the image");

        setStatus("Preparing data...");

        const resumeId = generateUUID();

        const data = {
            id: resumeId,
            companyName,
            jobTitle,
            jobDescription,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            feedback: ''
        };

        await kv.set(`resume:${resumeId}`, JSON.stringify(data));
        setStatus("Analyzing Resume...");
        const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({jobTitle, jobDescription}));

        if(!feedback) return setStatus("Error: Failed to Analyze Resume.");

        const feedbackText = typeof feedback.message.content === "string" ?
            feedback.message.content :
            feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${resumeId}`, JSON.stringify(data));
        setStatus("Resume analyzed successfully. Redirecting...");
        console.log(data);
        navigate(`/resume/${resumeId}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');

        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string; 

        if (!file) return;

        handleAnalyze({companyName, jobTitle, jobDescription, file});
    }

    return (
        <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {
                        isProcessing ? (
                            <>
                                <h2>{status}</h2>
                                <img src="/images/resume-scan.gif" alt="Scaning resume gif" className="w-full"/>
                            </>
                        ) : (
                            <h2>Drop your resume for an ATS score & smart improvements tips</h2>
                        )
                    }
                    {
                        !isProcessing && (
                            <form id="upload-form" className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name:</label>
                                    <input id="company-name" type="text" name="company-name" placeholder="Company Name"/>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title:</label>
                                    <input id="job-title" type="text" name="job-title" placeholder="Job Title"/>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description:</label>
                                    <textarea rows={5} id="job-description" name="job-description" placeholder="Job Description"></textarea>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelected={handleFileSelect} />
                                </div>
                                <button type="submit" className="primary-button">Analyze Resume</button>
                            </form>
                        )
                    }
                </div>
            </section>
        </main>
    );
};

export default upload;