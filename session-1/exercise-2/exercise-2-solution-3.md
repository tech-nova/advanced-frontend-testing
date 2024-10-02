# Problem 3: Develop an Enterprise Testing Strategy

For this scenario, create a testing strategy by defining the testing shape and explaining your rationale.

## Scenario

**Description**: The company has grown significantly over the past decade and now has 200 developers and several dedicated QA teams. The application has evolved into a set of interconnected microservices.

## Define Your Testing Shape

**Task**: Draw (or type) a rough sketch of the testing pyramid, specifying the percentage distribution of unit, component, and end-to-end tests. Include how it has changed from the startup days.

**Your Testing Shape**:

                    /\
                   /  \
                  /    \
                 /      \
                /        \
               /          \
              /  E2E (30%) \
             /              \
            /                \
           /  Component (50%) \
          /                    \
        /                      \
        /        Unit (20%)      \
       /                          \
      /                            \
     /______________________________\


## Rationale

**Explanation**: Provide a brief explanation of your chosen testing distribution and why it's appropriate for this scenario. Include how and why it has changed from the startup days.

The testing distribution has evolved to better suit the needs of a larger, more complex enterprise application:

1. **Unit Tests (20%)**: As the application has grown and become more complex, there's a greater need for unit testing. More advanced functionality and complex business logic have been introduced over time, requiring more thorough unit testing to ensure individual pieces work correctly in isolation.

2. **Component Tests (50%)**: While still a significant portion of our testing strategy, the focus on component tests has slightly decreased compared to the startup days. This is because we now need to allocate more resources to unit and end-to-end testing.

3. **End-to-End Tests (30%)**: The percentage of end-to-end tests has increased significantly. This is due to:
   - A higher number of external services and integrations
   - An increased need to guarantee that the entire system is working correctly from a user's perspective
   - The complexity of user workflows in an enterprise-scale application

This distribution differs from the startup days in several ways:

- There's a more balanced approach to testing, reflecting the increased complexity of the system.
- Unit testing has become more important as individual modules have grown more complex.
- End-to-end testing has gained prominence due to the need to verify the entire system's functionality in a microservices environment.
- While still important, component testing now shares focus with the other two types, as opposed to being the primary focus in the earlier stages of the company.