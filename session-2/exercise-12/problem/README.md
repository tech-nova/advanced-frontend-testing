# Exercise 12: Testing User Interactions with Vue Testing Library

## Overview

### **Context**

In this exercise, we'll be adding interactions to our previous test in `SpacecraftForm.spec.js`. Our approach will emphasize testing from a user's perspective, focusing on how users interact with the form rather than the internal implementation details.

### **Learning Outcome**

By the end of this exercise, you'll be able to write tests that simulate user interactions with forms, validate form submissions, and verify form behavior without relying on implementation specifics. This approach ensures your tests remain robust even as the underlying implementation changes (which we'll see in the next exercise).

### **Motivation**

Testing from a user's perspective is crucial for creating reliable and maintainable tests. By focusing on what the user sees and does, rather than on implementation details, we create tests that are less brittle and more closely aligned with actual user experiences. This approach helps catch issues that matter to users and makes refactoring easier.

### **Problem Statement**

You will be working with a `SpacecraftForm` component that allows users to submit information about a new spacecraft. Your task is to finish writing the test that simulates user interactions with this form, including filling out fields, submitting the form, and verifying the form submission.

### **Key Takeaways**

- **User-Centric Testing**: Learn to write tests that focus on user interactions and visible outcomes rather than implementation details.
- **Form Interaction Testing**: Gain experience in simulating user input, form submissions, and validating form behavior.
- **Accessibility-Focused Selectors**: Understand the importance of using accessible selectors (like `getByRole`, `getByLabelText`) that align with how users and assistive technologies interact with your app.
- **Asynchronous Testing**: Practice writing tests that handle asynchronous operations, such as form submissions and validation.

## Helpful Links

- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Firing events with Vue Testing Library](https://testing-library.com/docs/dom-testing-library/api-events)
- [Vue Router](https://router.vuejs.org/)
- [Router isReady](https://router.vuejs.org/api/interfaces/Router.html#isReady)
- [Mock POST requests with MSW](https://mswjs.io/docs/api/http/#httppost)

## Tasks

Now we'll update our test to check for correct form submission and validation.

### 1. Update Mock Server

- Modify `useMockServer.ts` to add a new `useMockCreateSpacecraft` function

<details>
  <summary>Hint 1: Structure of the useMockCreateSpacecraft function</summary>

```typescript
export const useMockCreateSpacecraft = () => {
  server.use(
    http.post('/api/spacecrafts', async ({ request }) => {
      // Handler logic
    })
  );
};
```

This function should use MSW to mock a POST request for creating a new spacecraft.

</details>

### 2. Implement form field updates in the test

- Populate the form fields with data using `getByLabelText`.

<details>
  <summary>Hint 2: Using fireEvent to update form fields</summary>

```javascript
await fireEvent.update(
  getByLabelText('Name'),
  'New Spacecraft'
);
```

- Use `fireEvent.update()` to simulate user input in form fields.
- The `getByLabelText()` function helps locate form inputs by their associated label text.
</details>

### 3. Update the SpacecraftForm component

- Improve the accessibility of the form fields so our tests pass

<details>
  <summary>Hint 3: Fixing the form fields</summary>

```html
<label for="spacecraft-name">Name</label>
<input
  id="spacecraft-name"
  v-model="form.name"
  type="text"
/>
```

- Ensure each input has a corresponding label with a matching `for` attribute.
- The `id` of the input should match the `for` attribute of the label.
</details>

### 4. Add form submission to the test

- Add verification for successful form submission

<details>
  <summary>Hint 4: Simulating form submission</summary>

```javascript
await fireEvent.submit(getByRole('form'));
```

Use `fireEvent.submit()` to simulate the form submission event.

</details>

<details>
  <summary>Hint 5: Verifying successful submission</summary>

```javascript
const newSpacecraft = await findByText('New Spacecraft');
expect(newSpacecraft).toBeDefined();
```

- After submission, check if the new spacecraft name appears in the updated list.
- Use `findByText()` to locate the element containing the new spacecraft name.
</details>

### 5. Update the SpacecraftForm component (again)

- Improve the accessibility of the form so our tests pass (again)

<details>
  <summary>Hint 6: Fixing the form</summary>

```html
<form
  @submit.prevent="handleSubmit"
  aria-label="Spacecraft Form"
>
  <!-- form contents -->
</form>
```

Add an `aria-label` attribute to the form element so that screen readers can identify the purpose of the form.

</details>

### 6. (Stretch) Refactor to use `userEvent`

- Use `userEvent` to simulate user interactions
- [Link to docs](https://testing-library.com/docs/user-event/intro/)
