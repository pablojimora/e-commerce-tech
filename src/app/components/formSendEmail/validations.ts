import * as yup from "yup";

export const emailSchema = yup.object().shape({
  to: yup
    .string()
    .email("El correo destinatario no es válido.")
    .required("El correo destinatario (to) es obligatorio."),
    
  subject: yup
    .string()
    .required("El asunto (subject) es obligatorio.")
    .min(5, "El asunto debe tener al menos 5 caracteres."),

  html: yup
    .string()
    .required("El contenido (html) es obligatorio.")
    .min(10, "El contenido debe tener al menos 10 caracteres."),
});
