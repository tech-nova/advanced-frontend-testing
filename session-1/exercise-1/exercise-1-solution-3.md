# Problem 3

For each type: what does the experience of *writing* the test tell you about your application?

## Unit Tests

When writing a unit test I learn how well the individual piece of code is isolated and how much it depends on other parts of the system. It reveals the complexity and testability of the code, often highlighting areas with tightly coupled or overly complex logic.

## Component Tests

When writing a component test I learn how well the component handles different state changes, props, and interactions with its dependencies. It reveals the component's robustness and ability to function as a standalone unit within the larger application.

## Integration Tests

When writing an integration test I learn how well the components and services we own are integrated and how clearly they communicate. It highlights the coupling between different parts we control and the clarity of the contracts and interfaces used for communication.

## E2E Tests

When writing an end-to-end test I learn how well the application performs from a user's perspective, including how well different parts of the system coordinate, even with external dependencies. It reveals any gaps or inconsistencies in the user journey or system architecture involving both owned and third-party components.