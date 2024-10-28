# Exercise 13

## Overview

### **Context**

In this exercise, we're continuing to explore the benefits of testing from a user's perspective using Vue Testing Library, as opposed to testing implementation details. We'll be working with the `SpacecraftList` and `SpacecraftForm` components and their tests, then refactoring the underlying components to see how different testing approaches hold up.

### **Learning Outcome**

By the end of this exercise, you'll understand the advantages of writing tests that focus on user interactions and outcomes rather than implementation details. You'll see firsthand how this approach leads to more resilient tests that don't break when internal implementations change.

### **Motivation**

Writing tests that are too closely tied to implementation details can lead to brittle tests that break easily when the code is refactored or updated. By focusing on user behavior and outcomes, we can create more robust tests that continue to work even as the underlying code evolves. This approach saves time and reduces frustration in the long run, especially in larger projects where frequent changes are common.

### **Problem Statement**

You will be working with existing components and their tests.

Your task is to refactor the underlying components and observe how different types of tests react to these changes. You'll see that tests focused on implementation details will break and require updates, while tests written from a user's perspective (here, using Vue Testing Library) will remain intact.

### **Key Takeaways**

- **Test Resilience**: Experience firsthand how user-focused tests remain stable even when internal implementations change.
- **Refactoring Confidence**: Gain confidence in refactoring code when backed by user-centric tests that don't break with implementation changes.
- **Reduced Maintenance**: Recognize how this testing approach can significantly reduce the time spent updating tests during code refactors.

## Helpful Links

- [CSS Grid](https://www.joshwcomeau.com/css/interactive-guide-to-grid/)
- [Role attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Vue Testing Library queries](https://testing-library.com/docs/queries/about/)
- [Mock Server Worker — server.use](https://mswjs.io/docs/api/setup-server/use/)
- [Vue Testing Library — waitFor](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor)

## Tasks

### 1. Spacecraft List Component

1. Update the SpacecraftList component to use a `<div>` based layout with Flexbox or CSS Grid (whichever you prefer)

<details>
  <summary>Hint 1: CSS Grid structure</summary>

```html
<div role="table">
  <div class="grid grid-cols-4" role="row">
    <div
      v-for="header in [
        'Name',
        'Type',
        'Captain',
        'Actions',
      ]"
      :key="header"
      role="columnheader"
    >
      {{ header }}
    </div>
  </div>
  <div role="rowgroup">
    <div
      v-for="spacecraft in spacecrafts"
      :key="spacecraft.id"
      class="grid grid-cols-4"
      role="row"
    >
      <div
        v-for="prop in ['name', 'type', 'captain']"
        :key="prop"
        role="cell"
      >
        {{ spacecraft[prop] }}
      </div>
      <div role="cell">
        <!-- Edit link -->
      </div>
    </div>
  </div>
</div>
```

Make sure to include the `role` attributes to make the "table" accessible. (Yes, it's not best practice to use the `role` attribute like this, but we'll do it for the exercise).

</details>

2. Run your tests and see which ones break (and which don't)

<details>
  <summary>Hint 2: Which tests break</summary>

The `renders table headers correctly` test should break because it's looking for a `<thead>` element, which no longer exists.

</details>

<details>
  <summary>Hint 3: Which tests pass</summary>

Notice that `renders a list of spacecrafts` test still passes

</details>

3. Update the test to use Vue Testing Library and make it less brittle

- Update the broken test from step 2

<details>
  <summary>Hint 4: Vue Testing Library query</summary>

```javascript
const headers = screen.getAllByRole('columnheader');
expect(headers).toHaveLength(4);
```

This will check that there are 5 headers and that the first one has the text "Name".

</details>

4. Revert your change to `SpacecraftList.vue` and re-run your tests

- Use the command `git stash push src/components/SpacecraftList.vue` to stash your changes
- Then use `git stash pop` to restore your changes
- You'll see that your tests pass even when you change the implementation details of the component

### 2. Spacecraft Form Component

Now we'll follow a similar process for the `SpacecraftForm` component:

1. Update the SpacecraftForm component by rearranging the order of the input elements

<details>
  <summary>Hint 5: Rearranging form fields</summary>

Before:

1. Name
2. Type
3. Captain

After:

1. Captain
2. Name
3. Type

</details>

2. Run your tests and see which ones break (and which don't)

<details>
  <summary>Hint 5: Which tests break</summary>

The tests that fail are:

- "populates form fields when editing an existing spacecraft"
- "submits the form with correct data for an edited spacecraft"

</details>

<details>
  <summary>Hint 6: Which tests pass</summary>

The "submits the form with correct data for a new spacecraft" test still passes.

</details>

3. Update "submits the form with correct data for an edited spacecraft" test

- This implementation will be very similar to the "add new" test
- Hint: we'll need to use `useMockEditSpacecraft` and `useMockSpacecrafts`

<details>
  <summary>Hint 7: Adding `useMockEditSpacecraft` to `useMockServer`</summary>

```javascript
useMockEditSpacecraft: () => {
  server.use(
    http.put(
      '/api/spacecrafts/:id',
      async ({ request, params }) => {
        const updatedSpacecraft =
          (await request.json()) as Spacecraft;
        return HttpResponse.json(
          {
            ...updatedSpacecraft,
            id: params.id,
          },
          { status: 200 }
        );
      }
    )
  );
},
```

</details>

4. Update "populates form fields when editing an existing spacecraft" test

- We'll need to wait for the form to be populated with existing data (use `waitFor` from Vue Testing Library)

<details>
  <summary>Hint 8: Waiting for form fields to be populated</summary>

```javascript
await waitFor(async () => {
  const nameInput = await findByLabelText('Name');
  const typeInput = await findByLabelText('Type');
  const captainInput = await findByLabelText('Captain');

  expect(nameInput.value).toBe('Enterprise');
  expect(typeInput.value).toBe('Explorer');
  expect(captainInput.value).toBe('James Kirk');
});
```

</details>

5. Revert your changes to `SpacecraftForm.vue` and re-run your tests

- Use the command `git stash push src/components/SpacecraftForm.vue` to stash your changes
- Then use `git stash pop` to restore your changes
- Your tests should pass even when you change the implementation details of the component

### 3. (Stretch) Changing Routes

- What happens to the creating/updating spacecrafts when we modify the routes in our app in `src/router/index.js`?
- How can we make our tests less brittle in this scenario?

<details>
  <summary>Hint 9: Handling route modifications</summary>

```javascript
// src/router/index.js
export const routes = [
  // ...
];
```

```javascript
// src/components/SpacecraftForm.spec.js
import { routes } from '@/router';

// ...

router = createRouter({
  history: createWebHistory(),
  routes,
});
```

We've discovered a hidden area where we were actually faking part of our app — the routes! By importing the `routes` array from `src/router/index.js`, we are now testing our app more fully.

</details>
