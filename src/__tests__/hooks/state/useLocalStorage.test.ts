import { renderHook, act } from '@testing-library/react';

import { useLocalStorage } from '@/hooks/state';

describe('useLocalStorage', () => {
  beforeEach(() => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('should initialize with the default value when no data is stored', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    expect(result.current.value).toBe('default_value');
    expect(result.current.error).toBeNull();
  });

  it('should initialize with the stored value from localStorage', () => {
    localStorage.setItem('test_key', JSON.stringify('stored_value'));

    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    expect(result.current.value).toBe('stored_value');
    expect(result.current.error).toBeNull();
  });

  it('should update the value in state and localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    act(() => {
      result.current.setValue('updated_value');
    });

    expect(result.current.value).toBe('updated_value');
    expect(localStorage.getItem('test_key')).toBe(
      JSON.stringify('updated_value')
    );
    expect(result.current.error).toBeNull();
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current.setValue((currentValue) => currentValue + 1);
    });

    expect(result.current.value).toBe(1);
    expect(localStorage.getItem('counter')).toBe(JSON.stringify(1));
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('test_key', 'invalid_json');

    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    expect(result.current.value).toBe('default_value');
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should handle errors during setValue gracefully', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    Object.defineProperty(globalThis.localStorage, 'setItem', {
      value: () => {
        throw new Error('Storage failed');
      },
    });

    act(() => {
      result.current.setValue('new_value');
    });

    expect(result.current.value).toBe('default_value'); // Value remains unchanged
    expect(result.current.error?.message).toBe('Storage failed');
  });
});
