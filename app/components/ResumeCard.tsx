import {Link} from "react-router";
import ScoreCircle from "~/components/scoreCircle";

const ResumeCard = ({resume: {jobTitle, companyName, feedback, id, imagePath}} : {resume : Resume}) => {
    return (
        <Link to={`/resume/${id}`}>
            <div className="resume-card animate-in fade-in duration-1000">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        <h2 className="!text-black font-bold break-words">{companyName}</h2>
                        <h3 className="text-lg text-gray-500 break-words">{jobTitle}</h3>
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={imagePath}
                            alt="resume"
                            className="object-cover w-full h-[350px] max-sm:h-[200px] object-top"/>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;