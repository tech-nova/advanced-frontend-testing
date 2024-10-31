# Task 3: Using the transaction fixture

```typescript
test('your test name', async ({ page, transaction }) => {
  // Your test code
});
```

- Simply destructure the `transaction` fixture in your test parameters
- The fixture will automatically handle the transaction lifecycle
