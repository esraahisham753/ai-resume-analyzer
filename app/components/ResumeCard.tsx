import {Link} from "react-router";
import ScoreCircle from "~/components/scoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({resume: {jobTitle, companyName, feedback, id, imagePath}} : {resume : Resume}) => {
    const [resumeUrl, setResumeUrl ] = useState<string>("");

    const {fs} = usePuterStore();

    useEffect(() => {
        const loadResume = async() => {
            const blob = await fs.read(imagePath);

            if (!blob) return;

            const resumeUrl = URL.createObjectURL(blob);
            setResumeUrl(resumeUrl);
        };

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`}>
            <div className="resume-card animate-in fade-in duration-1000">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                        {jobTitle && <h3 className="text-lg text-gray-500 break-words">{jobTitle}</h3>}
                        {!companyName && !jobTitle && <h2>Resume</h2>}
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                <div className="gradient-border animate-in fade-in duration-1000">
                    {resumeUrl && (<div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="object-cover w-full h-[350px] max-sm:h-[200px] object-top"/>
                    </div> ) }
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;