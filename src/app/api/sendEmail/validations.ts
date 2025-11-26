import * as yup from "yup";

export const emailSchema = yup.object().shape({
  to: yup.string().email().required(),
  subject: yup.string().min(5).required(),
  html: yup.string().min(10).required(),
});
