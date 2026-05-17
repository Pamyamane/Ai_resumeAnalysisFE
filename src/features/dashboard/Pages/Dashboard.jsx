import {
  BarChart3,
  Bell,
  Bot,
  Brain,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  Home,
  Layers,
  Link,
  Lightbulb,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  Sparkles,
  Target,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../../auth/hooks/useAuth";
import { analyzeResume, downloadAtsResume } from "../../resume/services/resume.api"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analyzer", label: "Resume Analyzer", icon: FileText },
  { id: "gaps", label: "Skill Gaps", icon: Brain },
  { id: "interview", label: "Interview Questions", icon: Bot },
  { id: "ats", label: "ATS Builder", icon: WandSparkles },
  { id: "rewriter", label: "Bullet Rewriter", icon: Layers },
  { id: "linkedin", label: "LinkedIn Kit", icon: Link },
  { id: "tracker", label: "Job Tracker", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const sampleJd =
  "We are hiring a MERN Stack Developer with React, Node.js, Express, MongoDB, REST API, JWT, Git, testing, problem solving, and strong communication skills. Knowledge of generative AI and prompt engineering is a plus.";

function isSupportedResumeFile(file) {
  return ["application/pdf", "text/plain"].includes(file.type) || /\.(pdf|txt)$/i.test(file.name);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [resume, setResume] = useState(null);
  const [targetRole, setTargetRole] = useState("MERN Stack Developer");
  const [jobDescription, setJobDescription] = useState(sampleJd);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState("");
  const { User, handllogout } = useAuth();

  const displayName = User?.username || User?.name || "GenAI User";
  const displayEmail = User?.email || "user@example.com";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const current = analysis?.analysis || analysis;
  const atsResume = current?.atsResume;
  const activeNav = navItems.find((item) => item.id === activeView) || navItems[0];
  const show = (...views) => activeView === "dashboard" || views.includes(activeView);
  const matchRate =
    current?.jobSkills?.length && current?.matchedSkills
      ? Math.round((current.matchedSkills.length / current.jobSkills.length) * 100)
      : 0;

  const handleLogout = async () => {
    try {
      await handllogout();
    } finally {
      navigate("/");
    }
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setError("");

    if (loading) {
      return;
    }

    if (!resume) {
      setError("Please upload your resume as a PDF or text file.");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("Resume file must be 5MB or smaller.");
      return;
    }

    if (!isSupportedResumeFile(resume)) {
      setError("Only PDF and text resumes are supported.");
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 40) {
      setError("Please paste a complete job description with at least 40 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeResume({ resume, jobDescription, targetRole });
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeFile = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setError("");

    if (!selectedFile) {
      setResume(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setResume(null);
      setError("Resume file must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    if (!isSupportedResumeFile(selectedFile)) {
      setResume(null);
      setError("Only PDF and text resumes are supported.");
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
  };

  const handleDownloadPdf = async () => {
    setError("");
    setDownloadingPdf(true);
    try {
      await downloadAtsResume(current?._id);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "PDF download failed.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <button
        className={`dashboard-backdrop${menuOpen ? " dashboard-backdrop--open" : ""}`}
        type="button"
        aria-label="Close menu"
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`dashboard-sidebar${menuOpen ? " dashboard-sidebar--open" : ""}`}>
        <button className="dashboard-sidebar__close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <X size={20} />
        </button>

        <div className="dashboard-brand">
          <div className="dashboard-brand__mark">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="dashboard-brand__name">ResumeAI</p>
            <p className="dashboard-brand__meta">Career Studio</p>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard menu">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              className={`dashboard-nav__item${activeView === id ? " dashboard-nav__item--active" : ""}`}
              type="button"
              key={label}
              onClick={() => {
                setActiveView(id);
                setMenuOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="dashboard-sidebar__profile">
          <div className="dashboard-avatar">{initials}</div>
          <div className="dashboard-sidebar__user">
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-icon-btn dashboard-topbar__menu" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="dashboard-search">
            <Search size={17} />
            <input type="search" placeholder="Search analyses, resumes, skills" />
          </div>

          <div className="dashboard-topbar__actions">
            <button className="dashboard-icon-btn" type="button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="dashboard-profile-btn" type="button">
              <div className="dashboard-avatar dashboard-avatar--small">{initials}</div>
              <span>{displayName}</span>
              <ChevronDown size={16} />
            </button>
            <button className="dashboard-logout" type="button" onClick={handleLogout}>
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-hero resume-hero">
            <div>
              <p className="dashboard-eyebrow">{activeNav.label}</p>
              <h1>{activeView === "settings" ? "Manage your career workspace preferences." : "Analyze resumes, close skill gaps, and generate ATS-ready career assets."}</h1>
              <p>
                {activeView === "settings"
                  ? "Update profile details, target role settings, and project defaults used across ResumeAI."
                  : "Upload a resume, paste a job description, and get extracted skills, missing requirements, interview questions, and a PDF-ready optimized resume."}
              </p>
            </div>
          </section>

          {activeView === "settings" ? (
            <SettingsView
              displayName={displayName}
              displayEmail={displayEmail}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />
          ) : (
          <section className="resume-workbench">
            <form className="dashboard-card resume-form" onSubmit={handleAnalyze}>
              <div className="dashboard-card__heading">
                <div className="dashboard-card__icon">
                  <Upload size={20} />
                </div>
                <div>
                  <h2>Resume Parsing & Skill Extraction</h2>
                  <p>PDF and text resumes are supported</p>
                </div>
              </div>

              <label className="resume-upload">
                <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleResumeFile} />
                <FileText size={24} />
                <span>{resume ? resume.name : "Upload resume file"}</span>
              </label>

              <label className="resume-field">
                <span>Target role</span>
                <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="e.g. AI Engineer" />
              </label>

              <label className="resume-field">
                <span>Job description</span>
                <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={8} />
              </label>

              {error && <p className="resume-error">{error}</p>}

              <button className="dashboard-primary-btn resume-submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Analyzing
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Analyze Resume
                  </>
                )}
              </button>
            </form>

            <section className="resume-results">
              {show("analyzer", "analytics") && <div className="dashboard-stats resume-stats">
                <article className="dashboard-card dashboard-stat">
                  <span>ATS score</span>
                  <strong>{current?.atsScore ?? "--"}</strong>
                  <p>Keyword and structure match</p>
                </article>
                <article className="dashboard-card dashboard-stat">
                  <span>Matched skills</span>
                  <strong>{current?.matchedSkills?.length ?? 0}</strong>
                  <p>Found in resume</p>
                </article>
                <article className="dashboard-card dashboard-stat">
                  <span>Skill gaps</span>
                  <strong>{current?.missingSkills?.length ?? 0}</strong>
                  <p>Missing from resume</p>
                </article>
              </div>}

              {show("analytics") && <section className="dashboard-card impression-panel">
                <div className="dashboard-card__heading">
                  <div className="dashboard-card__icon dashboard-card__icon--green">
                    <Target size={20} />
                  </div>
                  <div>
                    <h2>Hiring Match Snapshot</h2>
                    <p>Recruiter-friendly summary and keyword readiness</p>
                  </div>
                </div>
                <div className="match-meter">
                  <div>
                    <strong>{matchRate}%</strong>
                    <span>job keyword match</span>
                  </div>
                  <div className="match-meter__track">
                    <span style={{ width: `${matchRate}%` }} />
                  </div>
                </div>
                <p className="recruiter-pitch">
                  {current?.recruiterPitch || "Run an analysis to generate a recruiter-ready candidate pitch."}
                </p>
                <div className="keyword-table">
                  {(current?.keywordInsights || []).slice(0, 8).map((item) => (
                    <div className="keyword-row" key={item.keyword}>
                      <span>{item.keyword}</span>
                      <strong className={item.status === "Found" ? "keyword-row__found" : "keyword-row__missing"}>
                        {item.status}
                      </strong>
                      <em>{item.priority}</em>
                    </div>
                  ))}
                  {!current?.keywordInsights?.length && <p className="resume-empty">Keyword insights will appear after analysis.</p>}
                </div>
                <div className="ats-breakdown">
                  {(current?.atsBreakdown || []).map((item) => (
                    <div className="ats-breakdown__item" key={item.label}>
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.score}%</span>
                      </div>
                      <div className="match-meter__track">
                        <span style={{ width: `${item.score}%` }} />
                      </div>
                      <p>{item.feedback}</p>
                    </div>
                  ))}
                </div>
              </section>}

              {show("analyzer", "gaps") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h2>Extracted Skills</h2>
                      <p>Skills detected from resume and JD</p>
                    </div>
                  </div>
                  <SkillCloud title="Resume" skills={current?.extractedSkills} />
                  <SkillCloud title="Job Description" skills={current?.jobSkills} />
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <Lightbulb size={20} />
                    </div>
                    <div>
                      <h2>AI Skill Gap Detection</h2>
                      <p>What to add before applying</p>
                    </div>
                  </div>
                  <SkillCloud title="Missing Skills" skills={current?.missingSkills} variant="warning" />
                  <div className="resume-list">
                    {(current?.recommendations || ["Run an analysis to see recommendations."]).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </article>
              </div>}

              {show("gaps") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <CalendarCheck size={20} />
                    </div>
                    <div>
                      <h2>Learning Roadmap</h2>
                      <p>Weekly plan to close the strongest gaps</p>
                    </div>
                  </div>
                  <div className="roadmap">
                    {(current?.learningRoadmap || []).map((item) => (
                      <div className="roadmap__item" key={`${item.week}-${item.focus}`}>
                        <span>{item.week}</span>
                        <strong>{item.focus}</strong>
                        {item.tasks.map((task) => (
                          <p key={task}>{task}</p>
                        ))}
                      </div>
                    ))}
                    {!current?.learningRoadmap?.length && <p className="resume-empty">Your personalized learning plan will appear here.</p>}
                  </div>
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <div>
                      <h2>Portfolio Projects</h2>
                      <p>Projects designed to prove missing skills</p>
                    </div>
                  </div>
                  <div className="project-ideas">
                    {(current?.projectIdeas || []).map((project) => (
                      <div className="project-idea" key={project.title}>
                        <strong>{project.title}</strong>
                        <p>{project.description}</p>
                        <SkillCloud title="Skills" skills={project.skills} />
                      </div>
                    ))}
                    {!current?.projectIdeas?.length && <p className="resume-empty">Project recommendations will appear after analysis.</p>}
                  </div>
                </article>
              </div>}

              {show("interview", "ats") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h2>Interview Questions</h2>
                      <p>Generated from the skill match and gaps</p>
                    </div>
                  </div>
                  <ol className="resume-questions">
                    {(current?.interviewQuestions || ["Upload a resume and paste a JD to generate interview questions."]).map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <WandSparkles size={20} />
                    </div>
                    <div>
                      <h2>ATS-Optimized Resume</h2>
                      <p>Structured output ready for Puppeteer PDF</p>
                    </div>
                  </div>
                  {atsResume ? (
                    <div className="ats-preview">
                      <h3>{atsResume.name}</h3>
                      <span>{atsResume.title}</span>
                      <p>{atsResume.summary}</p>
                      <SkillCloud title="ATS Keywords" skills={atsResume.skills} />
                      <button className="dashboard-logout" type="button" onClick={handleDownloadPdf} disabled={downloadingPdf}>
                        <Download size={17} />
                        <span>{downloadingPdf ? "Preparing" : "Download PDF"}</span>
                      </button>
                    </div>
                  ) : (
                    <p className="resume-empty">Your optimized resume preview will appear here after analysis.</p>
                  )}
                </article>
              </div>}

              {show("interview", "ats") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2>AI Cover Letter</h2>
                      <p>Tailored to the uploaded resume and job description</p>
                    </div>
                  </div>
                  <pre className="cover-letter">
                    {current?.coverLetter || "Run an analysis to generate a role-specific cover letter."}
                  </pre>
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <h2>Application Checklist</h2>
                      <p>Final actions before sending the application</p>
                    </div>
                  </div>
                  <div className="checklist">
                    {(current?.applicationChecklist || ["Run an analysis to create your application checklist."]).map((item) => (
                      <p key={item}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </article>
              </div>}

              {show("rewriter", "analytics") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2>Bullet Rewriter</h2>
                      <p>Transforms weak bullets into ATS-ready impact statements</p>
                    </div>
                  </div>
                  <div className="rewrite-list">
                    {(current?.bulletRewrites || []).map((item) => (
                      <div className="rewrite-card" key={item.original}>
                        <span>Before</span>
                        <p>{item.original}</p>
                        <span>After</span>
                        <strong>{item.optimized}</strong>
                      </div>
                    ))}
                    {!current?.bulletRewrites?.length && <p className="resume-empty">Run an analysis to generate optimized resume bullets.</p>}
                  </div>
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <Target size={20} />
                    </div>
                    <div>
                      <h2>Semantic Evidence Check</h2>
                      <p>Shows whether skills are proven, not only mentioned</p>
                    </div>
                  </div>
                  <div className="semantic-list">
                    {(current?.semanticMatches || []).map((item) => (
                      <div className="semantic-row" key={`${item.requirement}-${item.strength}`}>
                        <strong>{item.requirement}</strong>
                        <span>{item.strength}</span>
                        <p>{item.evidence}</p>
                      </div>
                    ))}
                    {!current?.semanticMatches?.length && <p className="resume-empty">Semantic evidence checks appear after analysis.</p>}
                  </div>
                </article>
              </div>}

              {show("linkedin") && <div className="dashboard-grid resume-grid">
                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon dashboard-card__icon--green">
                      <Link size={20} />
                    </div>
                    <div>
                      <h2>LinkedIn Optimization Kit</h2>
                      <p>Headline, About section, and Featured ideas</p>
                    </div>
                  </div>
                  <div className="linkedin-kit">
                    <span>Headline</span>
                    <strong>{current?.linkedinProfile?.headline || "Run an analysis to generate a LinkedIn headline."}</strong>
                    <span>About</span>
                    <p>{current?.linkedinProfile?.about || "Your LinkedIn About section will appear here."}</p>
                    <span>Featured</span>
                    <div className="checklist">
                      {(current?.linkedinProfile?.featuredItems || ["Analyze your resume to get featured project ideas."]).map((item) => (
                        <p key={item}>
                          <CheckCircle2 size={16} />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card__heading">
                    <div className="dashboard-card__icon">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h2>Cold Outreach Email</h2>
                      <p>Use it for recruiters, referrals, or hiring teams</p>
                    </div>
                  </div>
                  <pre className="cover-letter">{current?.coldEmail || "Run an analysis to generate a recruiter outreach email."}</pre>
                </article>
              </div>}

              {show("tracker") && <section className="dashboard-card">
                <div className="dashboard-card__heading">
                  <div className="dashboard-card__icon dashboard-card__icon--green">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h2>Application Tracker</h2>
                    <p>Turns analysis results into next actions</p>
                  </div>
                </div>
                <div className="tracker-board">
                  {(current?.applicationTracker || []).map((item) => (
                    <div className="tracker-card" key={item.stage}>
                      <span>{item.stage}</span>
                      <strong>{item.status}</strong>
                      <p>{item.nextAction}</p>
                    </div>
                  ))}
                  {!current?.applicationTracker?.length && <p className="resume-empty">Run an analysis to generate a job application plan.</p>}
                </div>
              </section>}
            </section>
          </section>
          )}
        </div>
      </section>
    </main>
  );
}

function SkillCloud({ title, skills = [], variant = "default" }) {
  return (
    <div className="skill-cloud">
      <p>{title}</p>
      <div>
        {skills.length ? (
          skills.map((skill) => (
            <span className={`skill-pill skill-pill--${variant}`} key={`${title}-${skill}`}>
              {skill}
            </span>
          ))
        ) : (
          <span className="skill-pill">No skills yet</span>
        )}
      </div>
    </div>
  );
}

function SettingsView({ displayName, displayEmail, targetRole, setTargetRole, jobDescription, setJobDescription }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoPdf, setAutoPdf] = useState(false);
  const [strictAts, setStrictAts] = useState(true);

  return (
    <section className="settings-grid">
      <article className="dashboard-card settings-panel">
        <div className="dashboard-card__heading">
          <div className="dashboard-card__icon dashboard-card__icon--green">
            <Settings size={20} />
          </div>
          <div>
            <h2>User Profile</h2>
            <p>Account details used in your workspace</p>
          </div>
        </div>

        <div className="settings-profile">
          <div className="dashboard-avatar">{displayName.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>
        </div>

        <label className="resume-field">
          <span>Default target role</span>
          <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
        </label>

        <label className="resume-field">
          <span>Default job description</span>
          <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={7} />
        </label>
      </article>

      <article className="dashboard-card settings-panel">
        <div className="dashboard-card__heading">
          <div className="dashboard-card__icon">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h2>Analyzer Preferences</h2>
            <p>Controls for resume scoring and output</p>
          </div>
        </div>

        <ToggleRow label="Email me analysis summaries" checked={emailAlerts} onChange={setEmailAlerts} />
        <ToggleRow label="Auto-generate ATS PDF after analysis" checked={autoPdf} onChange={setAutoPdf} />
        <ToggleRow label="Use strict ATS keyword matching" checked={strictAts} onChange={setStrictAts} />

        <div className="settings-note">
          <strong>Workspace status</strong>
          <p>Your preferences are active for this session and connected to the analyzer form.</p>
        </div>
      </article>
    </section>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <strong>{checked ? "On" : "Off"}</strong>
    </label>
  );
}
