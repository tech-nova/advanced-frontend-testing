## Hint 3: Counting table rows

```typescript
// Count all rows including header
await expect(page.getByRole('row')).toHaveCount(expectedCount);
```
- Remember that the total row count includes the header row
