"use client";

import { useState } from "react";

export default function Home() {
  const [score, setScore] = useState<number | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setScore(null);
    setMissing([]);

    try {
      const res = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setScore(data.score);
      setMissing(data.missing);
    } catch (err) {
      alert("Failed to process resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* HERO */}
      <h1 className="text-4xl md:text-5xl font-bold">HireReady</h1>

      <p className="mt-4 text-gray-400 max-w-xl">
        Instantly check how well your resume matches ATS systems used by recruiters.
        Get keyword insights and improve your chances of getting shortlisted.
      </p>

      {/* FILE UPLOAD */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="mt-6"
      />

      <p className="mt-3 text-sm text-gray-500">
        Supported formats: PDF, DOCX • No login required
      </p>

      {/* LOADING */}
      {loading && (
        <p className="mt-6 text-gray-400">Analyzing resume…</p>
      )}

      {/* RESULTS */}
      {score !== null && !loading && (
        <div className="mt-8">
          <h2
            className={`text-2xl font-semibold ${
              score < 40
                ? "text-red-500"
                : score < 70
                ? "text-yellow-400"
                : "text-green-500"
            }`}
          >
            ATS Score: {score}%
          </h2>

          <p className="mt-2 text-gray-400">
            {score < 40
              ? "Poor ATS match"
              : score < 70
              ? "Average ATS match"
              : "Strong ATS match"}
          </p>

          {missing.length > 0 && (
            <p className="mt-3 text-red-500">
              Missing Keywords: {missing.join(", ")}
            </p>
          )}

          {/* TRUST + UPSELL */}
          <p className="mt-4 text-yellow-400 text-sm">
            PDF parsing is limited in this version. Upload a DOCX resume for
            more accurate results.
          </p>

          <button className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold">
            Improve Resume with AI – ₹199
          </button>
        </div>
      )}

      {/* TRUST SIGNALS */}
      <div className="mt-10 text-sm text-gray-400">
        ✔ Used by students & freshers<br />
        ✔ ATS-friendly analysis<br />
        ✔ Privacy-first — resumes are not stored
      </div>
    </main>
  );
}
