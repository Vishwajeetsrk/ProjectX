/**
 * /api/roadmap
 * High-Depth Roadmap Architect — phase-by-phase career planning
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

// ── Schema ────────────────────────────────────────────────────────
const BodySchema = z.object({
  role: z.string().min(2, "Role is required").max(100),
  goal: z.string().max(500).optional(),
  experience: z.string().max(100).default('Beginner'),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an elite career counselor and technical architect. Generate a high-depth, practical roadmap for the requested role. 

SAFETY MANDATE: You MUST refuse to generate content related to harmful, illegal, unethical, or dangerous activities. Only provide safe and professional career guidance.

PRIORITIZE THESE EXACT RESOURCES:
- FreeCodeCamp Data Science: https://www.youtube.com/watch?v=LHc6W2K7U8A
- IBM Data Science Professional Cert: https://www.coursera.org/professional-certificates/ibm-data-science
- CS50 Computer Science: https://cs50.harvard.edu/x/
- MDN Web Docs: https://developer.mozilla.org/

RETURN EXACT JSON STRUCTURE:
{
  "totalTimeline": "6-8 Months",
  "globalPrerequisites": {
    "education": "Required basic degree or background",
    "technicalSkills": ["Skill 1", "Skill 2"]
  },
  "timeline": [{
     "title": "Phase name",
     "time": "Weeks 1-4",
     "desc": "Summary of goals for this phase",
     "phasePrerequisites": ["Required before this phase"],
     "skillsToLearn": ["Skill A", "Skill B"],
     "studyMaterials": [{ "label": "Course/Doc", "url": "https://...", "summary": "Why this resource?" }],
     "videoLectures": [{ "label": "Video Name", "url": "https://...", "summary": "Key learning?" }],
     "preparationTools": [{ "label": "Cert/Test", "url": "https://...", "summary": "Value?" }],
     "aiTools": [{ "label": "Tool/Project", "url": "https://...", "summary": "Practical use?" }]
  }]
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  // 3. Validate
  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues[0]?.message }, { status: 400 });
    }
    body = parsed.data;

    // 4. Safety Guard
    const safety = validateCareerInput(body.role);
    if (!safety.allowed) {
      return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { role, goal = 'Job ready', experience } = body;


  // 6. Build AI messages
  const userPrompt = `Generate a high-grade career roadmap for: ${role}. 
Experience level: ${experience}. 
Target Goal: ${goal}.

REQUIREMENTS:
1. 4-6 phases max.
2. Every link MUST be REAL and ACTIVE.
3. For Data Science/AI roles, you MUST include the FreeCodeCamp link (https://www.youtube.com/watch?v=LHc6W2K7U8A).`;

  try {
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ], { jsonMode: true, maxTokens: 2500, temperature: 0.7 });

    const result = parseJSON<object>(content);
    return NextResponse.json({ ...result, _provider: provider });

  } catch (error: unknown) {
    console.error('[roadmap] All providers failed:', error);
    return NextResponse.json({ error: 'AI Roadmap Generator is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
