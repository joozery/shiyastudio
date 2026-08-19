import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

function looksHashed(value: string): boolean {
  // bcrypt hashes always look like $2a$10$..., $2b$..., $2y$...
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

/**
 * Verifies `plain` against a stored password value that may be either a
 * bcrypt hash (new accounts) or legacy plain text (accounts created before
 * passwords were hashed). Lets old accounts keep working without a manual
 * DB migration.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  if (looksHashed(stored)) {
    return bcrypt.compare(plain, stored);
  }
  // Legacy plain-text record.
  return plain === stored;
}
