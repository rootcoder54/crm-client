import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluatePermission, legacyPermissionNames, type PermissionRule } from "../lib/permission-rules";
const rule = (name: string, accessLevel: number, url = "/requete"): PermissionRule => ({ name, accessLevel, url });

test("denying any legacy operation does not block reading or creating requests", () => {
  for (const name of legacyPermissionNames) {
    const rules = [rule(name, 0)];
    assert.equal(evaluatePermission(rules, "/requete", "read"), true);
    assert.equal(evaluatePermission(rules, "/requete", "create"), true);
    assert.equal(evaluatePermission(rules, "/requete", name === "requete_delete" ? "delete" : "update", name), false);
  }
});
test("read-only resource and operation denials work in either database order", () => {
  const rules = [rule("requete_delete", 0), rule("requete", 1)];
  for (const ordered of [rules, [...rules].reverse()]) {
    assert.equal(evaluatePermission(ordered, "/requete", "read"), true);
    assert.equal(evaluatePermission(ordered, "/requete", "create"), false);
    assert.equal(evaluatePermission(ordered, "/requete", "update", "requete_edite"), false);
    assert.equal(evaluatePermission(ordered, "/requete", "delete", "requete_delete"), false);
  }
});
test("an operation grant does not grant resource read access", () => {
  const rules = [rule("requete_delete", 1), rule("requete", 0)];
  assert.equal(evaluatePermission(rules, "/requete", "read"), false);
  assert.equal(evaluatePermission(rules, "/requete", "delete", "requete_delete"), true);
});
test("resource levels preserve read, write and delete thresholds", () => {
  for (const level of [0, 1, 2, 3]) {
    const rules = [rule("requete", level)];
    assert.equal(evaluatePermission(rules, "/requete", "read"), level >= 1);
    assert.equal(evaluatePermission(rules, "/requete", "create"), level >= 2);
    assert.equal(evaluatePermission(rules, "/requete", "update"), level >= 2);
    assert.equal(evaluatePermission(rules, "/requete", "delete"), level >= 3);
  }
});
test("scope matching respects boundaries, trailing slashes and specificity", () => {
  const rules = [rule("requete", 0, "/requete/"), rule("detail", 1, "/requete/detail")];
  assert.equal(evaluatePermission(rules, "/requete", "read"), false);
  assert.equal(evaluatePermission(rules, "/requete/add", "read"), false);
  assert.equal(evaluatePermission(rules, "/requete/detail/123", "read"), true);
  assert.equal(evaluatePermission(rules, "/requete-other", "read"), true);
});
test("equal scopes choose denial independently of row order", () => {
  const rules = [rule("a", 3), rule("b", 0)];
  assert.equal(evaluatePermission(rules, "/requete", "read"), false);
  assert.equal(evaluatePermission([...rules].reverse(), "/requete", "read"), false);
  assert.equal(evaluatePermission([], "/requete", "read"), true);
});
