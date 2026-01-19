import { describe, it, expect } from 'vitest';
import { fetchApi, ApiError } from './api';

describe('fetchApi', () => {
  it('should be a function', () => {
    expect(typeof fetchApi).toBe('function');
  });

  it('should fetch data successfully', async () => {
    const data = await fetchApi('/api/test');
    expect(data).toEqual({ success: true });
  });

  it('should throw an ApiError on fetch failure', async () => {
    await expect(fetchApi('/api/error')).rejects.toThrow(ApiError);
  });

  it('should have status and message in ApiError', async () => {
    try {
      await fetchApi('/api/error');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Test error');
      }
    }
  });
});