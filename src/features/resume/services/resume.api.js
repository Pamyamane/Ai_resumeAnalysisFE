import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-resume-analysis-be.vercel.app/api",
  withCredentials: true,
});

export const analyzeResume = async ({ resume, jobDescription, targetRole }) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jobDescription", jobDescription);
  formData.append("targetRole", targetRole || "");

  const response = await api.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getResumeAnalyses = async () => {
  const response = await api.get("/resume/analyses");
  return response.data;
};

export const downloadAtsResume = async (analysisId) => {
  if (!analysisId) {
    throw new Error("Analyze a resume before downloading the PDF.");
  }

  const response = await api.get(`/resume/analyses/${analysisId}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `ats-resume-${analysisId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
