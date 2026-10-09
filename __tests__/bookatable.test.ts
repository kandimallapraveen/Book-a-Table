/// <reference types="jest" />

describe("Book a Table App", () => {
  test("basic project test", () => {
    expect(1 + 1).toBe(2);
  });

  test("app name should be Book a Table", () => {
    const appName = "Book a Table";
    expect(appName).toBe("Book a Table");
  });

  test("default guests should be 2", () => {
    const guests = 2;
    expect(guests).toBe(2);
  });

  test("restaurant should have 6 tables", () => {
    const tables = ["T1", "T2", "T3", "T4", "T5", "T6"];
    expect(tables.length).toBe(6);
  });
});
