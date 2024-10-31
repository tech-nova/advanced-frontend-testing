# Understanding the validation system

- Look at how `validation.ts` imports rules from `validator/rules.ts`
- Notice how the `required` rule checks for both `null` and `undefined` values
- Pay attention to how validation messages are formatted using `fieldName`
