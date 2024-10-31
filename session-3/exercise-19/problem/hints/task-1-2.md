## Hint 2: Working with the modal

```typescript
const modal = page.getByRole('dialog', {
  name: 'Record Video Scan',
});
await expect(modal).toBeVisible();
```
- The video recording interface appears in a modal dialog
- Use role-based selectors to interact with modal elements
