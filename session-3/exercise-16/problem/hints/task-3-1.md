## Hint 1: Opening and filling the modal

```typescript
// Click the button to open the modal
await page.getByRole('button', { name: 'Schedule Docking' }).click();

// Fill form fields using labels
await page.getByLabel('Spacecraft').selectOption({ index: 1 });
```

- Use `getByLabel` to find form inputs
- For dropdowns, `selectOption` can be used with an index or value
