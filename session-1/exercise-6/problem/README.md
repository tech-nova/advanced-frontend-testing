# Exercise 6

## Overview

### **Context**

The `DockingSchedule` component integrates several features like business logic through our composables, state management with Pinia (through the composables), and various child components.

We have a test that should be failing but isn’t, and your job is to figure out why. This exercise will help you understand the challenges of testing components that act as integration points, where many dependencies come together.

### **Learning Outcome**

In the previous exercises, we mocked out every single dependency like we do in isolated unit tests. In this exercise you’ll discover why we either want to follow that approach (mocking _all_ dependencies), or mock absolutely nothing, like in an integration test.

### **Motivation**

In real-world applications, components often serve as hubs where different systems meet. They are “integration points” for our application.

Testing these components effectively means ensuring they work correctly in their broader context. If tests don’t fail when they should, it’s a signal that our tests may not be covering the right scenarios or that we’re relying too heavily on mocks.

Understanding how to test these integration points effectively is crucial for maintaining a robust codebase.

### **Problem Statement**

You will be working with a `DockingSchedule` component that interacts with a bunch of different things. There’s a test in place that should be failing, but it’s not. Your task is to identify why this is happening and fix it so that it accurately reflects the component’s behaviour.

We won’t worry about fixing the test just yet.

### **Key Takeaways**

- **Testing Integration Points**: Recognize that components are often not isolated units but integration points, and testing them should reflect their role in the larger system.
- **Diagnosing Failing Tests**: Learn to diagnose why a test might not be failing when it should, especially when multiple dependencies are involved.
- **Effective Test Design**: Understand how to adjust your test design to provide clear, meaningful results, avoiding the pitfalls of mixing mocks and real dependencies.

## Tasks

You'll be fixing a test for the `DockingSchedule` component. Follow these steps to troubleshoot and fix the issue.

### 1. Figure out what test should be failing

Start by identifying which test should be failing.

<details>
  <summary>Hint 1: Identifying the failing test</summary>

Run the app and look for what's not working as expected.

</details>

<details>
  <summary>Hint 2: Here's the test that's not failing</summary>

The `displays docking entries when data is loaded` test is not failing when it should.

</details>

</details>

### 2. Investigate the source of the issue

Now, figure out the root cause of the issue.

<details>
  <summary>Hint 3</summary>

The issue originates from the `dockingsWithCaptains` computed property in `DockingSchedule.vue`.

</details>

<details>
  <summary>Hint 4</summary>

The `DockingSchedule` component is accessing `spacecraft.captainName`, but it should be accessing `spacecraft.captain`.

</details>

### 3. Fix the test so it fails

Now that you’ve identified the issue, fix the test to accurately reflect the component’s behavior.

<details>
  <summary>Hint 5</summary>

Update the mock data in the test to match the correct `spacecraft.captain` property.

```javascript
const mockSpacecrafts = ref<Spacecraft[]>([
  {
    id: '1',
    name: 'Spacecraft 1',
    captain: 'Captain 1',
  },
  {
    id: '2',
    name: 'Spacecraft 2',
    captain: 'Captain 2',
  },
]);
```

</details>

### 4. Reflect on components as integration points

Finally, think about how testing components as integration points, where multiple dependencies converge, changes how you approach testing.
