// jest.setup.ts
import '@testing-library/jest-dom';
// jest.setup.js
jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(() => ({ status: 'unauthenticated' })),
  signIn: jest.fn(),
}));
