declare module 'uncontrollable' {
  export function uncontrollable<
    T extends Raect.ComponentType<any>,
    P extends {
      [propName: string]: any;
    }
  >(arg: T, config: P): T;
}
