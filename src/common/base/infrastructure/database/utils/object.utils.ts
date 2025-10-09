export function isEmptyObject(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }

  return Object.keys(obj as object).length === 0;
}
