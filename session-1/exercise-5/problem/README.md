# Exercise 5

## Overview

### **Context**

The `DockingSchedule` component previously had multiple tightly coupled dependencies. Testing this module required mocking all of them, making it complicated and error-prone. We've now refactored it to use a single `useDockings` composable that abstracts away all the complex interactions, which should simplify our tests.

### **Learning Outcome**

By the end of this exercise, you will see how well-modularized code makes our test a lot simpler and less error-prone.

### **Motivation**

Why is this important? Refactoring code helps us keep our logic clean and organized, making our tests less fragile and easier to maintain. In real-world projects, this approach can save time and reduce frustration when writing or maintaining tests.

### **Problem Statement**

You’ve already written tests for the `DockingSchedule` component, but it wasn’t very fun. Now, we’ll explore how the new design makes testing simpler and more efficient by mocking just the two composables instead of multiple different dependencies.

### **Key Takeaways**

- **Simplified Testing**: Using the `useDockings` composable allows us to test the `DockingSchedule` module with fewer mocks, focusing only on the essential interactions.
- **Better Abstraction, Better Tests**: Understand how composables help abstract complex logic and how this impacts the ease and reliability of our tests.
- **Improved Code Maintenance**: Recognize that reducing tightly coupled dependencies makes both the code and tests more maintainable, especially as the application grows and changes over time.

---

## Tasks

In this exercise, you’ll write tests for the `DockingSchedule` component.

### 1. Mock child components

Create mocks for the following child components that are used inside the `DockingSchedule` component:

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

This mock provides a minimal version of the `DockingForm` component with a `data-testid` for identification in your tests.

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

This mock replaces the `VideoScanModal` component with a simple template for testing purposes.

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

This mock gives you a basic implementation of the `VideoViewerModal` component.

</details>

### 2. Mock composables

Next, create mocks for the `useDocking` and `useSpacecraft` composables. These mocks will simulate the data and behavior of these composables.

<details>
  <summary>Hint 4: Mocking the useSpacecraft composable</summary>

```javascript
vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: vi.fn(),
}));
```

This mock provides dummy spacecraft data and simulates the loading and error states of the `useSpacecraft` composable.

</details>

<details>
  <summary>Hint 5: Mocking the useDocking composable</summary>

```javascript
vi.mock('@/composables/useDocking', () => ({
  useDocking: vi.fn(),
}));
```

This mock replaces the `useDocking` composable with fake docking data and functions for `scheduleDocking` and `updateDocking`.

</details>

### Optional: Create a setupMocks helper function

To simplify our test setup, we can create a `setupMocks` helper function. This function will allow us to easily configure the mocked behavior of our composables for different test scenarios.

<details>
  <summary>Hint: Creating the setupMocks helper function</summary>

```javascript
const mockSpacecrafts = ref([
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
]);

const mockDockings = ref([
  {
    id: '1',
    spacecraftId: '1',
    dockingTime: '2023-04-15T10:00:00Z',
    bayId: 1,
    status: 'scheduled',
  },
  {
    id: '2',
    spacecraftId: '2',
    dockingTime: '2023-04-16T14:00:00Z',
    bayId: 2,
    status: 'docked',
    scan: new Blob(),
  },
]);

const setupMocks = ({
  spacecraftLoading = false,
  spacecraftError = null,
  dockingLoading = false,
  dockingError = null,
  dockings = mockDockings,
} = {}) => {
  vi.mocked(useSpacecraft).mockReturnValue({
    spacecrafts: computed(() => mockSpacecrafts.value),
    loading: computed(() => spacecraftLoading),
    error: computed(() => spacecraftError),
    addSpacecraft: vi.fn(),
    updateSpacecraft: vi.fn(),
  });

  vi.mocked(useDocking).mockReturnValue({
    dockings: computed(() => dockings.value),
    loading: computed(() => dockingLoading),
    error: computed(() => dockingError || null),
    scheduleDocking: vi.fn(),
    updateDocking: vi.fn(),
    addScanToDocking: vi.fn(),
  });
};
```

This function allows you to pass an object with properties corresponding to the composables and their mocked behavior.

</details>

### 3. Write the `Component Rendering` tests

Now that you have mocks in place, write the tests that verify the rendering of the `DockingSchedule` component. Make sure to handle different loading and error states.

<details>
  <summary>Hint 6: Rendering the component</summary>

```javascript
render(DockingSchedule);

expect(screen.getByText('Docking Schedule')).toBeTruthy();
expect(screen.getByText('Schedule Docking')).toBeTruthy();
```

This test checks that the `DockingSchedule` component renders the title and the button to schedule a docking.

</details>

<details>
  <summary>Hint 7: Testing the loading state</summary>

```javascript
setupMocks({ dockingLoading: true });
render(DockingSchedule);

expect(screen.getByText('Loading...')).toBeTruthy();
```

Use the mock setup to simulate the loading state and verify that the component displays a "Loading..." message.

</details>

<details>
  <summary>Hint 8: Testing error message rendering</summary>

```javascript
setupMocks({
  dockingError: new Error('Test error message'),
});
render(DockingSchedule);

expect(screen.getByText('Test error message')).toBeTruthy();
```

This test verifies that the component correctly displays an error message when there's an issue with fetching the docking data.

</details>

### 4. Write the `Docking Scans` tests

Write tests that verify how the component handles dockings with and without scans. You’ll check whether the correct buttons (e.g., "View Scan" or "Record Scan") are displayed based on the docking status.

<details>
  <summary>Hint 9: Testing "View Scan" button for dockings with scans</summary>

```javascript
expect(screen.getByText('View Scan')).toBeTruthy();
```

This test checks that the "View Scan" button is displayed for dockings that have associated scan data.

</details>

<details>
  <summary>Hint 10: Testing "Record Scan" button for docked spacecraft</summary>

```javascript
expect(screen.getByText('Record Scan')).toBeTruthy();
```

This test ensures that the "Record Scan" button is only displayed for docked spacecraft that are eligible for scanning.

</details>

<details>
  <summary>Hint 11: Testing absence of "Record Scan" for scheduled or departed dockings</summary>

```javascript
expect(screen.queryByText('Record Scan')).toBeNull();
```

Use `queryByText` to ensure that the "Record Scan" button is not displayed for scheduled or departed dockings.

</details>
