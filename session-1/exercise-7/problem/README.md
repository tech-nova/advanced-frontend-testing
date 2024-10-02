# Exercise 7

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

In this exercise, you will be writing the MSW handlers for our app, focusing on the `DockingSchedule` component's API interactions.

### 1. Write the `GET` handlers for lists of resources

Write handlers to respond with lists of spacecrafts, dockings, and notifications when the following API endpoints are called:

- `/spacecrafts`
- `/dockings`
- `/notifications`

<details>
  <summary>Hint 1: How to structure the GET handler</summary>

```javascript
http.get(`${API_BASE}/spacecrafts`, () => {
  return HttpResponse.json(spacecraft);
});
```

This example shows how you might structure the handler for retrieving the list of spacecrafts. Use the same approach for other resource lists.

</details>

### 2. Write the `GET` handlers for individual resources

Write handlers to return individual spacecrafts and dockings by their `id` when the following API endpoints are called:

- `/spacecrafts/:id`
- `/dockings/:id`

<details>
  <summary>Hint 2: Fetching an individual resource by ID</summary>

```javascript
http.get(`${API_BASE}/spacecrafts/:id`, ({ params }) => {
  const { id } = params;
  const found = spacecraft.find((s) => s.id === id);
  return found
    ? HttpResponse.json(found)
    : new HttpResponse(null, { status: 404 });
});
```

This example shows how to fetch a spacecraft by its `id`. You can use a similar approach for dockings.

</details>

<details>
  <summary>Hint 3: Finding related spacecraft data for a docking</summary>

When handling a POST request for creating a new docking, you can use the `spacecraftId` from the request body to find the related spacecraft data:

```javascript
http.post(`${API_BASE}/dockings`, async ({ request }) => {
  const body = await request.json();
  if (
    !body ||
    typeof body !== 'object' ||
    !('spacecraftId' in body)
  ) {
    return new HttpResponse(null, {
      status: 400,
      statusText: 'Invalid request body',
    });
  }

  const spacecraftId = body.spacecraftId;
  const foundSpacecraft = spacecraft.find(
    (s) => s.id === spacecraftId
  );

  if (!foundSpacecraft) {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Spacecraft not found',
    });
  }

  const newDocking = {
    ...body,
    id: String(dockings.length + 1),
    spacecraftId: foundSpacecraft.id,
    status: 'scheduled',
  };

  dockings.push(newDocking);
  return HttpResponse.json(newDocking, { status: 201 });
});
```

This handler checks if the spacecraft exists before creating the docking, ensuring that the docking is associated with a valid spacecraft.

</details>

### 3. Write the `POST` handlers for creating resources

Write handlers to allow the creation of new spacecrafts, dockings, and notifications via the following API endpoints:

- `/spacecrafts`
- `/dockings`
- `/notifications`

<details>
  <summary>Hint 4: Handling POST requests</summary>

```javascript
http.post(
  `${API_BASE}/spacecrafts`,
  async ({ request }) => {
    const body = await request.json();
    const newSpacecraft = {
      ...body,
      id: String(spacecraft.length + 1),
    };
    spacecraft.push(newSpacecraft);
    return HttpResponse.json(newSpacecraft, {
      status: 201,
    });
  }
);
```

This shows how you can handle a POST request to create a new spacecraft. You can use a similar pattern for dockings and notifications.

</details>

### 4. Write the `PUT` handler for updating a spacecraft

Write a handler to allow the update of an existing spacecraft using the following API endpoint:

- `/spacecrafts/:id`

<details>
  <summary>Hint 5: Handling PUT requests</summary>

```javascript
http.put(
  `${API_BASE}/spacecrafts/:id`,
  async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const found = spacecraft.find((s) => s.id === id);
    if (found) {
      const updatedSpacecraft = { ...found, ...body };
      spacecraft = spacecraft.map((s) =>
        s.id === id ? updatedSpacecraft : s
      );
      return HttpResponse.json(updatedSpacecraft);
    }
    return new HttpResponse(null, { status: 404 });
  }
);
```

This shows how you can handle a PUT request to update a spacecraft by `id`.

</details>

### 5. Add error handling where needed

Ensure that all your handlers include appropriate error handling. For example, handle missing or invalid data when creating or updating resources.

<details>
  <summary>Hint 6: Handling invalid request data</summary>

```javascript
http.post(
  `${API_BASE}/spacecrafts`,
  async ({ request }) => {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Invalid request body',
      });
    }
    // Rest of the handler...
  }
);
```

This shows how you can return a `400` error when the request body is invalid.

</details>
