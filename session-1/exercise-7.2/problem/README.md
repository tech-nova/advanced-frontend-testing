# Exercise 7.2

## Overview

### **Context**

In this exercise, we’re working with the `DockingSchedule` component, which relies on two stores through composables: the `dockingStore` and the `spacecraftStore`. Both stores fetch data from an API, making testing tricky due to the need to mock multiple data points.

Instead of creating complex mock objects for each store, we’ll use Mock Service Worker (MSW) to mock API responses at the network layer. This approach will simplify our tests significantly by providing a single point of control for all our mock data.

### **Learning Outcome**

By the end of this exercise, you will understand how to use MSW to replace multiple mocks with a single, powerful tool. You’ll learn to set up MSW, create reusable helpers, and refactor existing tests for the Docking Schedule component to use network-level mocks, making them more robust and easier to maintain.

### **Motivation**

Mocking at the network layer with MSW allows us to handle all mock data in one place, drastically reducing the complexity of our tests. This not only simplifies the test setup but also makes it easier to maintain as our codebase evolves. It’s a powerful technique for managing dependencies like API calls, which are common in real-world applications.

### **Problem Statement**

You will start by adding Mock Service Worker handlers to our app, so you can get a feel for how they work. Then, we’ll move on to using MSW in our tests.

### **Key Takeaways**

- **Single Point of Control with MSW**: Learn how to replace multiple, scattered mocks with a single, centralized mock layer at the network level.
- **Easier Test Maintenance**: Discover how using MSW simplifies test maintenance, as you only need to update your mocks in one place when API responses change.
- **Improved Test Reliability**: Experience how tests become more reliable and realistic by allowing stores to fetch data as they would in production, rather than relying on artificial store mocks.

## Tasks

### 1. Write `useMockDockings` to mock the `GET /dockings` endpoint.

In this task, you will write the `useMockDockings` function that mocks the `GET /dockings` API request. Use MSW to intercept the network call and return mock data for the dockings.

<details>
  <summary>Hint 1: Setting up MSW for the `/dockings` endpoint</summary>

```javascript
useMockDockings: (mockDockings) => {
  server.use(
    http.get('/api/dockings', () => {
      return HttpResponse.json(mockDockings);
    })
  );
},
```

This mock intercepts the `GET /dockings` call and returns an array of docking objects.

</details>

### 2. Write `useMockSpacecrafts` to mock the `GET /spacecrafts` endpoint.

Next, write the `useMockSpacecrafts` function to mock the API response for fetching spacecraft data. This function should provide mock spacecraft objects that will be returned by the `GET /spacecrafts` endpoint.

<details>
  <summary>Hint 2: Setting up MSW for the `/spacecrafts` endpoint</summary>

```javascript
useMockSpacecrafts: (mockSpacecrafts) => {
  server.use(
    http.get('/api/spacecrafts', () => {
      return HttpResponse.json(mockSpacecrafts);
    })
  );
};
```

This mock intercepts the `GET /spacecrafts` call and returns a list of spacecrafts.

</details>

### 3. Write `useErrorFetchingDockings` to mock the `GET /dockings` endpoint to return an error.

In this task, you’ll create a function to simulate an error when fetching dockings. Use MSW to mock the network error for the `GET /dockings` API call.

<details>
  <summary>Hint 3: Mocking an error for the `/dockings` endpoint</summary>

```javascript
useErrorFetchingDockings: () => {
  server.use(
    http.get('/api/dockings', () => {
      return HttpResponse.error();
    })
  );
};
```

This mock intercepts the `GET /dockings` call and returns a 500 error status with a custom error message.

</details>

### 4. Update the tests to use the mocks

Now it's time to use our new mock objects to update the tests for the `DockingSchedule` component.

### 5. Compare this approach to your first attempt at mocking everything

The first time we wrote tests for the `DockingSchedule` component, we created a bunch of mock objects. This was a lot of work!

How does this approach compare to your first attempt at mocking everything?

What are the benefits (and drawbacks) of this approach?
