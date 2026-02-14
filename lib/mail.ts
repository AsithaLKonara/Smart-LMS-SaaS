
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendLiveClassReminder = async (
    email: string,
    userName: string,
    classTitle: string,
    startTime: string,
    meetingUrl: string
) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Smart LMS <notifications@yourdomain.com>',
            to: [email],
            subject: `Reminder: Live Class "${classTitle}" starting soon!`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0e0918; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h2 style="color: #8b5cf6; margin-bottom: 24px;">Class Starting Soon!</h2>
          <p>Hi ${userName},</p>
          <p>This is a friendly reminder that your live class <strong>"${classTitle}"</strong> is scheduled to start at <strong>${startTime}</strong>.</p>
          <div style="margin: 32px 0;">
            <a href="${meetingUrl}" style="background-color: #8b5cf6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Join Class Now
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #94a3b8; font-size: 14px;">${meetingUrl}</p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 32px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center;">Smart LMS SaaS - Build the future of learning.</p>
        </div>
      `,
        });

        if (error) {
            console.error("[MAIL_ERROR]", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("[MAIL_EXCEPTION]", error);
        return { success: false, error };
    }
};
