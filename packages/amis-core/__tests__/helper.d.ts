import { RenderOptions } from '../src/factory';
export declare function wait(duration: number, fnOrUseWaitFor?: Function | boolean): Promise<void>;
export declare function makeEnv(env?: Partial<RenderOptions>): RenderOptions;
export declare const createMockMediaMatcher: (matchesOrMapOfMatches: any) => (qs: any) => {
    matches: any;
    media: string;
    addListener: () => void;
    addEventListener: () => void;
    removeEventListener: () => void;
    onchange: () => void;
    removeListener: () => void;
    dispatchEvent: () => boolean;
};
