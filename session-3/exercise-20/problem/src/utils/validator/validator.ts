export type ValidationResult = string | null;
export type ValidationErrors = Record<string, string>;

export interface ValidationRule<T = unknown> {
  validate: (value: T) => ValidationResult;
}

export class Validator<T = unknown> {
  private rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): ValidationResult {
    for (const rule of this.rules) {
      const error = rule.validate(value);
      if (error) return error;
    }
    return null;
  }
}
