import { cn } from '../lib/utils';
import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionHeader,
} from './Accordion';
import ScoreBadge from "~/components/ScoreBadge";

const scoreBadge = ({score}: {score: number}) => {
    return (
        <div className={cn(
            "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
            score > 70 ? "bg-badge-green" : score > 49 ? "bg-badge-yellow" : "bg-badge-red"
        )}>
            <img src={score > 70 ? "/icons/check.svg" : "/icons/warning.svg"}  alt="badge icon" className="size-4"/>
            <p className={cn(
                "text-sm font-medium",
                score > 70 ? "text-badge-green-text" : score > 49 ? "text-badge-yellow-text" : "text-badge-red-text"
            )}>
                {score/100}
            </p>
        </div>
    )
}

const CategoryHeader = ({title, score}: {title: string, score: number}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
          <p className="text-2xl font-semibold">{title}</p>
          <ScoreBadge score={score} />
      </div>
  )
};

const CategoryContent = ({tips}: {tips: {type: "good" | "improve"; tip: string, explanation: string}[]}) => {
    return (
        <div className="flex flex-col gap-4 items-center w-full">
            <div className="bg-gray-50 w-full px-5 py-4 grid grid-cols-2 gap-4 rounded-lg">
                {
                    tips.map((tip, index) => (
                        <div className="flex flex-row gap-2 items-center" key={index}>
                            <img src={tip.type === "good" ? '/icons/check.svg' : '/icons/warning.svg'}  alt="score" className="size-5" />
                            <p className="text-xl text-gray-500">{tip.tip}</p>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-col gap-4 w-full">
                {
                    tips.map((tip, index) => (
                        <div key={index + tip.tip} className={cn(
                            "flex flex-col gap-2 rounded-2xl p-4",
                            tip.type === "good" ? "bg-green-50 border border-green-200 text-green-700" :
                                "bg-yellow-50 border border-yellow-200 text-yellow-700"
                        )}>
                            <div className="flex flex-row gap-2 items-center">
                                <img src={tip.type === "good" ? '/icons/check.svg' : '/icons/warning.svg'} className="size-5" alt="score" />
                                <p className="text-xl font-semibold">{tip.tip}</p>
                            </div>
                            <p>{tip.explanation}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const Details = ({feedback}:{feedback:Feedback}) => {
    return (
        <div className="flx flex-col gap-4 w-full">
            <Accordion>
                <AccordionItem id="tone-style">
                    <AccordionHeader itemId="tone-style">
                        <CategoryHeader title="Tone & Style" score={feedback.toneAndStyle.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="tone-style">
                        <CategoryContent tips={feedback.toneAndStyle.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="content">
                    <AccordionHeader itemId="content">
                        <CategoryHeader title="Content" score={feedback.content.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="content">
                        <CategoryContent tips={feedback.content.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="structure">
                    <AccordionHeader itemId="structure">
                        <CategoryHeader title="Structure" score={feedback.structure.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="structure">
                        <CategoryContent tips={feedback.content.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="skills">
                    <AccordionHeader itemId="skills">
                        <CategoryHeader title="Skills" score={feedback.skills.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="skills">
                        <CategoryContent tips={feedback.content.tips} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Details;