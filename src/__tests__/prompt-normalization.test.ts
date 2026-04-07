import { describe, it, expect } from 'vitest';
import { normalizePromptEntries, normalizeNewlines } from '../standalone-scripts/macro-controller/src/ui/prompt-utils';

describe('normalizePromptEntries', () => {
  it('preserves slug field', () => {
    const result = normalizePromptEntries([
      { name: 'Next Tasks', text: 'Do next', slug: 'next-tasks' },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('next-tasks');
  });

  it('preserves id field', () => {
    const result = normalizePromptEntries([
      { name: 'Next Tasks', text: 'Do next', id: 'default-next-tasks' },
    ]);
    expect(result[0].id).toBe('default-next-tasks');
  });

  it('preserves isDefault field', () => {
    const result = normalizePromptEntries([
      { name: 'Start', text: 'Go', isDefault: true },
    ]);
    expect(result[0].isDefault).toBe(true);
  });

  it('preserves category and isFavorite', () => {
    const result = normalizePromptEntries([
      { name: 'Test', text: 'Hello', category: 'automation', isFavorite: true },
    ]);
    expect(result[0].category).toBe('automation');
    expect(result[0].isFavorite).toBe(true);
  });

  it('filters entries without name or text', () => {
    const result = normalizePromptEntries([
      { name: '', text: 'no name' },
      { name: 'no text', text: '' },
      { name: 'Valid', text: 'OK' },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Valid');
  });

  it('handles non-array input', () => {
    expect(normalizePromptEntries(null as unknown as [])).toEqual([]);
    expect(normalizePromptEntries(undefined as unknown as [])).toEqual([]);
  });

  it('preserves all fields together (full entry)', () => {
    const result = normalizePromptEntries([{
      name: 'Next Tasks',
      text: 'List remaining tasks',
      id: 'default-next-tasks',
      slug: 'next-tasks',
      category: 'automation',
      isFavorite: true,
      isDefault: true,
    }]);
    expect(result[0]).toEqual({
      name: 'Next Tasks',
      text: 'List remaining tasks',
      id: 'default-next-tasks',
      slug: 'next-tasks',
      category: 'automation',
      isFavorite: true,
      isDefault: true,
    });
  });
});

describe('normalizeNewlines', () => {
  it('collapses 3+ newlines to 2', () => {
    expect(normalizeNewlines('a\n\n\nb')).toBe('a\n\nb');
    expect(normalizeNewlines('a\n\n\n\n\nb')).toBe('a\n\nb');
  });

  it('preserves double newlines', () => {
    expect(normalizeNewlines('a\n\nb')).toBe('a\n\nb');
  });

  it('preserves single newlines', () => {
    expect(normalizeNewlines('a\nb')).toBe('a\nb');
  });

  it('trims leading/trailing whitespace', () => {
    expect(normalizeNewlines('\n\n\nHello\n\n\n')).toBe('Hello');
  });
});
