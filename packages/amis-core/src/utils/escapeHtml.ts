const entityMap: {
  [propName: string]: string;
} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
export const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
