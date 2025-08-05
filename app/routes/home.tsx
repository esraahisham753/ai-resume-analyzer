import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import Resume from "~/routes/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadResumes = async () => {
            setLoading(true);
            const resumes = (await kv.list("resume:*", true)) as KVItem[];
            const parsedResumes = resumes?.map(resume => {
                return JSON.parse(resume.value) as Resume;
            });
            setResumes(parsedResumes || []);
            setLoading(false);
            console.log(parsedResumes);
        }

        loadResumes();
    }, []);

    useEffect(() => {
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated])

  return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
            {!loading && resumes?.length == 0 && <h2>No resumes found. Upload your first resume</h2>}
            {!loading && resumes?.length > 0 && <h2>Review your submissions and check AI-powered feedback.</h2>}
        </div>
          { loading && <div className="flex flex-col items-center">
              <img src="/images/resume-scan-2.gif" alt="Loading resumes" />
          </div> }
      { resumes.length > 0 && (
          <div className="resumes-section">
              { resumes.map(resume => (
                  <ResumeCard key={resume.id} resume={resume}/>
              )) }
          </div>
      ) }
          {
              !loading && resumes.length === 0 && (
                  <div className="flex flex-col items-center justify-center mt-10 gap-4">
                      <Link to="/upload" className="primaryButton w-fit text-xl font-semibold">
                          Upload
                      </Link>
                  </div>
              )
          }
      </section>
  </main>
}
