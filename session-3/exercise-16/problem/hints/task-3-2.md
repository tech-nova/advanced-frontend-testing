## Hint 2: Working with dates

```typescript
const futureDockingTime = new Date(
  new Date().getTime() + 1000 * 60 * 60 * 24 // 24 hours from now
);

// Fill the datetime-local input
await page
  .getByLabel('Docking Time')
  .fill(formatDateForInput(futureDockingTime));
```
- Create a future date for testing
- The `formatDateForInput` helper function is already provided to format dates correctly
