import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { results, teamSize, primaryUseCase } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert financial auditor specializing in SaaS and AI infrastructure spend. Review the following AI tool audit for a startup with a team size of ${teamSize} and a primary use case of '${primaryUseCase}'.

Audit Data:
${JSON.stringify(results)}

Write a personalized, actionable summary paragraph (strictly under 100 words). Be direct, highlight the biggest savings opportunity, and maintain a professional, slightly urgent tone. Do not use generic filler. Focus on the hard numbers and the specific tools they are using.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
