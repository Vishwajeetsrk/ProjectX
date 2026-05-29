/**
 * /api/career-agent
 * AI Career Agent — Expert Persona
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';
import { searchWeb } from '@/lib/serper';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
  context: z.string().optional(),
});

const SYSTEM_PROMPT = `You are "AI Career Agent" — a high-efficiency career coach. You MUST follow the Direct Answer Protocol:

🎯 INTENT DETECTION RULES:
1. IF USER ASKS "ATS Score Check" or related:
   - Provide ONLY the direct button data.
   - Reply: "Use our professional ATS Score Check tool to verify your resume readiness."
   - jobLinks: [{ "platform": "Internal", "url": "/ats-check", "label": "ATS CHECK BUTTON", "summary": "Direct link to score analysis." }]
   - ZERO OTHER SECTIONS.

2. IF USER ASKS "Job" or "Live Info" or related:
   - Use the provided Search Results to give the most accurate info.
   - Provide ONLY live job links.
   - Reply: "Here are the top-verified job portals and live listings found for your query."
   - jobLinks: [LinkedIn, Naukri, Glassdoor, Wellfound links found in search]
   - ZERO OTHER SECTIONS.

3. IF USER ASKS "CareerRelated" (Roadmaps, how to become X, skills):
   - Provide a FULL, DETAILED guide.
   - reply: Strictly structured as:
     ### CLEAR INFORMATION (No Confusion)
     Explaining the role simply.
     ### FREE RESOURCES & COURSES
     List 2-3 high-quality free courses (Coursera, Udemy, YouTube).
     ### 90-DAY CLEAR ROADMAP
     Step-by-step logic.
   - roadmapNodes: Structured progression.
   - quickTips: 2-3 essential facts.

🚨 CORE DIRECTIVES:
- NO INTROS. NO "Hello". NO "As an AI".
- BE DIRECT.
- If Search Results are provided, PRIORITIZE them for real-time data.

STRICT JSON FORMAT:
{
  "reply": "Markdown content...",
  "roles": [],
  "roadmapNodes": [],
  "jobLinks": [],
  "quickTips": []
}`;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const lastUserMsg = parsed.data.messages.filter(m => m.role === 'user').pop();
    let searchContext = '';

    if (lastUserMsg) {
      const safety = validateCareerInput(lastUserMsg.content);
      if (!safety.allowed) return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });

      // Detect if search is needed (Jobs, Salary, Live data)
      const query = lastUserMsg.content.toLowerCase();
      if (query.includes('job') || query.includes('salary') || query.includes('live') || query.includes('hiring')) {
        const fullQuery = `latest ${lastUserMsg.content} recruitment India 2026`;
        const results = await searchWeb(fullQuery);
        if (results.length > 0) {
          searchContext = `REAL-TIME SEARCH RESULTS:\n${results.map(r => `- ${r.title}: ${r.link}\n  ${r.snippet}`).join('\n')}`;
        }
      }
    }

    const { messages, context = '' } = parsed.data;
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      ...(searchContext ? [{ role: 'user' as const, content: searchContext }] : []),
      ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ], { jsonMode: true });

    return NextResponse.json({ ...parseJSON<any>(content), _provider: provider });
  } catch (error: any) {
    console.error('[career-agent] Error:', error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Try again in a moment!",
      roles: [], roadmapNodes: [], jobLinks: [], quickTips: []
    });
  }
}
