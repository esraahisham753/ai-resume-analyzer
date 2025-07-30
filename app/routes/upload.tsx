import Navbar from "~/components/Navbar";
import {type FormEvent, useState} from "react";
import FileUploader from "~/components/FileUploader";

const upload = () => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');

        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        console.log({
            companyName, jobTitle, jobDescription, file
        });
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
                                <h2>Analyzing your resume...</h2>
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