'use client';
export default function Display({ value }: { value: number }) {
  return <p>Valor: <span aria-label="count">{value}</span></p>;
}