export function validatePercentage(value: unknown): number;
export function validatePassword(password: string, confirmation: string): string;
export function validateImage(file: { type: string; size: number } | null | undefined): true;
export function validateRequiredText(value: unknown, label?: string): string;
