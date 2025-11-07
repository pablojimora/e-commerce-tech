"use client";

import React, { useState } from "react";
import styles from "./form.module.css";
import { sendEmail } from "@/services/sendEmail";
import { EmailTemplate } from "../emailTemplate/EmailTemplate";

export const SendEmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    html: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Actualiza inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validación básica
  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!formData.to.trim()) {
      validationErrors.push("El correo destinatario (to) es obligatorio.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to.trim())) {
      validationErrors.push("El correo destinatario no es válido.");
    }

    if (!formData.subject.trim()) {
      validationErrors.push("El asunto (subject) es obligatorio.");
    } else if (formData.subject.trim().length < 5) {
      validationErrors.push("El asunto debe tener al menos 5 caracteres.");
    }

    if (!formData.html.trim()) {
      validationErrors.push("El contenido (html) es obligatorio.");
    } else if (formData.html.trim().length < 10) {
      validationErrors.push("El contenido debe tener al menos 10 caracteres.");
    }

    return validationErrors;
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    

  try {
    // 👇 Crea el HTML a partir de tu componente
    const htmlTemplate = EmailTemplate({
      subject: formData.subject,
      message: formData.html,
      sender: "Pablo Dev",
    });

    const response = await sendEmail({
      to: formData.to,
      subject: formData.subject,
      html: htmlTemplate, // <-- lo envías al backend ya con estilo
    });

    if (response.res === "Mensaje enviado") {
      setSuccessMessage("✅ ¡Correo enviado exitosamente!");
      setFormData({ to: "", subject: "", html: "" });
    } else {
      setErrors(["❌ Error al enviar el correo."]);
    }
  } catch (error) {
    console.error(error);
    setErrors(["⚠️ Ocurrió un error al enviar el correo."]);
  }
};

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Enviar correo</h2>

        <label className={styles.label}>Destinatario:</label>
        <input
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className={styles.input}
        />

        <label className={styles.label}>Asunto:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={styles.input}
        />

        <label className={styles.label}>Contenido:</label>
        <textarea
          name="html"
          value={formData.html}
          onChange={handleChange}
          className={styles.textarea}
        />

        <button type="submit" className={styles.button}>
          Enviar correo
        </button>

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



