## Hint 3: Verifying the new entry

```typescript
// Wait for modal to close
await expect(page.getByRole('dialog')).not.toBeVisible();

// Check for the new values in the table
await expect(
  page.getByRole('cell', { name: expectedValue })
).toBeVisible();
```
- Verify both that the modal closes and the new data appears in the table
