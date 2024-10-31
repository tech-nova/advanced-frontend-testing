## Hint 1: Finding elements in the table

```typescript
const dockedRow = page.getByRole('row', {
  name: /docked/i,
});
```
- Use Playwright's role-based selectors to find elements in the table
- The `name` option can use a case-insensitive regex pattern
