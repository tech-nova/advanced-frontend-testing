## Hint 1: Setting up webcam mocking

```typescript
import { mockWebcam } from '../mocks/webcam';

test.beforeEach(async ({ page }) => {
  await page.goto(DOCKINGS_PATH);
  await mockWebcam(page);
});
```
- The webcam mock needs to be set up before each test
- Import the utility and call it in the `beforeEach` block
