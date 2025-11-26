import { NextResponse } from "next/server";
import * as yup from "yup";

// Esquema de validación para los datos de prueba
const pruebaSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    age: yup.number().required("La edad es obligatoria").min(0, "La edad no puede ser negativa"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = await pruebaSchema.validate(body, { abortEarly: false });
        return NextResponse.json({ ok: 'Información válida', data: validatedData });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = error.inner.map(err => ({ field: err.path, message: err.message }));
            return NextResponse.json({ ok: false, errors }, { status: 400 });
        }  
     }}