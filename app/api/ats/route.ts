import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { Buffer } from "buffer";

const CORE_SKILLS = ["javascript", "react", "node", "html", "css"];
const EXPERIENCE_WORDS = [
  "experience", "intern", "worked", "developed",
  "implemented", "built", "designed", "optimized", "deployed"
];
const PROJECT_WORDS = ["project", "application", "system", "tool"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jd = (formData.get("jd") as string | null)?.toLowerCase() || "";

    if (!file) {
      return NextResponse.json({ error: "Resume missing" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await mammoth.extractRawText({ buffer });
    const text = doc.value.toLowerCase();

    let score = 0;
    const missing: string[] = [];

    // 1️⃣ Core skills (40)
    const coreMatched = CORE_SKILLS.filter(k => text.includes(k));
    score += (coreMatched.length / CORE_SKILLS.length) * 40;

    CORE_SKILLS.forEach(k => {
      if (!text.includes(k)) missing.push(k);
    });

    // 2️⃣ Job description match (25)
    if (jd) {
      const jdWords = jd.split(/\W+/).filter(w => w.length > 3);
      const jdMatched = jdWords.filter(w => text.includes(w));
      score += Math.min(25, jdMatched.length * 2);
    }

    // 3️⃣ Experience signals (15)
    const expHits = EXPERIENCE_WORDS.filter(w => text.includes(w)).length;
    score += Math.min(15, expHits * 3);

    // 4️⃣ Projects & impact (10)
    if (PROJECT_WORDS.some(w => text.includes(w))) {
      score += 10;
    }

    // 5️⃣ ATS formatting (10)
    if (!text.includes("|") && text.length > 500) {
      score += 10;
    }

    score = Math.round(Math.min(score, 100));

    let verdict = "Low Shortlisting Chance";
    if (score >= 80) verdict = "Very High Shortlisting Chance";
    else if (score >= 65) verdict = "High Shortlisting Chance";
    else if (score >= 50) verdict = "Medium Shortlisting Chance";

    return NextResponse.json({ score, verdict, missing });

  } catch {
    return NextResponse.json(
      { error: "ATS analysis failed" },
      { status: 500 }
    );
  }
}
