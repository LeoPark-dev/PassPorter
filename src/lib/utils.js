import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @param {...(string | undefined | null | boolean | Record<string, boolean>)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
