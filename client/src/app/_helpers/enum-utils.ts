export function getEnumName(
  enumName: { [key: string]: string | number },
  value: string | number | null
): string | undefined {
  return Object.keys(enumName).find((key) => enumName[key] === value);
}
