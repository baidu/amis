declare module 'uncontrollable' {
  export function uncontrollable<
    T extends React.ComponentType<any>,
    P extends {
      [propName: string]: any;
    }
  >(arg: T, config: P, mapping?: any): T;
}
