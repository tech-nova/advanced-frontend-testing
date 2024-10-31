## Hint 1: Setting up navigation

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto(DOCKINGS_PATH);
});
```
- Use the `beforeEach` hook to navigate to the dockings page before each test
