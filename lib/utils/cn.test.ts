
import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
    it('combines classes correctly', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
        expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    });

    it('merges tailwind conflicts', () => {
        // twMerge logic: later classes override earlier ones
        expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });
});
