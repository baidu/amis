import { expect, test, describe } from "bun:test";

describe("fast", () => {
  test("fn1", () => {

  });

  // test("fn2", () => {
  //   const uuidv4 = () => {
  //     // 参考 https://github.com/streamich/v4-uuid
  //     const createStr = () =>
  //       (
  //         '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  //       ).slice(-16);
  //     const a = createStr();
  //     const b = createStr();
  //     return (
  //       a.slice(0, 8) +
  //       '-' +
  //       a.slice(8, 12) +
  //       '-4' +
  //       a.slice(13) +
  //       '-a' +
  //       b.slice(1, 4) +
  //       '-' +
  //       b.slice(4)
  //     );
  //   };
  //   for (let i = 0;i< 100; i++) {
  //     uuidv4()
  //   }
  //   // expect(2 * 2).toBe(4);
  // });
});
