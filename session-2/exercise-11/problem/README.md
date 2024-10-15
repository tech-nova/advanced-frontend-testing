# Exercise 11

## Overview

### **Context**

In previous exercises, we've focused on testing individual components. However, real-world applications often involve complex user flows that span multiple routes and components. In this exercise, we'll explore how to test these flows more comprehensively using Vue Router inside our tests using Vue Testing Library.

### **Learning Outcome**

By the end of this exercise, you'll be able to write tests that simulate full user journeys across different routes in your Vue application. You'll learn how to set up Vue Router in your tests, navigate between pages, and make assertions about the application state at different points in the user flow.

### **Motivation**

Testing from the user's perspective is crucial for ensuring that your application works as expected in real-world scenarios. By simulating actual user journeys in your tests, you can catch issues that might not be apparent when testing components in isolation. This approach lets us write fully integrated tests for our application.

### **Problem Statement**

You will write an integration test that simulates a user adding a new spacecraft and then navigating to the spacecraft list to verify that the new spacecraft appears. This will involve setting up Vue Router in your test environment, rendering the entire App component, and making assertions at different stages of the user journey.

In this exercise, we will focus on navigating between pages. The next exercise will cover form submission and assertions.

### **Key Takeaways**

- **Full App Testing**: Learn how to render and test your entire Vue application, including routing, in a test environment.
- **User Flow Simulation**: Understand how to write tests that mimic real user interactions across multiple pages.
- **Router Integration in Tests**: Gain experience in setting up and using Vue Router within your test suite.
- **Comprehensive Assertions**: Learn to make assertions about the application state at different points in a user journey, providing a more complete picture of application behavior.

## Helpful Links

- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Vue Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Vue Router](https://router.vuejs.org/)
- [Router isReady](https://router.vuejs.org/api/interfaces/Router.html#isReady)

## Tasks

In this exercise we'll add an integration test that handles navigation between pages.

### 1. Modify Router Configuration

- Add a new route for the spacecraft list in the router configuration

<details>
  <summary>Hint 1: Adding a new route</summary>

```javascript
{
  path: '/spacecraft',
  component: SpacecraftList,
  name: 'SpacecraftList',
},
```

Add this route configuration to the existing router setup in the test file.

</details>

### 2. Refactor Spacecraft Form Test

- Update the "submits the form with correct data for a new spacecraft" test in `SpacecraftForm.spec.js`:
  - Implement navigation and rendering of the entire App
  - Add assertions for navigation

<details>
  <summary>Hint 2: Importing and rendering the App component</summary>

```javascript
import { render } from '@testing-library/vue';
import App from '@/App.vue';

// Inside the test
const { getByRole, findByRole } = render(App, {
  global: {
    plugins: [router],
  },
});
```

This sets up the test to render the entire App component, which allows for testing navigation between different pages.

</details>

<details>
  <summary>Hint 3: Navigating to the add spacecraft page</summary>

```javascript
// Navigate to the add spacecraft page
router.push('/spacecraft/add');
await router.isReady();

// Assert that we're on the right page
expect(
  getByRole('heading', { name: 'Add Spacecraft' })
).toBeDefined();
```

This code navigates to the add spacecraft page and checks if we're on the correct page.

</details>

<details>
  <summary>Hint 4: Navigating to the spacecraft list page</summary>

```javascript
// Navigate to the spacecraft list page
router.push('/spacecraft');
await router.isReady();

// Wait for the navigation to complete
await findByRole('heading', {
  name: 'Spacecraft Management',
});
```

This code navigates to the spacecraft list page and waits for the navigation to complete.

</details>

<details>
  <summary>Hint 5: Putting it all together</summary>

```javascript
import { render } from '@testing-library/vue';
import App from '@/App.vue';

// Inside the test
const { getByRole, findByRole } = render(App, {
  global: {
    plugins: [router],
  },
});

// Navigate to the add spacecraft page
router.push('/spacecraft/add');
await router.isReady();

// Assert that we're on the right page
expect(
  getByRole('heading', { name: 'Add Spacecraft' })
).toBeDefined();

// Navigate to the spacecraft list page
router.push('/spacecraft');
await router.isReady();

// Wait for the navigation to complete
await findByRole('heading', {
  name: 'Spacecraft Management',
});
```

This combined approach allows you to test navigation between different components in your app.

</details>

### 3. (Stretch) Add router navigation to other tests
