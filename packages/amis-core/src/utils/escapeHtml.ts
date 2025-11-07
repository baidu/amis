const entityMap: {
  [propName: string]: string;
} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
export const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"']/g, function (s) {
    return entityMap[s];
  });
