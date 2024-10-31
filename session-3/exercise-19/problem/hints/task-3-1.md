## Hint 1: Testing the countdown sequence

```typescript
// Check for each number in the countdown
await expect(modal.getByText('3')).toBeVisible();
await expect(modal.getByText('2')).toBeVisible();
await expect(modal.getByText('1')).toBeVisible();
```
- The countdown appears as text in the modal
- Check for each number sequentially
