import {Link, useNavigate, useParams} from "react-router";
import {use, useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import {resumes} from "../../constants";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = [
    {title: "Resumind | Review"},
    {name: "description", content: "A detailed review of your resume"}
];

const Resume = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState<string | null>("");
    const [resumeUrl, setResumeUrl] = useState<string | null>("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();
    const  {auth, isLoading, kv, fs} = usePuterStore();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
            const data = await kv.get(`resume:${id}`);

            if (!data) return;

            const jsonData = JSON.parse(data);

            const resumeBlob = await fs.read(jsonData.resumePath);

            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(jsonData.imagePath);

            if (!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            if (!jsonData.feedback) return;
            setFeedback(jsonData.feedback);

            console.log({resumeUrl, imageUrl, feedback: jsonData.feedback});
        }

        loadResume();
    }, [id])

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back To Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] justify-center items-center sticky top-0">
                    {
                        imageUrl && resumeUrl && (
                            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={imageUrl} className="w-full h-full object-contain rounded-2xl" title="resume image" alt="resume image" />
                                </a>
                            </div>
                        )
                    }
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {
                        feedback ? (
                            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                <Details feedback={feedback}/>
                            </div>
                        ) : (
                            <img src="/images/resume-scan-2.gif" alt="scanning" className="w-full"/>
                        )
                    }
                </section>
            </div>
        </main>
    );
};

export default Resume;