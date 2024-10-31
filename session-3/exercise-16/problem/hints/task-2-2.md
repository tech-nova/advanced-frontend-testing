## Hint 2: Checking table columns

```typescript
await expect(
  page.getByRole('columnheader', { name: 'Column Name' })
).toBeVisible();
```
- Table headers can be found using the `columnheader` role
- Check each required column: Spacecraft, Captain, Docking Time, etc.
