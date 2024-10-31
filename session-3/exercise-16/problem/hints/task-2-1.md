## Hint 1: Finding page elements by role

```typescript
// Example of checking for a heading
await expect(
  page.getByRole('heading', { name: 'Docking Schedule' })
).toBeVisible();
```
- Playwright's `getByRole` is similar to Testing Library's `getByRole`
