# ADR 0013: Mobile test automation via Appium with the XCUITest driver

**Status:** Proposed
**Date:** 2026-09-07
**Deciders:** TBD -- confirm before promoting to Accepted
**Related:** [0001](0001-react-native-primary.md) (React Native primary)

## Context

Scribl is a React Native app with a drawing-canvas-heavy UI (multi-touch,
pressure, palm rejection) plus native OS interaction points (camera
permission for QR scan, system alerts, backgrounding, notifications). We
need an automation approach for iOS (and, longer term, Android) that:

- Exercises real touch/gesture behavior, not an approximation, since
  canvas interactions only behave authentically on the real OS-level
  automation stack.
- Reuses as much test code and infrastructure as possible across iOS and
  Android, since the app itself is cross-platform React Native.
- Can validate actual debug, staging, and release builds, not only
  specially-instrumented test builds, so it can serve as pre-release
  smoke testing on the exact build going to the App Store.
- Can interact with native OS chrome (permission dialogs, alerts,
  backgrounding/foregrounding, notifications) that lives outside the
  app's own JS bundle.

## Decision

We will go with **Appium using the XCUITest driver** as the primary
iOS end-to-end automation approach, using the UiAutomator2 driver for
Android to keep a shared Appium test codebase across both platforms.

| Area | Recommendation |
| --- | --- |
| App framework | React Native |
| E2E automation | Appium |
| iOS-native automation | XCUITest where needed |
| Language | JavaScript/TypeScript for Appium, Swift for XCUITest |
| Test design | Screen/Page Object pattern |
| Execution | iOS Simulator initially -> BrowserStack (real devices) |
| Reporting | Appium/Test framework reports + CI artifacts |

### Why Appium

- **Real native driver, not an approximation.** Appium's XCUITest driver
  uses Apple's own automation framework (via WebdriverAgent) under the
  hood, driving the actual OS-level touch/gesture engine on a real
  simulator or physical device. For a drawing-canvas-heavy app, multi-touch,
  pressure, palm rejection, and gesture timing only behave authentically on
  the real stack.
- **Cross-platform code reuse.** The same Appium server, and largely the
  same test code structure, works for Android via the UiAutomator2 driver.
  Since Scribl is React Native (cross-platform by nature), this avoids
  maintaining two separate automation codebases for iOS and Android.
- **Works on any build type.** Appium can drive debug, staging, or actual
  production/release builds, which is essential for pre-release smoke
  testing on the exact build going to the App Store; we are not limited to
  specially-instrumented test builds.
- **Native OS-level interaction coverage.** Permission dialogs (camera for
  QR scan), system alerts, app backgrounding/foregrounding, and
  notifications interrupting a session are all native OS chrome that lives
  outside the app's own JS bundle. Appium can interact with and validate
  all of this; tools scoped only to the app's JS layer cannot.
- **Mature, open-source, vendor-neutral.** W3C WebDriver protocol
  standard, large community, works with WebdriverIO/Python/Java, and
  integrates with any CI. No lock-in.
- **Handles WebView bridges.** If Scribl's canvas or QR flow ever uses an
  embedded WebView inside the RN shell (common in hybrid RN apps), Appium
  can switch context into the WebView and interact with it, a genuine
  blind spot for RN-only tools.

## Alternatives considered

### Option A: Detox
- Pros: excellent for fast RN business-logic/screen-flow tests; auto-waits
  for the JS thread/animations; very stable for that narrow purpose.
- Cons: gray-box, requires the app built in debug mode with Detox's native
  module linked in, so it cannot validate production builds; gesture
  simulation is weaker than a real touch driver for canvas-heavy
  interactions.
- Why not chosen as primary: cannot do release-build sign-off or native
  permission dialogs. We keep Detox alongside Appium for fast CI
  regression; this is not either/or.

### Option B: Playwright (WebKit)
- Pros: only relevant if Scribl were pure mobile web.
- Cons: its WebKit browser is a WebKit build running on Linux/Mac, not
  real mobile Safari, so it misses iOS-specific viewport bugs, in-app-browser
  quirks, and camera/QR permission flows entirely.
- Why not chosen: not applicable now that we've confirmed Scribl is a
  native RN app, not a web view.

### Option C: Espresso
- Pros: strong native framework for Android.
- Cons: Android-only (Google's native framework); irrelevant for iOS and
  doesn't give the cross-platform code reuse Appium does.
- Why not chosen: no iOS coverage.

### Option D: XCTest/XCUITest used directly (no Appium layer)
- Pros: this is what Appium wraps, so same underlying engine.
- Cons: tests written in Swift/Objective-C, tightly coupled to Xcode, no
  cross-platform reuse with Android; QA engineers would need iOS-native
  dev skills rather than the JS/Python stack the team already works in.
- Why not chosen: Appium gives the same underlying engine with a more
  accessible, cross-platform-friendly interface.

### Option E: Cypress
- Pros: strong browser automation tool.
- Cons: doesn't support real mobile native app automation at all; browser
  only, no iOS simulator/device driving capability.
- Why not chosen: not a contender for a native RN app.

### Option F: Selenium
- Pros: Appium's ancestor, mature web automation.
- Cons: Selenium itself doesn't drive native mobile apps; it's
  web/browser automation. Appium exists specifically to extend the
  WebDriver protocol to mobile.
- Why not chosen: no functional alternative path through plain Selenium
  for native mobile.

## Consequences

### Positive
- Real device/gesture fidelity for canvas-heavy interactions.
- Cross-platform code reuse between iOS and Android via one Appium
  framework.
- Can test actual release builds, not just debug-instrumented ones,
  enabling true pre-release smoke testing.
- Covers native OS chrome (permission dialogs, alerts, backgrounding,
  notifications) that JS-only tools cannot reach.
- Vendor-neutral, W3C WebDriver standard, broad CI compatibility, no
  lock-in.
- Can handle embedded WebView bridges if the app ever needs one.

### Negative
- Adds an automation stack (Appium server, WebdriverAgent) to maintain
  alongside Detox rather than standardizing on a single framework.
- Requires some Swift familiarity for XCUITest-specific native
  validation.
- More setup and moving parts than a single-framework approach.

### Risks to monitor
- Detox remains in place for fast CI regression on JS/business logic; the
  boundary between what runs in Detox versus Appium needs to stay clear
  to avoid duplicate coverage.
- BrowserStack real-device execution introduces an external dependency
  and cost; monitor test stability and cost as the suite grows.
