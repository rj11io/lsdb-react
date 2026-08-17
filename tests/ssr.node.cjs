const assert = require("node:assert/strict");
const test = require("node:test");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { LSDBProvider, useLSDB } = require("../dist");

test("prerenders the provider without browser storage", () => {
  let resolvedClient;

  function Consumer() {
    resolvedClient = useLSDB();
    return React.createElement("span", null, "ready");
  }

  const markup = renderToString(
    React.createElement(
      LSDBProvider,
      { options: { namespace: "ssr" } },
      React.createElement(Consumer),
    ),
  );

  assert.equal(markup, "<span>ready</span>");
  assert.ok(resolvedClient);
});
