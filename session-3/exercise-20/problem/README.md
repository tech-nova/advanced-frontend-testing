# Exercise 20

## Overview

### **Context**

In this exercise, we're working with a validation library that's undergone a breaking change. The library has split its `required` validation into two separate checks: `isNull` and `required` (which now only checks for `undefined`). This is a common scenario when dealing with third-party dependencies that undergo major version updates.

### **Learning Outcome**

By the end of this exercise, you'll understand how to create compatibility layers that shield your application code (and your tests!) from breaking changes in external dependencies. You'll learn practical strategies for managing third-party dependencies in a way that makes your codebase more resilient to change.

### **Motivation**

Dependencies change. Whether it's a validation library, a UI component library, or any other third-party code, updates can introduce breaking changes that could affect large portions of your codebase, causing your tests to fail.

### **Problem Statement**

You'll work with a validation system where a (simulated) third-party library has introduced a breaking change. Instead of modifying all the code that uses this library, you'll create a compatibility layer that maintains the original API while adapting to the new underlying implementation.

### **Key Takeaways**

- **Dependency Abstraction**: Learn how wrapping third-party code in your own abstractions can protect your application from breaking changes.
- **Compatibility Layers**: Understand how to create compatibility layers that maintain existing APIs while adapting to new implementations.
- **Trade-offs in Abstraction**: Recognize the balance between wrapping everything versus minimal abstraction, and when each approach might be appropriate.

## Tasks

You will fix a breaking change in a validation library by creating a compatibility layer that keeps existing code working, even when the library is updated.

Files:

- Simulated `Validator` library: `src/utils/validator/`
  - Original rules: `rules.ts`
  - New rules: `new_rules.ts`
  - Core logic: `validator.ts`
- Our validation code: `src/utils/validation.ts`
- Tests: `src/utils/validation.spec.js`

Commands:

- Run the test suite: `npm run test -- validation`

## 1. Understand the Current System

- Run the test suite to see all tests passing
- Review how `validation.ts` uses our simulated `validator` library (represents a third-party library)
- Look at how validation rules are defined in `validator/rules.ts`

## 2. Introduce the New Version

- Delete `validator/rules.ts` (old version)
- Rename `validator/new_rules.ts` to `rules.ts` so simulate a new version of the `validator`library
- Run tests to see what breaks

## 3. Create a Compatibility Layer

- Create a new file `utils/rules.ts` that will handle smoothing over the breaking changes in a single spot.
- Add any necessary changes to `utils/rules.ts` to make the tests pass
- Our tests will use this new file instead of `validator/rules.ts`

## 4. Review What We Learned

- Run tests to see all passing
- Notice how we fixed breaking changes without modifying lots of files (or the potential to modify lots of files)
- See how a single new file helped maintain compatibility
- Think about when this approach might be useful in other situations
