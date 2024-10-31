## Hint 3: Verifying the preview section

```typescript
await expect(modal.getByText('Preview:')).toBeVisible();
await expect(modal.locator('video[controls]')).toBeVisible();
```
- Look for both the preview label and video element
- The video element should have controls attribute
