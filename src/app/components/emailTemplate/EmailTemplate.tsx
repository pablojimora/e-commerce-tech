interface EmailTemplateProps {
  subject: string;
  message: string;
  sender?: string;
}

export const EmailTemplate = ({ subject, message, sender }: EmailTemplateProps) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    padding: 30px;
    border-radius: 10px;
    max-width: 600px;
    margin: 0 auto;
  ">
    <h2 style="color: #4a90e2; text-align: center;">${subject}</h2>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      ${message}
    </p>
    <hr style="margin: 20px 0;" />
    <p style="font-size: 14px; color: #777; text-align: center;">
      Enviado por: ${sender || "Anónimo"}
    </p>
  </div>`;
};
