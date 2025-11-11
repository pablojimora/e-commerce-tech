// Importamos funciones principales para renderizar y buscar elementos en el DOM virtual
import SimplePage from '@/app/components/SimplePage';
import { render, screen } from '@testing-library/react';

// userEvent simula acciones del usuario: clic, escritura, teclado, etc.
import userEvent from '@testing-library/user-event';

// Importamos la página que integra varios componentes


describe('SimplePage (integración simple por props)', () => {
  it('actualiza el valor al hacer clic en + y -', async () => {
    // Preparamos simulador de usuario
    const user = userEvent.setup();

    // Renderizamos la página completa
    render(<SimplePage />);

    // Obtenemos el span que muestra el valor actual (aria-label="count")
    const value = screen.getByLabelText('count');

    // Verificamos estado inicial
    expect(value).toHaveTextContent('0');

    // Simulamos clic en el botón "+"
    await user.click(screen.getByRole('button', { name: '+' }));

    // Validamos incremento
    expect(value).toHaveTextContent('1');

    // Simulamos clic en el botón "-"
    await user.click(screen.getByRole('button', { name: '-' }));

    // Validamos que vuelva a 0
    expect(value).toHaveTextContent('0');
  });
});