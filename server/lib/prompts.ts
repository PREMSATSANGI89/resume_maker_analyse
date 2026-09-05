interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

const SCORE_SHAPE = `{
    "overall": <0-100 int>,
    "ats": <0-100 int, ATS/parser compatibility>,
    "grammar": <0-100 int>,
    "keywordMatch": <0-100 int, coverage of role-relevant keywords>,
    "skillsMatch": <0-100 int>,
    "formatting": <0-100 int>,
    "experience": <0-100 int, strength/depth of experience section>,
    "education": <0-100 int>
  }`;

const JSON_ONLY_RULE =
  'Respond with ONLY a single valid JSON object — no markdown code fences, no commentary before or after it.';

export interface ModelAnalysisOutput {
  scores: {
    overall: number;
    ats: number;
    grammar: number;
    keywordMatch: number;
    skillsMatch: number;
    formatting: number;
    experience: number;
    education: number;
  };
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  keywordMatch: { matched: string[]; missing: string[]; recommended: string[] };
  suggestions: Array<{
    category: 'ATS' | 'Grammar' | 'Content' | 'Formatting' | 'Keywords' | 'Structure';
    severity: 'low' | 'medium' | 'high';
    title: string;
    detail: string;
  }>;
  improvementTimeline: Array<{ label: string; status: 'done' | 'pending' | 'critical' }>;
  summary: string;
}

export function buildAnalysisPrompt(resumeText: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        'You are an expert resume reviewer and ATS (Applicant Tracking System) analyst. ' +
        'You give honest, specific, actionable feedback grounded only in the resume text provided — never invent facts about the candidate. ' +
        JSON_ONLY_RULE,
    },
    {
      role: 'user',
      content: `Analyze the following resume and return a JSON object with this exact shape:

{
  "scores": ${SCORE_SHAPE},
  "strengths": [<3-5 short strings — concrete things this resume does well>],
  "weaknesses": [<3-5 short strings — concrete gaps or issues>],
  "missingSkills": [<skills likely expected for this candidate's apparent target role that are absent from the resume>],
  "keywordMatch": {
    "matched": [<role-relevant keywords/skills actually present in the resume>],
    "missing": [<role-relevant keywords/skills absent from the resume>],
    "recommended": [<additional keywords worth adding, distinct from "missing">]
  },
  "suggestions": [
    {
      "category": <one of "ATS" | "Grammar" | "Content" | "Formatting" | "Keywords" | "Structure">,
      "severity": <one of "low" | "medium" | "high">,
      "title": <short imperative title>,
      "detail": <1-2 sentence explanation with a concrete fix>
    }
    // 4-6 items total, ordered by severity descending
  ],
  "improvementTimeline": [
    { "label": <short actionable step>, "status": <one of "done" | "pending" | "critical"> }
    // 3-5 items
  ],
  "summary": <2-3 sentence overall summary referencing the actual overall/ats scores>
}

${JSON_ONLY_RULE}

Resume text:
"""
${resumeText.slice(0, 12000)}
"""`,
    },
  ];
}

export interface ModelComparisonSide {
  scores: ModelAnalysisOutput['scores'];
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
  projects: string[];
  keywordMatch: { matched: string[]; missing: string[]; recommended: string[] };
  missingSkills: string[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface ModelComparisonOutput {
  resumeA: ModelComparisonSide;
  resumeB: ModelComparisonSide;
}

const COMPARISON_SIDE_SHAPE = `{
    "scores": ${SCORE_SHAPE},
    "skills": [<skills explicitly listed or clearly demonstrated in this resume>],
    "experience": [<one entry per role, e.g. "Senior Engineer — Acme Corp (2021-2024)">],
    "education": [<one entry per degree/program, e.g. "B.S. Computer Science — State University">],
    "certifications": [<certifications listed; empty array if none>],
    "projects": [<notable projects listed; empty array if none>],
    "keywordMatch": {
      "matched": [<role-relevant keywords present>],
      "missing": [<role-relevant keywords absent>],
      "recommended": [<additional keywords worth adding>]
    },
    "missingSkills": [<skills likely expected for the apparent target role that are absent>],
    "strengths": [<3-5 short strings>],
    "areasForImprovement": [<3-5 short strings>]
  }`;

export function buildComparisonPrompt(resumeTextA: string, resumeTextB: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        'You are an expert resume reviewer and ATS analyst comparing two resumes head-to-head. ' +
        'Score and describe each resume independently and honestly, grounded only in its own text — never invent facts, ' +
        'and do not let one resume\'s content influence the other\'s scores. ' +
        JSON_ONLY_RULE,
    },
    {
      role: 'user',
      content: `Compare Resume A and Resume B below and return a JSON object with this exact shape:

{
  "resumeA": ${COMPARISON_SIDE_SHAPE},
  "resumeB": ${COMPARISON_SIDE_SHAPE}
}

${JSON_ONLY_RULE}

Resume A:
"""
${resumeTextA.slice(0, 10000)}
"""

Resume B:
"""
${resumeTextB.slice(0, 10000)}
"""`,
    },
  ];
}
