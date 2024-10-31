# Task 2: API endpoints

```typescript
const API_BASE = 'http://localhost:3000/api';

// Start transaction
await request.post(`${API_BASE}/testing/transaction/begin`);

// Rollback transaction
await request.post(`${API_BASE}/testing/transaction/rollback`);
```

- Use these endpoints to manage your database transactions
