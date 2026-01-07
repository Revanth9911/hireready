"use client";

import { useState } from "react";

export default function Home() {
  const [score, setScore] = useState<number | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function getScoreColor(score: number) {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-400";
    return "text-red-500";
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setScore(null);
    setMissing([]);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setScore(data.score);
      setMissing(data.missing || []);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold">HireReady</h1>

      <p className="mt-4 text-center text-gray-600">
        Upload your resume to check ATS compatibility.
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="mt-6"
      />

      {loading && <p className="mt-4">Analyzing resume…</p>}

      {score !== null && !loading && (
        <div className="mt-6 text-center">
          <h2 className={`text-2xl font-semibold ${getScoreColor(score)}`}>
            ATS Score: {score}%
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {score >= 70 && "Strong ATS match"}
            {score >= 40 && score < 70 && "Average ATS match"}
            {score < 40 && "Poor ATS match"}
          </p>

          {score === 0 && (
            <p className="mt-2 text-yellow-400">
              PDF parsing is limited in this version.  
              Upload a DOCX resume for accurate results.
            </p>
          )}

          {missing.length > 0 && (
            <p className="mt-2 text-red-500">
              Missing Keywords: {missing.join(", ")}
            </p>
          )}

          <p className="mt-4 text-green-400 font-semibold">
            Improve your ATS score with AI resume suggestions – ₹199
          </p>
        </div>
      )}
    </main>
  );
}
