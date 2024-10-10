/**
 * 将 emu 转换为 px
 */
export function emuToPx(emu?: number | string) {
  if (emu === undefined) {
    return 0;
  }
  if (typeof emu === 'string') {
    emu = parseFloat(emu);
  }
  return emu / 9525;
}
