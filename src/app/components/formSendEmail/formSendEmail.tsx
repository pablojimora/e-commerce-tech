  "use client";

import React, { useState } from "react";
import styles from "./form.module.css";
import { sendEmail } from "@/services/sendEmail";
import { EmailTemplate } from "../emailTemplate/EmailTemplate";
import { MiButton } from "../MiButton/MiButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { emailSchema } from "./validations";

export const SendEmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    html: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors([]);

    try {
      // Validación Yup
      await emailSchema.validate(formData, { abortEarly: false });

      // Crear template HTML
      const htmlTemplate = EmailTemplate({
        subject: formData.subject,
        message: formData.html,
        sender: "Pablo Dev",
      });

      const response = await sendEmail({
        to: formData.to,
        subject: formData.subject,
        html: htmlTemplate,
      });

      if (response.res === "Mensaje enviado") {
        setSuccessMessage("¡Correo enviado exitosamente!");
        setFormData({ to: "", subject: "", html: "" });
      } else {
        setErrors(["Error al enviar el correo."]);
      }
    } catch (err: any) {
      if (err.inner) {
        // ✔️ Yup errors
        setErrors(err.inner.map((e: any) => e.message));
      } else {
        // Otros errores
        setErrors(["⚠️ Ocurrió un error al enviar el correo."]);
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{t('sendEmail.send')}</h2>

        <label className={styles.label}>{t('sendEmail.to')}</label>
        <input
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className={styles.input}
        />

        <label className={styles.label}>{t('sendEmail.subject')}</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={styles.input}
        />

        <label className={styles.label}>{t('sendEmail.message')}</label>
        <textarea
          name="html"
          value={formData.html}
          onChange={handleChange}
          className={styles.textarea}
        />

        <MiButton text={t('sendEmail.send')} type="submit" />

        {errors.length > 0 && (
          <ul className={styles.errorList}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default SendEmailForm;