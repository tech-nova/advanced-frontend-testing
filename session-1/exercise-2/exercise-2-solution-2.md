# Problem 2: Craft a Testing Strategy for a Small Startup

For this scenario, create a testing strategy by defining the testing shape and explaining your rationale.

## Scenario

**Description**: You are part of a team of 3 developers at a small startup building a new product. The app is a monolithic, single-page application using Vue.js.

## Define Your Testing Shape

**Task**: Draw (or type) a rough sketch of the testing pyramid, specifying the percentage distribution of unit, component, integration, and end-to-end tests.

**Your Testing Shape**:

                    /\
                   /  \
                  /    \
                 /      \
                /        \
               /          \
              /  E2E (20%) \
             /              \
            /                \
           /  Component (70%) \
          /                    \
         /                      \
        /        Unit (10%)      \
       /                          \
      /                            \
     /______________________________\


## Rationale

**Explanation**: Provide a brief explanation of your chosen testing distribution and why it's appropriate for this scenario.

For this small startup scenario with a Vue single-page application, the testing strategy focuses on maximizing efficiency and coverage with limited resources. Here's the rationale for the chosen distribution:

1. **Unit Tests (10%)**:
   - Minimal focus on unit tests due to the simplicity of most functions and the lack of complex business logic in a typical Vue.js SPA.
   - Focus primarily on critical utility functions or complex algorithms that require isolated validation.
   - Vue.js components often have minimal logic, reducing the need for extensive unit testing.

2. **Component Tests (70%)**:
   - The majority of the focus is on component tests, which serve as integration tests in the Vue.js context.
   - These tests run quickly but cover a significant portion of the application's functionality.
   - Component tests can validate the interaction between different parts of the Vue.js component (template, script, and style).
   - They help ensure that components render correctly, respond to user interactions, and manage state appropriately.

3. **End-to-End Tests (20%)**:
   - Limited end-to-end tests due to the time and resource constraints of the small team.
   - These tests focus on critical user flows, such as user login, form submission, and navigation through the core pages of the app.
   - E2E tests provide confidence in the overall functionality of the application but are more time-consuming to write and maintain.

This distribution allows the small team to achieve a good balance between test coverage and development speed. By focusing on component tests, they can catch most issues early in the development process while still having enough E2E tests to ensure the critical paths of the application work as expected. The minimal unit tests cover the essential complex logic without overburdening the team with maintenance of extensive low-level tests.