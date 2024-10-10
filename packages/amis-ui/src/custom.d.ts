declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: {
    toc: any;
    html: string;
    raw: string;
  };
  export default content;
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare global {
  var amis: any;
}
