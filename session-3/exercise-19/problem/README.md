# Exercise 19

## Overview

### **Context**

We're working with a video recording feature in our docking system that requires webcam access. This presents an interesting challenge in end-to-end testing, where we typically aim to minimize mocking. However, hardware dependencies like webcams can't practically be tested with real devices in automated tests.

### **Learning Outcome**

By the end of this exercise, you'll understand that even end-to-end tests have boundaries where reality meets simulation. You'll learn the importance of being explicit about what parts of your system are being faked and why those decisions were made.

### **Motivation**

While we often think of end-to-end tests as "testing everything for real," this is a misconception. Every test environment has elements that must be simulated or mocked. Understanding and documenting these boundaries is crucial for maintaining transparent and maintainable tests.

### **Problem Statement**

You need to write end-to-end tests for a video recording feature that requires webcam access. The challenge is not just in implementing the mock, but in being explicit about what is being faked and understanding the implications of those decisions for your test coverage.

### **Key Takeaways**

- **Test Boundaries**: Understand that all tests, even end-to-end tests, have elements that must be simulated
- **Explicit Mocking**: Learn to be clear and intentional about what parts of your system are being faked
- **Test Design**: How to design tests that acknowledge their limitations while still providing valuable coverage
- **Reality vs Simulation**: Recognize the balance between testing real behavior and necessary simulation

## Helpful Links

- [Playwright Test Assertions](https://playwright.dev/docs/test-assertions)
- [Working with Locators](https://playwright.dev/docs/locators)
- [Playwright Timeouts and Delays](https://playwright.dev/docs/api/class-page#page-wait-for-timeout)
- [Element Visibility Assertions](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible)
- [Working with Video Elements](https://playwright.dev/docs/input#upload-files)

## Tasks

You will write and debug end-to-end tests for the video recording feature in the docking system.

File:

- Test: `tests/e2e/video-scan.spec.ts`

Commands:

- Run the frontend: `npm run dev:e2e`
- Run the server: `npm run server:e2e`
- Run the tests: `npm run test:e2e`
  - With UI: `npm run test:e2e:ui`
  - Running a specific test suite: `npm run test:e2e -- video`
  - Or with UI: `npm run test:e2e:ui -- video`

### 1. Write Initial Video Recording Test (This Will Fail!)

- In `tests/e2e/video-scan.spec.ts`, implement the 'records a video scan' test
- Use the `npm run test:e2e:ui` command to run the test and see the webcam working (or not working)
- Try to verify the basic flow:
  - Modal verification after clicking "Record Scan"
  - Recording start/stop flow
  - Preview verification
  - Submission checks
  - Final "View Scan" button verification
- Run the test and observe how it fails because the video recording doesn't work
- **Note**: This step is intentionally designed to fail! Without mocking the webcam functionality, the video recording features won't work properly. This is expected and will be fixed in the next step.

### 2. Add Webcam Mocking

- Now that you've seen the video recording doesn't work, let's fix it
- Import the `mockWebcam` utility from `../mocks/webcam`
- Add the webcam mock to the `beforeEach` block with `await mockWebcam()`
- Run the test again to verify the video recording now works as expected

### 3. Complete the Working Test

- With the webcam properly mocked, add detailed verifications:
  - Countdown sequence (3,2,1)
  - Recording timer starting at "00:00"
  - Add a realistic recording duration (3 seconds) just to see the webcam working in UI mode
  - Preview section with video controls
  - Modal closing after submission
