# Problem 4

For each type: what are some things it *can’t* tell you when it fails?

## Unit Tests

A failing unit test tells me nothing about how the code interacts with other parts of the system or whether the feature behaves correctly from the user's perspective. It does not indicate whether the logic fits well within the overall application context.

## Component Tests

A failing component test tells me nothing about how well-written the code is, or how the component interacts with the rest of the application or how it handles real-world scenarios involving multiple components and services working together.

## Integration Tests

A failing integration test tells me nothing about the quality of my code, specific UI details, user experience issues, or whether the individual components themselves are functioning correctly in isolation. It also doesn't indicate if the backend services or APIs work correctly in isolation.

## E2E Tests

A failing end-to-end test tells me nothing about the internal implementation details or anything about the code at all. It doesn't provide insight into specific logic issues or bugs at the unit level, as the focus is on the overall user experience.
