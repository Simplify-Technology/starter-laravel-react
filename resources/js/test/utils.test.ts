import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('Utils', () => {
    describe('cn function', () => {
        it('merges class names correctly', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2');
        });

        it('handles conditional classes', () => {
            expect(cn('base', true && 'conditional')).toBe('base conditional');
            expect(cn('base', false && 'conditional')).toBe('base');
        });

        it('handles undefined and null values', () => {
            expect(cn('base', undefined, null, 'valid')).toBe('base valid');
        });

        it('handles empty strings', () => {
            expect(cn('base', '', 'valid')).toBe('base valid');
        });

        it('handles arrays of classes', () => {
            expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
        });

        it('handles objects with boolean values', () => {
            expect(
                cn({
                    class1: true,
                    class2: false,
                    class3: true,
                }),
            ).toBe('class1 class3');
        });
    });
});
