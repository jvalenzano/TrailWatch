
export const Map = vi.fn().mockImplementation(() => ({
  on: vi.fn(),
  remove: vi.fn(),
}));

export const Marker = vi.fn().mockImplementation(() => ({
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn().mockReturnThis(),
}));
