# Exercise 16

## Overview

### **Context**

We're working with the docking schedule management interface, which displays a table of scheduled dockings and allows creating new ones. This exercise introduces Playwright for end-to-end testing, focusing on basic interactions like verifying page content and form submissions.

### **Learning Outcome**

By the end of this exercise, you'll understand how to write basic Playwright tests to verify page content, table structures, and form interactions. You'll gain hands-on experience with common testing patterns for web applications.

### **Motivation**

End-to-end testing is crucial for ensuring your application works correctly from a user's perspective. Playwright provides powerful tools to automate browser interactions, making it easier to verify complex user flows. Learning these basics will prepare you for more advanced testing scenarios.

### **Problem Statement**

You will write Playwright tests to verify the docking schedule interface works correctly. This includes checking the page navigation, verifying table contents, and optionally testing the creation of new docking schedules through form interactions.

### **Key Takeaways**

- **Basic Playwright Usage**: Learn how to write and structure Playwright tests for web applications
- **Table Testing**: Understand how to verify complex table structures and their contents
- **Form Interactions**: Gain experience testing user interactions with forms and modals
- **Test Organization**: Learn best practices for organizing end-to-end tests and setting up test prerequisites

## Helpful Links

- [Playwright Page Navigation](https://playwright.dev/docs/navigations)
- [Playwright Test Hooks](https://playwright.dev/docs/api/class-test#test-before-each)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Testing Tables with Playwright](https://playwright.dev/docs/locators#locate-by-role)
- [Filling Form Inputs](https://playwright.dev/docs/input)
- [Working with Select Elements](https://playwright.dev/docs/api/class-locator#locator-select-option)

## Tasks

Test the docking schedule management interface for the space station. You'll implement tests to verify the docking list display and new docking creation functionality.

File:

- Test: `tests/e2e/docking-schedule.spec.ts`

Commands:

- Run the frontend `npm run dev:e2e`
- Run the server `npm run server:e2e`
- Run the tests `npm run test:e2e`

The frontend and server will need to be running for the tests to work. No changes are needed to the server code for this exercise, only the tests.

### 1. Set Up Test Navigation

- In the test file's `beforeEach` hook, add navigation to the dockings page using `DOCKINGS_PATH`

### 2. Test Docking Schedule Display

- Create a test that verifies the "Docking Schedule" page heading
- Verify all required table columns are present:
  - Spacecraft, Captain, Docking Time, Docking Bay, Status, and Actions
- Confirm the table contains the correct number of entries

### 3. (Stretch) Test New Docking Creation

- Create a test that schedules a new docking:
  - Open the scheduling modal
  - Select a spacecraft
  - Set a future docking time
  - Assign a docking bay
  - Submit the form
- Verify the new docking appears in the table correctly
