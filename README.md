# ⚡ Flash Electricity — API + UI Integration Testing

A Playwright test automation project for the Flash Wallet Buy Electricity application. This project demonstrates how to test API behaviour, mock network responses, intercept real requests, and validate complete end-to-end user journeys using **Playwright, TypeScript, and Node.js**.

## 📌 Project Overview

**Module:** Module 3 · Topic 2 — API + UI Integration  
**Application:** Flash Wallet Buy Electricity  
**Base URL:** `http://localhost:3002`  
**Testing Framework:** Playwright  
**Programming Language:** TypeScript  
**Browser:** Chromium  
**Estimated Duration:** 2–3 hours

The application allows customers to purchase electricity by entering an 11-digit meter number and an amount in South African rand. The application communicates with its own API to validate purchases, update wallet balances, generate electricity tokens, and record purchase history.

## 🎯 Project Objectives

The goal of this activity is to build a Playwright test suite from an empty project folder and apply the principles of API and UI integration testing.

The project covers:

- **API Testing:** Validate successful purchases, business rules, response statuses, wallet balances, and purchase history.
- **Mocked UI Testing:** Simulate successful purchases, server errors, dropped connections, and unavailable account services without calling the real API.
- **Intercepted Testing:** Inspect outgoing requests, validate real API responses, and modify responses before they reach the UI.
- **End-to-End Testing:** Verify complete purchase journeys through the UI and confirm the resulting data through the API.
- **Test Design:** Create a test case matrix covering validation rules, boundary values, and realistic customer mistakes.
- **Parallel Execution:** Run tests independently and verify that they remain reliable with four parallel workers.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Playwright | Browser automation and API testing |
| TypeScript | Writing type-safe test scripts |
| Node.js | Running the application and test environment |
| Cucumber concepts | Applying structured testing and scenario thinking where relevant |
| REST API | Communicating with the electricity purchase service |
| JSON | Sending requests and validating responses |
| Git | Version control and tracking project progress |

## 📂 Project Structure

The project is organised to separate each testing approach and its supporting files.

```text
flash-electricity-activity/
│
├── electricity-app/          # Provided application and API
│   └── server.js
│
├── tests/
│   ├── api/                   # API tests without a browser
│   ├── mock/                  # UI tests using mocked responses
│   ├── intercept/             # Tests intercepting real API traffic
│   ├── e2e/                   # End-to-end integration tests
│   └── support/               # Shared test helpers
│
├── test-cases.md              # Test case design and predictions
├── playwright.config.ts       # Playwright configuration
├── package.json               # Project scripts and dependencies
├── package-lock.json          # Dependency lock file
└── README.md                  # Project documentation
```

*Note: The structure represents the intended organisation. Keep your actual filenames and configuration consistent with the files created in your project.*

## 📋 Electricity Purchase Business Rules

The API validates purchase requests in the following order:

1. The meter number must contain exactly 11 digits.
2. The purchase amount must be
