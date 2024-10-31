# Task 2: Basic fixture structure

```typescript
transaction: async ({ request }, use) => {
  // Before test

  await use(null);

  // After test
},
```

- Playwright fixtures follow this pattern: setup, test execution (`use`), cleanup
- The `request` parameter comes from Playwright's built-in fixtures
