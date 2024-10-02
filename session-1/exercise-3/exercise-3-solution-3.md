# Problem 3: Prioritize only the core component tests

## 1. Sketch out some component tests, writing their name and a short description of each

1. "Happy path: Renders spacecraft list correctly"
   - Ensures that the component renders a list of spacecraft with correct information and buttons.

2. "Record button only visible for docked spacecraft"
   - Verifies that the "Record" button is only displayed for spacecraft with a docked status.

3. "View Scan button only visible for scanned spacecraft"
   - Checks that the "View Scan" button is only shown for spacecraft that have been scanned.

4. "Empty state: Displays message when no spacecraft are available"
   - Tests if the component shows an appropriate message when the spacecraft list is empty.

5. "Loading state: Displays loading indicator while fetching data"
   - Ensures that a loading indicator is shown while the component is fetching spacecraft data.

6. "Error handling: Displays error message on API failure"
   - Verifies that the component shows an error message when the API request fails.

## 2. If you can only keep one test, which one and why?

If I could only keep one test, I would choose the "Happy path: Renders spacecraft list correctly" test. Here's why:

1. Comprehensive coverage: This test ensures that the core functionality of the component works as expected. It verifies that the component can render a list of spacecraft with all the necessary information and buttons.

2. Implicit validation: While focusing on the happy path, this test implicitly covers some aspects of the other tests. For example, it might indirectly verify that the "Record" and "View Scan" buttons are displayed correctly for the appropriate spacecraft.

3. Foundation for other tests: The happy path test serves as a solid foundation for other tests. If this test passes, it indicates that the basic rendering and data flow are working correctly, making it easier to identify issues in edge cases or specific scenarios.

4. User-centric approach: The happy path represents the most common user interaction with the component. By ensuring this works correctly, we're addressing the needs of the majority of users.

