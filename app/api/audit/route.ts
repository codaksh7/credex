import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, company, results, tools, teamSize } = body;

    const totalSavings = results.reduce((acc: number, r: { savings: number }) => acc + r.savings, 0);

    const shareData = {
      results: results.map((r: { toolName: string; savings: number; recommendedAction: string }) => ({
        toolName: r.toolName,
        savings: r.savings,
        recommendedAction: r.recommendedAction,
      })),
    };

    let auditId: string | null = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('audits')
        .insert({
          email,
          company: company || null,
          team_size: teamSize,
          tools,
          results,
          total_savings: totalSavings,
        })
        .select('id')
        .single();

      if (data && !error) {
        auditId = data.id;
      } else {
        console.error('Supabase insert error:', error);
      }
    }

    if (!auditId) {
      auditId = Buffer.from(JSON.stringify(shareData)).toString('base64url');
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const shareUrl = `${baseUrl}/share/${auditId}`;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Your AI Spend Audit: $${totalSavings}/mo in potential savings`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #050505; color: #ffffff;">
              <h1 style="color: #00e676; margin-bottom: 0.5rem;">Your AI Spend Audit</h1>
              <p style="color: #888;">Here are your results:</p>
              <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 2rem; margin: 1.5rem 0; text-align: center;">
                <p style="color: #888; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em;">Total Potential Savings</p>
                <p style="font-size: 2.5rem; font-weight: 800; color: #00e676; margin: 0.5rem 0;">$${totalSavings}/mo</p>
                <p style="color: #888;">($${totalSavings * 12}/year)</p>
              </div>
              ${results.map((r: { toolName: string; savings: number; recommendedAction: string }) => `
                <div style="padding: 1rem; border-bottom: 1px solid #1a1a1a;">
                  <strong>${r.toolName}</strong>
                  <span style="color: ${r.savings > 0 ? '#00e676' : '#888'}; float: right;">${r.savings > 0 ? `Save $${r.savings}/mo` : 'Optimal'}</span>
                  <br/><span style="color: #888; font-size: 0.85rem;">${r.recommendedAction}</span>
                </div>
              `).join('')}
              <div style="margin-top: 2rem; text-align: center;">
                <a href="${shareUrl}" style="display: inline-block; background: #00e676; color: #000; padding: 0.75rem 2rem; border-radius: 60px; font-weight: 700; text-decoration: none;">View Full Report</a>
              </div>
              ${totalSavings > 500 ? '<p style="color: #888; text-align: center; margin-top: 1.5rem; font-size: 0.85rem;">High savings detected. A Credex team member will reach out to help you claim wholesale credits.</p>' : ''}
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Resend email error:', emailErr);
      }
    }

    return NextResponse.json({ success: true, shareUrl });
  } catch (err) {
    console.error('Audit API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
