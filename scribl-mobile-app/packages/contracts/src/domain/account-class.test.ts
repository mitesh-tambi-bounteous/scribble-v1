import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyAccountAge,
  canProceedToAccountCreation,
  allowsMinorEnrollment,
  COPPA_AGE_THRESHOLD,
} from "./account-class.ts";

const NOW = new Date("2026-09-13T00:00:00.000Z");

test("COPPA_AGE_THRESHOLD is 13", () => {
  assert.equal(COPPA_AGE_THRESHOLD, 13);
});

test("classifyAccountAge: adult date of birth classifies as adult (AC1)", () => {
  assert.equal(classifyAccountAge("1990-04-12", NOW), "adult");
});

test("classifyAccountAge: minor date of birth classifies as minor (AC2)", () => {
  assert.equal(classifyAccountAge("2016-01-01", NOW), "minor");
});

test("classifyAccountAge: exactly 13 today is adult, one day short is minor", () => {
  assert.equal(classifyAccountAge("2013-09-13", NOW), "adult");
  assert.equal(classifyAccountAge("2013-09-14", NOW), "minor");
});

test("classifyAccountAge: unparseable date of birth fails closed to unknown", () => {
  assert.equal(classifyAccountAge("not-a-date", NOW), "unknown");
});

test("classifyAccountAge: future date of birth fails closed to unknown", () => {
  assert.equal(classifyAccountAge("2099-01-01", NOW), "unknown");
});

test("canProceedToAccountCreation: true only for adult", () => {
  assert.equal(canProceedToAccountCreation("adult"), true);
  assert.equal(canProceedToAccountCreation("minor"), false);
  assert.equal(canProceedToAccountCreation("unknown"), false);
});

test("allowsMinorEnrollment: false in prod, true in dev/qa (ADR-0012 Option A)", () => {
  assert.equal(allowsMinorEnrollment("prod"), false);
  assert.equal(allowsMinorEnrollment("dev"), true);
  assert.equal(allowsMinorEnrollment("qa"), true);
});
