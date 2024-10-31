# Key differences in the new version

The main breaking change is in the `required` rule:
```typescript
// Old version
value === null || value === undefined  // Checks both null and undefined

// New version
value === undefined  // Only checks undefined
```

The new version splits null checking into a separate rule.
