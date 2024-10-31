# Re-exporting rules

```typescript
// Most rules can be re-exported directly
export const isString = isStringRule;
export const notEmpty = notEmptyRule;
// ... etc
```

- Create a facade that maintains the old API while using the new implementation
- Only modify rules that have breaking changes
