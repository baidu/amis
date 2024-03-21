/**
 * 打印样式
 */
export function printStyle(gridLineColor: string) {
  return `
<style>
  html, body {
    margin: 0;
    padding: 8px;
  }
  @page {
    size: auto;
    margin: 0mm;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table, th, td {
    border: 1px solid ${gridLineColor};
  }
</style>
`;
}
