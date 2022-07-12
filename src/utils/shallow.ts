export const shallowEq = (a: Record<string, any>, b: Record<string, any>) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length != bKeys.length) return false;
  return !aKeys.some((key) => a[key] !== b[key]);
};
