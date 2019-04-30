declare module 'uncontrollable' {
    function uncontrollable<T extends React.ComponentType<any>, P extends {
        [propName:string]: any
    }>(arg:T, config:P):T;

    export = uncontrollable;
}
