import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchInput } from '../components/ui/SearchInput';

describe('SearchInput Component', () => {
  it('renders input with placeholder and search icon', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        placeholder="Search conversations..."
      />
    );

    const input = screen.getByPlaceholderText('Search conversations...');
    expect(input).toBeInTheDocument();
  });

  it('debounces onChange events by specified ms', async () => {
    vi.useFakeTimers();
    const handleChange = vi.fn();

    render(
      <SearchInput
        value=""
        onChange={handleChange}
        debounceMs={200}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'marcus' } });

    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(handleChange).toHaveBeenCalledWith('marcus');
    vi.useRealTimers();
  });

  it('clears input when clicking clear button', () => {
    const handleChange = vi.fn();

    render(
      <SearchInput
        value="current query"
        onChange={handleChange}
      />
    );

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
