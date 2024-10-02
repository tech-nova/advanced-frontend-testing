# Problem 2

For each type: what does a failing test tell you? Think about your definitions, and what the potential causes of failures are.

## Unit Tests

When a unit test fails I know that there is an issue with the specific piece of code under test, such as a function or method not returning the expected result. It often indicates a problem with the implementation details or logic of that unit.

## Component Tests

When a component test fails I know that the component as a whole is not functioning correctly, which could be due to incorrect state management, unexpected interactions between subcomponents, or improper usage of its dependencies.

## Integration Tests

When an integration test fails I know that there is a problem with how different parts of the system we own interact, such as incorrect API responses, misconfigured services, or data inconsistencies between the components and services that we control.

## E2E Tests

When an end-to-end test fails I know that there is a problem in the overall user flow, which could be caused by frontend issues, backend failures, or external services not behaving as expected. It might indicate issues with third-party dependencies, network problems, or interactions between owned and external components.