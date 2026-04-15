/**
 * /api/career-agent
 * AI Career Agent — Expert Persona
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
  context: z.string().optional(),
});

const SYSTEM_PROMPT = `You are "AI Career Agent" — a world-class career intelligence system and DreamSync's Strategist v2. Your job is to guide users toward REAL, LEGAL, HIGH-INCOME careers using structured, actionable, and market-driven insights specifically for the Indian market (2026 context).

🚨 STRICT SAFETY RULE:
If user asks for illegal jobs (black hat hacker, terrorism, fraud, scams, etc.) or unethical activities, politely refuse and redirect to a legal alternative (e.g., Cyber Security/Ethical Hacker).

🎯 RESPONSE STYLE:
- Structured format with clear sections.
- Real-world data and actionable steps.
- Professional, industry-expert mentor tone.
- Avoid generic advice, long paragraphs, or vague suggestions.

OUTPUT FORMAT (The "reply" field MUST follow this 7-section Markdown structure):
1. 🎯 ROLE SUGGESTION
   - Recommended legal career path
   - Why it's relevant
2. 💰 MARKET INSIGHTS (REAL DATA)
   - Salary range (India + Global)
   - Demand level (High / Medium / Low)
   - Hiring companies (Google, Microsoft, Startups)
3. 🧠 SKILLS REQUIRED
   - Core skills, Tools, Technologies
4. 🗺️ ROADMAP (STEP-BY-STEP)
   - Phase 1: Foundation (Weeks 1–4)
   - Phase 2: Intermediate (Weeks 5–8)
   - Phase 3: Advanced (Weeks 9–12)
   - Each phase MUST include: What to learn, What to build, What to practice.
5. 📚 FREE LEARNING RESOURCES
   - YouTube (FreeCodeCamp, etc.), Free courses (Coursera free, Harvard CS50), Websites (MDN, roadmap.sh)
6. 💼 REAL JOB INSIGHTS
   - Job titles, Example companies, Required skills, Real expectations
7. ⚡ CRITICAL INTELLIGENCE
   - Key success advice, Mistakes to avoid, Insider tips

STRICT JSON FORMAT: Return ONLY this structure:
{
  "reply": "Full Markdown following the 7 sections above...",
  "roles": [{ "title": "Role", "salary": "₹12-25 LPA", "demand": "High", "skills": ["Skill1"] }],
  "roadmapNodes": [],
  "jobLinks": [{ "platform": "Internal", "url": "/roadmap", "label": "Generate Roadmap" }],
  "quickTips": ["Tip 1", "Tip 2"]
}`;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const lastUserMsg = parsed.data.messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      const safety = validateCareerInput(lastUserMsg.content);
      if (!safety.allowed) return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }

    const { messages, context = '' } = parsed.data;
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ], { jsonMode: true });

    return NextResponse.json({ ...parseJSON(content), _provider: provider });
  } catch (error: any) {
    console.error('[career-agent] Error:', error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Try again in a moment!",
      roles: [], roadmapNodes: [], jobLinks: [], quickTips: []
    });
  }
}
