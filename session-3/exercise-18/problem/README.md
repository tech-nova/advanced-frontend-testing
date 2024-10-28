# Exercise 18

## Overview

### **Context**

We're working with the `DockingForm` component and its tests. The test suite has been exhibiting inconsistent behavior, sometimes passing and sometimes failing when run multiple times.

### **Learning Outcome**

By the end of this exercise, you'll understand how to investigate and diagnose the root cause of flaky tests, developing skills to determine whether the issue lies in the test implementation or the application code itself.

### **Motivation**

Flaky tests are a common challenge in software development that can erode team confidence in the test suite. When tests pass and fail unpredictably, it's crucial to develop a systematic approach to identify and fix the underlying cause, whether it's in the test suite or the application code.

### **Problem Statement**

The tests for the `DockingForm` component are showing inconsistent results across multiple runs. Your task is to investigate why these tests are flaky and determine the root cause of the inconsistency. This exercise will help you develop strategies for debugging unreliable tests.

### **Key Takeaways**

- **Non-Determinism**: Understand how non-deterministic behavior (like timers, random values, or race conditions) in either the application code or test implementation can lead to test flakiness
- **Test Design**: Understand the characteristics of reliable test design and common pitfalls that can lead to flakiness
- **Debugging Strategy**: Develop a methodical approach to determining whether inconsistent test results stem from test implementation or application behavior

## Helpful Links

- [Playwright Test Retry](https://playwright.dev/docs/test-retries)
- [Playwright Test UI Mode](https://playwright.dev/docs/test-ui-mode)

## Tasks

You will learn how to identify, debug, and fix flaky tests by investigating an intermittently failing test case.

File:

- Test: `tests/e2e/docking-schedule.spec.ts`

Commands:

- Run the frontend: `npm run dev:e2e`
- Run the server: `npm run server:e2e`
- Run the tests: `npm run test:e2e`
  - With UI: `npm run test:e2e:ui`
  - Running a specific test suite: `npm run test:e2e -- docking`

### 1. Observe the Flaky Test

- Run the test suite multiple times (at least 10 runs)
- Tests can also be run with `npm run test:e2e:ui` to use the UI to run the tests

### 2. Debug the Source

- Determine if the flakiness comes from:
  - Test implementation (async timing, setup/teardown)
  - Application code (race conditions, state management, non-deterministic behavior)
- Note: there is an intentional problem in the test/code somewhere to cause the flakiness

### 3. Fix the Issue

- If it's a test issue:

  - Review async handling
  - Check test isolation
  - Verify setup/teardown

- If it's application code:
  - Fix race conditions
  - Address state management issues
  - Ensure proper async/await usage

### 4. Verify the Fix

- Run the test suite multiple times again (at least 10 runs)
- The tests should now pass all the time
