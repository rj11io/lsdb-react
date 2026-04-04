import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function clearNamespace(page: Page, namespace: string) {
  await page.evaluate((value) => {
    window.__lsdbHelpers.clearNamespace(value);
  }, namespace);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.__lsdbReactReady === true);
});

test("react provider exposes the collection API", async ({ page }) => {
  await clearNamespace(page, "react-harness");

  const result = await page.evaluate(async () => {
    const reactClient = (window as typeof window & {
      __lsdbReact?: {
        collection<T extends { id: string }>(name: string): {
          all(): Promise<T[]>;
          insert(data: Omit<T, "id">): Promise<T>;
          update(id: string, data: Partial<Omit<T, "id">>): Promise<T>;
        };
      } | null;
    }).__lsdbReact;

    if (!reactClient) {
      throw new Error("React LSDB harness was not initialized.");
    }

    const todos = reactClient.collection<{ id: string; title: string; done: boolean }>("todos");
    const created = await todos.insert({ title: "from-react", done: false });
    await todos.update(created.id, { done: true });

    return todos.all();
  });

  expect(result).toHaveLength(1);
  expect(result[0]?.title).toBe("from-react");
  expect(result[0]?.done).toBe(true);
});

test("core client persists data across reloads inside the browser harness", async ({ page }) => {
  const namespace = `reload-${Date.now()}`;
  await clearNamespace(page, namespace);

  await page.evaluate(async (value) => {
    const client = new window.__lsdbExports.LSDBClient({
      namespace: value,
      delayMs: 0,
    });

    await client.collection<{ id: string; title: string; done: boolean }>("todos").insert({
      title: "persisted",
      done: false,
    });
  }, namespace);

  await page.reload();
  await page.waitForFunction(() => window.__lsdbReactReady === true);

  const result = await page.evaluate(async (value) => {
    const client = new window.__lsdbExports.LSDBClient({
      namespace: value,
      delayMs: 0,
    });

    return client.collection<{ id: string; title: string; done: boolean }>("todos").all();
  }, namespace);

  expect(result).toHaveLength(1);
  expect(result[0]?.title).toBe("persisted");
});

test("subscribers are notified when another tab changes the same collection", async ({
  page,
}) => {
  const namespace = `sync-${Date.now()}`;
  await clearNamespace(page, namespace);

  const context = page.context();
  const secondPage = await context.newPage();
  await secondPage.goto("/");
  await secondPage.waitForFunction(() => window.__lsdbReactReady === true);

  await page.evaluate((value) => {
    const client = new window.__lsdbExports.LSDBClient({
      namespace: value,
      delayMs: 0,
    });
    const todos = client.collection<{ id: string; title: string; done: boolean }>("todos");

    (window as typeof window & { __events?: number[] }).__events = [];
    todos.subscribe(() => {
      const target = window as typeof window & { __events?: number[] };
      target.__events = [...(target.__events ?? []), Date.now()];
    });
  }, namespace);

  await secondPage.evaluate(async (value) => {
    const client = new window.__lsdbExports.LSDBClient({
      namespace: value,
      delayMs: 0,
    });

    await client.collection<{ id: string; title: string; done: boolean }>("todos").insert({
      title: "from-other-tab",
      done: false,
    });
  }, namespace);

  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const target = window as typeof window & { __events?: number[] };
        return target.__events?.length ?? 0;
      });
    })
    .toBe(1);

  await secondPage.close();
});
