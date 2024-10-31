# Creating a compatibility wrapper

```typescript
// In your new rules.ts file
import { required as isRequired, isNull } from './validator/rules';

export const required = (fieldName?) => ({
  validate: (value: unknown) => {
    // Combine both checks here to maintain backward compatibility
    if (/* ... */) {
      return 'Field cannot be null or undefined';
    }
    return null;
  },
});
```