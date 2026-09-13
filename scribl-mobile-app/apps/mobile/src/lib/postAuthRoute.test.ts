import { test } from "node:test";
import assert from "node:assert/strict";
import { postAuthRoute } from "./postAuthRoute.ts";

test("postAuthRoute: routes to the daily-prompt stub after a confirmed session (AC5)", () => {
  assert.equal(postAuthRoute(), "/today");
});
