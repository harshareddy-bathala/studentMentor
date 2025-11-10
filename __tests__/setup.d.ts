/**
 * Type declarations for jest-dom matchers in Vitest
 * 
 * This file extends Vitest's assertion types to include jest-dom matchers
 * like toBeInTheDocument, toHaveClass, toBeDisabled, etc.
 */

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}
