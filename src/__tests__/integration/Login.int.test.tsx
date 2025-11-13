import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';

describe('LoginPage (integración simple por props)', () => {
  it('actualiza los campos de correo y contraseña al escribir', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Correo') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Contraseña') as HTMLInputElement;
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    await user.type(emailInput, 'luis@example.com');
    await user.type(passwordInput, 'luis123');
    expect(emailInput.value).toBe('luis@example.com');
    expect(passwordInput.value).toBe('luis123');
  });
});