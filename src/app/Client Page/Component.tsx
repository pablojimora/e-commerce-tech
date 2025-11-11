'use client';

import Button from "../components/Button";



export default function Demo() {
  const handleClick = () => alert('Clicked!');
  return <Button label="Click me" onClick={handleClick} />;
}