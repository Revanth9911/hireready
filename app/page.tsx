"use client";

import { useState } from "react";

export default function Home() {
  const [score, setScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState("");

  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jd", jd);

    setLoading(true);

    const res = await fetch("/api/ats", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setScore(data.score);
    setVerdict(data.verdict);
    setMissing(data.missing);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">HireReady</h1>

      <p className="mt-4 text-gray-400 max-w-xl">
        Estimate how likely your resume is to pass ATS filters and reach recruiters.
      </p>

      {/* Job Description */}
      <textarea
        placeholder="Paste job description (recommended)"
        rows={4}
        className="mt-6 w-full max-w-xl p-3 rounded bg-gray-900 text-sm"
        onChange={(e) => setJd(e.target.value)}
      />

      {/* Resume Upload */}
      <input
        type="file"
        accept=".docx"
        onChange={handleUpload}
        className="mt-4"
      />

      <p className="mt-2 text-xs text-gray-500">
        DOCX recommended • ATS systems prefer DOCX resumes
      </p>

      {loading && <p className="mt-6">Analyzing resume…</p>}

      {score !== null && !loading && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-green-500">
            Shortlisting Probability: {score}%
          </h2>

          <p className="text-gray-400 mt-1">{verdict}</p>

          {missing.length > 0 && (
            <p className="mt-3 text-red-500">
              Missing Core Skills: {missing.join(", ")}
            </p>
          )}

          <p className="mt-3 text-gray-400 text-sm">
            This score estimates ATS shortlisting likelihood.
            Final decisions depend on company-specific ATS rules.
          </p>

          {/* Razorpay Payment Link */}
          <a
            href="https://rzp.io/rzp/KDiTCevo"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
          >
            Improve Resume with AI – ₹199
          </a>

          <p className="mt-2 text-xs text-gray-400">
            After payment, upload your resume again to unlock AI suggestions.
          </p>
        </div>
      )}

      <div className="mt-10 text-sm text-gray-400">
        ✔ Recruiter-style ATS logic<br />
        ✔ Job-description based scoring<br />
        ✔ Privacy-first — resumes not stored
      </div>
    </main>
  );
}
