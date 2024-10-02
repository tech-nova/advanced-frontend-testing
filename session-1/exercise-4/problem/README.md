# Exercise 4

## Overview

### **Context**

In this exercise, we’re diving into the `DockingSchedule` component that’s tightly coupled with API calls and the Pinia store. This setup makes testing a real headache because we need to mock almost everything just to get the tests running.

### **Learning Outcome**

By the end of this exercise, you’ll be able to recognize when complex, convoluted tests are a symptom of poor code design. You’ll also gain insights into how testing difficulties can highlight problematic areas in your codebase that need attention.

### **Motivation**

If your tests feel overly complicated, it’s not just a testing issue—it’s usually a code design issue. Being able to spot these warning signs is crucial because it helps us improve both the quality of our code and our tests. This exercise will help you develop an eye for these issues.

### **Problem Statement**

You will be writing tests for a `DockingSchedule` component that interacts heavily with APIs and the Pinia store. The goal is to experience firsthand how complex and tedious testing becomes when a component is poorly designed and tightly coupled.

### **Key Takeaways**

- **Identifying Pain Points**: When tests require a lot of mocks and setups, it’s a sign that the component is doing too much or is too tightly coupled.
- **Complex Tests = Code Smell**: Difficult-to-write and maintain tests often indicate code that needs to be rethought or broken down into smaller pieces.
- **Testing as a Feedback Tool**: Tests that are complicated to write are not just a challenge—they’re feedback from your code telling you it needs improvement. This is especially true of unit tests.

## Tasks

Open up the `DockingSchedule.spec.js` file and complete the tests.

### 1. Create the mocks for the child components

Create mocks for the following components:

- `DockingForm`
- `VideoScanModal`
- `VideoViewerModal`

<details>
  <summary>Hint 1: Mocking the DockingForm component</summary>

```javascript
vi.mock('./DockingForm.vue', () => ({
  default: {
    name: 'DockingForm',
    template: '<div data-testid="docking-form"></div>',
  },
}));
```

- This mock replaces the `DockingForm` component with a simple template that includes a `data-testid`. You don't need the actual component logic.
</details>

<details>
  <summary>Hint 2: Mocking the VideoScanModal component</summary>

```javascript
vi.mock('./VideoScanModal.vue', () => ({
  default: {
    name: 'VideoScanModal',
    template: '<div data-testid="video-scan-modal"></div>',
  },
}));
```

- Similar to `DockingForm`, this mock creates a simple representation of the `VideoScanModal` component.
</details>

<details>
  <summary>Hint 3: Mocking the VideoViewerModal component</summary>

```javascript
vi.mock('./VideoViewerModal.vue', () => ({
  default: {
    name: 'VideoViewerModal',
    template:
      '<div data-testid="video-viewer-modal"></div>',
  },
}));
```

- This mock provides a minimal implementation for the `VideoViewerModal` component.
</details>

### 2. Create mocks for the composable

Create a mock for:

- `useSpacecraft`

<details>
  <summary>Hint 4: Mocking the useSpacecraft composable</summary>

```javascript
vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: () => ({
    spacecrafts: ref([
      {
        id: '1',
        name: 'Spacecraft 1',
        captain: 'Captain 1',
        type: 'type1',
      },
      {
        id: '2',
        name: 'Spacecraft 2',
        captain: 'Captain 2',
        type: 'type2',
      },
    ]),
    loading: ref(false),
    error: ref(null),
  }),
}));
```

- This mock simulates the `useSpacecraft` composable, providing some test spacecraft data and setting `loading` and `error` states.
</details>

### 3. Write Component Rendering tests

You will need to mock Pinia for these to work.

<details>
  <summary>Hint 5: Mocking Pinia for the component rendering tests</summary>

```javascript
import { createTestingPinia } from '@pinia/testing';

render(DockingSchedule, {
  global: {
    plugins: [createTestingPinia()],
  },
});
```

- `createTestingPinia` provides a way to mock the Pinia store. You can use it to simulate your store's state for testing purposes.
</details>

### 4. Mock the network calls

Mock `ofetch`

<details>
  <summary>Hint 6: Mocking ofetch</summary>

```javascript
vi.mock('ofetch', () => ({
  ofetch: vi.fn(),
}));
```

- `vi.mock` is used to mock `ofetch`, which will allow you to simulate API calls during tests.
</details>

### 5. Write tests that verify correct Network Calls

<details>
  <summary>Hint 7: Testing network calls</summary>

```javascript
const mockDockings = [
  /* some mock docking data */
];

vi.mocked(ofetch).mockResolvedValueOnce(mockDockings);

render(DockingSchedule, {
  global: {
    plugins: [createTestingPinia()],
  },
});

expect(ofetch).toHaveBeenCalledWith('/api/dockings');
```

- Mock `ofetch` to return your test data, and then assert that the correct API endpoint was called.
</details>

### 6. Write tests for Docking Scans

<details>
  <summary>Hint 8: Testing Docking Scan buttons</summary>

```javascript
expect(screen.queryByText('View Scan')).toBeNull();
expect(screen.getByText('Record Scan')).toBeTruthy();
```

- Use `queryByText` to check if elements are not rendered, and `getByText` to verify if they exist in the DOM.
</details>
