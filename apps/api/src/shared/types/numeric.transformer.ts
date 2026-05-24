import { ValueTransformer } from 'typeorm';

// Postgres NUMERIC comes back as a string by default; convert to a real number.
export class NumericTransformer implements ValueTransformer {
  to(value: number | null): number | null {
    return value;
  }
  from(value: string | null): number | null {
    return value === null ? null : parseFloat(value);
  }
}
