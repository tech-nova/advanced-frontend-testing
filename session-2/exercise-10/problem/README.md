# Exercise 10

## Overview

### **Context**

In this exercise, we'll be refactoring the tests for the `SpacecraftList` component. The current tests use Vue Test Utils, but we want to transition to using Vue Testing Library for its more user-centric approach to testing.

### **Learning Outcome**

By the end of this exercise, you'll be able to:

- Use Vue Testing Library to write more robust and user-centric tests
- Understand the differences between Vue Test Utils and Vue Testing Library
- Refactor existing tests to use Vue Testing Library's query methods

### **Motivation**

Vue Testing Library encourages writing tests that closely resemble how users interact with your application. This approach leads to easier to write tests, as well as more maintainable tests that are less likely to break due to implementation changes, as long as the user experience remains the same.

### **Problem Statement**

You will refactor the existing tests for the `SpacecraftList` component, replacing Vue Test Utils methods with Vue Testing Library queries. This will involve changing how we select elements and make assertions. In another exercise, we'll look at how to interact with the component using Vue Testing Library.

### **Key Takeaways**

- Understanding the philosophy behind Vue Testing Library
- Familiarity with Vue Testing Library's query methods
- Recognizing the benefits of testing from a user's perspective

## Helpful Links

- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Vue Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

## Tasks

Update the following tests using Vue Testing Library queries:

### 1. Component rendering

### 1.1 Update the test 'renders the SpacecraftList component without errors'

- Use the `getByRole` query
<details>
  <summary>Hint 1: Using getByRole to find the heading</summary>

```javascript
const heading = screen.getByRole('heading');
```

</details>

- Use exact string matching with the `name` property.
<details>
  <summary>Hint 2: Using exact string matching</summary>

```javascript
const heading = screen.getByRole('heading', {
  name: 'Spacecraft Management',
});
```

By passing `name` to `getByRole`, we ensure that we're doing an exact match on the text.

</details>

### 1.2 Update the test 'displays the "Add Spacecraft" button with correct text'

- Use the `getByRole` query
- Use regex matching for the `name` property, so we can do substring matching and avoid weird whitespace issues

  - Try matching for "add"
  - then use regex "add" for substring matching (avoids weird whitespace issues)

<details>
  <summary>Hint 3: Using regex for substring matching</summary>

```javascript
const button = screen.getByRole('button', {
  name: /Add/,
});
```

</details>

- Then add use the `i` flag for case insensitive matching on the regex
<details>
  <summary>Hint 4: Using the `i` flag for case insensitive matching</summary>

```javascript
const button = screen.getByRole('button', {
  name: /add/i,
});
```

</details>

### 2. Spacecraft list

### 2.1 Update the test 'renders a list of spacecrafts'

- Use the `findAllByRole` query
  [hint: `find\*` will wait for the element to load (uses polling)]

<details>
  <summary>Hint 5: Using findAllByRole</summary>

```javascript
const spacecrafts = await screen.findAllByRole('row');
const table = await screen.findByRole('table');
```

The `find*` queries will wait for the element to load (uses polling). The `*all*` queries will return an array of elements.

</details>

- Use the `getByText` query as well
<details>
  <summary>Hint 6: Using getByText</summary>

```javascript
expect(screen.getByText('Apollo')).toBeDefined();
expect(screen.getByText('Lunar Module')).toBeDefined();
expect(screen.getByText('Neil Armstrong')).toBeDefined();
```

</details>

### 2.2 Update the test 'removes loading state and displays spacecrafts after loading'

<details>
  <summary>Hint 7: Checking that the loading state is removed</summary>

```javascript
await waitForElementToBeRemoved(() =>
  screen.queryByText(/loading\.\.\./i)
);
```

The `waitForElementToBeRemoved` helper will wait for the element to be removed from the DOM.

</details>

### 3. Navigation links

### 3.1 Update the test 'has correct edit links for each spacecraft'

- Destructure the queries you use from `render` instead of using `screen`

<details>
  <summary>Hint 8: Destructuring queries from render</summary>

```javascript
const { getByRole } = renderComponent(SpacecraftList);
```

When you destructure the queries from `render`, you can use them directly in the test without referring to `screen`. These are bound to the wrapper instead of the entire document.

</details>

### 4. (Stretch) Refactor other tests to use Vue Testing Library
