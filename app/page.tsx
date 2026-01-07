"use client";

import { useState } from "react";

export default function Home() {
  const [score, setScore] = useState<number | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/ats", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setScore(data.score);
    setMissing(data.missing);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold">HireReady</h1>
      <p className="mt-4 text-gray-400 text-center max-w-xl">
        Check how well your resume matches ATS systems used by recruiters.
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="mt-6"
      />

      {loading && <p className="mt-6 text-yellow-400">Analyzing resume…</p>}

      {score !== null && !loading && (
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-semibold text-red-500">
            ATS Score: {score}%
          </h2>

          <p className="mt-2 text-gray-400">
            {score < 40 ? "Poor ATS match" : "Good ATS match"}
          </p>

          <p className="mt-4 text-yellow-400">
            PDF parsing is limited. Upload DOCX for best accuracy.
          </p>

          {missing.length > 0 && (
            <p className="mt-4 text-red-500">
              Missing Keywords: {missing.join(", ")}
            </p>
          )}

          <p className="mt-6 text-green-400 font-semibold">
            Improve your ATS score with AI resume suggestions — ₹199
          </p>
        </div>
      )}
    </main>
  );
}
