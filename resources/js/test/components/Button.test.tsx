import { Button } from '@/components/ui/button';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Button Component', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');
    });

    it('applies size classes correctly', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-10');
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
