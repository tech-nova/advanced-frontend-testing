# Exercise 17

## Overview

### **Context**

When running end-to-end tests, each test should start with a clean slate to ensure reliable and predictable results. In our current setup, tests might affect each other because they share the same database state. We'll use Playwright's fixture system to implement database transaction management that automatically resets the database state between tests.

### **Learning Outcome**

By the end of this exercise, you'll understand how to create reusable test fixtures in Playwright that manage database transactions, ensuring each test runs in isolation. You'll also learn how Playwright's fixture system makes it easy to share setup and teardown code across multiple tests.

### **Motivation**

Test isolation is crucial for maintaining a reliable test suite. Without it, tests can become flaky and unpredictable because they depend on the state left behind by previous tests. By implementing proper test isolation, we can:

- Ensure tests are reliable and repeatable
- Make tests easier to debug since they're not affected by other tests
- Allow tests to be run in any order without breaking

### **Problem Statement**

You will create a Playwright fixture that manages database transactions, automatically starting a new transaction before each test and rolling it back afterward. This ensures each test runs with a clean database state, regardless of what other tests have done.

### **Key Takeaways**

- **Test Isolation**: Learn why test isolation is crucial for maintaining a reliable test suite and how to achieve it using database transactions
- **Playwright Fixtures**: Understand how to use Playwright's fixture system to create reusable setup and teardown code
- **Reusability in Tests**: See how centralizing common test setup code makes tests cleaner and easier to maintain

## Helpful Links

- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright Request API](https://playwright.dev/docs/api/class-fixtures#fixtures-request)
- [Playwright Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)

## Tasks

You will add database transaction support to Playwright tests to ensure test data isolation. A transaction lets us group multiple operations into a single unit of work. We can roll back the transaction to undo any changes that were made during the test.

File:

- Test: `tests/e2e/docking-schedule.spec.ts`

Commands:

- Run the frontend `npm run dev:e2e`
- Run the server `npm run server:e2e`
- Run the tests `npm run test:e2e`

The frontend and server will need to be running for the tests to work. No changes are needed to the server code for this exercise, only the tests.

### 1. Create a Database Transaction Fixture

- Extend the base Playwright test object with the new fixture type

### 2. Implement the Transaction Fixture

- Add transaction fixture that starts a transaction before each test
  - Use the `TRANSACTION_BEGIN_PATH` constant to start the transaction
- Add rollback logic to clean up after each test completes
  - Use the `TRANSACTION_ROLLBACK_PATH` constant to rollback the transaction
- Include logging to track transaction lifecycle
- Use try/finally to ensure proper cleanup

### 3. Update Test Cases

- Modify existing test cases to use the transaction fixture, if they modify the database

### 4. Test the Implementation

- Run the test suite to verify:
  - Transaction logs appear in the console
  - Test data is properly isolated between test runs
  - Tests continue to pass with the new transaction wrapper
- Re-run the tests a few times to verify without restarting the server. The tests should not affect each other.
- You can also open the app at `http://localhost:5173/dockings` and verify that the data is the same in between test runs.
