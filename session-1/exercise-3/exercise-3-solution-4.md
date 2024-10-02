# Problem 4: Prioritize only the core unit tests

## 1. Sketch out some unit tests, writing their name and a short description of each

1. Docking Data Fetching Function:
Test that the function responsible for fetching docking data (past, current, and future) returns the correct values.

2. Schedule Docking Logic
Test that the logic for scheduling a new docking validates inputs and saves correctly.

3. Scan Submission Function
Test that the function handling the submission of docking scans correctly processes and saves the scan data.

4. Scan Recording Function
Test that the function that records the scan works correctly to record from a camera.


## 2. If you can only keep one test, which one and why?

If I could only keep one test, it would be the "Validation Logic for Scheduling Docking". Here's why:

- **Crucial for Data Integrity**: This test ensures that the input validation for scheduling new dockings works correctly. It's essential because it prevents scheduling conflicts and incorrect data entry, which could severely disrupt future docking operations.

- **Complex Logic**: Scheduling logic often involves complex date and time calculations, conflict checking, and various business rules. Unit testing this logic helps catch edge cases and ensures robustness.

- **Difficult to Test Comprehensively at Higher Levels**: While E2E and component tests can cover some aspects of scheduling, they might not be able to test all edge cases and error conditions as thoroughly as unit tests can.

By focusing on this test, we're addressing a critical part of the system that directly impacts user experience and operational efficiency.


## 3. Does this feature even need unit tests?

Yes, but only for the validation logic and perhaps the scan recording.

Given that the logic is straightforward, unit tests for these are sufficient. Other aspects of the feature can be effectively covered by component and e2e tests, focusing unit tests only where they provide significant value.