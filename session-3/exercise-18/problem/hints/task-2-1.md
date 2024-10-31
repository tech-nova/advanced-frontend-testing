# Understanding Non-Deterministic Behavior

Look for sources of randomness or unpredictable behavior, such as:
- Random number generation: `Math.random()`
- Date/time operations: `new Date()` or `Date.now()`
- Asynchronous operations with unpredictable timing: `setTimeout()`, `setInterval()`
- API calls with varying response times
- Race conditions in concurrent operations
