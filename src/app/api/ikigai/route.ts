/**
 * /api/ikigai
 * AI Ikigai Career Analysis Engine
 * Analyzes the intersection of Passion, Skills, Market, and Income to find a user's "Ikigai".
 */

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { callAI, parseJSON } from '@/lib/ai';
import { validateCareerInput } from '@/lib/aiGuard';

// ── Schema ────────────────────────────────────────────────────────
const BodySchema = z.object({
  passions: z.array(z.string()).min(1).max(10),
  skills: z.array(z.string()).min(1).max(10),
  marketNeeds: z.array(z.string()).min(1).max(10),
  incomeGoals: z.string().max(500).optional(),
});

// ── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DreamSync's Advanced IKIGAI Architect. Your goal is to help users find the intersection of:

SAFETY MANDATE: You MUST refuse to generate content related to harmful, illegal, unethical, or dangerous activities. Only provide safe and professional career guidance.

1. What they LOVE (Passion)
2. What they are GOOD AT (Profession/Skills)
3. What the WORLD NEEDS (Mission/Market)
4. What they can be PAID FOR (Vocation/Income)

Analyze the user's inputs and find their "Ikigai" — the sweet spot where all four intersect.

RESPONSE FORMAT (Strict JSON):
{
  "ikigaiSummary": "A powerful 2-sentence summary of their Ikigai core.",
  "primaryPath": {
    "title": "The name of their ideal career path",
    "description": "Why this path fits their unique Ikigai profile perfectly.",
    "salaryRange": "₹X LPA – ₹Y LPA (India market 2026)",
    "marketDemand": "High | Medium | Low"
  },
  "zones": {
    "passion": "What drives them emotionally in this path.",
    "profession": "How their existing skills transform into value.",
    "mission": "The impact they will have on the world.",
    "vocation": "The economic stability this path provide."
  },
  "recommendedRoles": [
    { "title": "Role 1", "match": "95%", "reason": "Short reason" },
    { "title": "Role 2", "match": "85%", "reason": "Short reason" }
  ],
  "roadmap": [
    { "step": "Phase 1", "focus": "Skills to acquire", "duration": "1-2 months" },
    { "step": "Phase 2", "focus": "Portfolio & networking", "duration": "2-3 months" }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area to improve 1", "Area to improve 2"],
  "nextAction": "The single most important first step to take."
}`;

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  // 2. Validate Body
  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues[0]?.message }, { status: 400 });
    }
    body = parsed.data;

    // 4. Safety Guard
    const combinedInput = [
      ...body.passions,
      ...body.skills,
      ...body.marketNeeds,
      body.incomeGoals || ''
    ].join(' ');
    
    const safety = validateCareerInput(combinedInput);
    if (!safety.allowed) {
      return NextResponse.json({ error: 'Safety Violation', details: safety.message }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sanitized = { ...body };

  // 5. Build Prompt
  const userPrompt = `DISCOVER MY IKIGAI:
PASSIONS: ${sanitized.passions.join(', ')}
SKILLS: ${sanitized.skills.join(', ')}
WORLD NEEDS: ${sanitized.marketNeeds.join(', ')}
INCOME GOALS: ${sanitized.incomeGoals}

Analyze these and find my ideal Ikigai path for the 2026 Indian job market.`;

  // 5. Call AI
  try {
    const { content, provider } = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ], { jsonMode: true, maxTokens: 2000, temperature: 0.8 });

    const result = parseJSON<object>(content);
    return NextResponse.json({ ...result, _provider: provider });

  } catch (error: unknown) {
    console.error('[ikigai] AI error:', error);
    return NextResponse.json({ error: 'Failed to analyze Ikigai. Please try again.' }, { status: 500 });
  }
}
