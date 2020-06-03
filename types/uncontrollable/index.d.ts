declare module 'uncontrollable' {
  function uncontrollable<
    T extends Raect.ComponentType<any>,
    P extends {
      [propName: string]: any;
    }
  >(arg: T, config: P): T;

  export = uncontrollable;
}
