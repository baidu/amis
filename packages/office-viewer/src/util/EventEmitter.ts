/**
 * 基于 tsee 删减了不需要的功能
 */

export type Listener = (...args: any[]) => Promise<any> | void;
export type DefaultEventMap = {[event in string | symbol]: Listener};

export interface IEventEmitter<
  EventMap extends DefaultEventMap = DefaultEventMap
> {
  emit<EventKey extends keyof EventMap>(
    event: EventKey,
    ...args: Parameters<EventMap[EventKey]>
  ): boolean;

  on<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  once<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  addListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  removeListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  prependListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  prependOnceListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  off<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;
  removeAllListeners<EventKey extends keyof EventMap = string>(
    event?: EventKey
  ): this;
}

/** cast type of any event emitter to typed event emitter */
export function asTypedEventEmitter<
  EventMap extends DefaultEventMap,
  X extends NodeJS.EventEmitter
>(x: X): IEventEmitter<EventMap> {
  return x as any;
}

/** Implemented event emitter */
export class EventEmitter<EventMap extends DefaultEventMap = DefaultEventMap>
  implements IEventEmitter<EventMap>
{
  private debug = false;
  constructor() {
    if (window && (window as any).OFFICE_VIEWER_DEBUG === true) {
      this.debug = true;
    }
  }

  events: {
    [eventName in keyof EventMap]?: Function[];
  } = {};

  emit = <EventKey extends keyof EventMap>(
    event: EventKey,
    ...args: Parameters<EventMap[EventKey]>
  ) => {
    if (this.events[event]) {
      const len = this.events[event]!.length;
      const events = Array.from(this.events[event]!);
      if (this.debug) {
        console.log(`EventEmitter: emit event ${String(event)}`, ...args);
      }
      for (const e of events) {
        e(...args);
      }
      return !!len;
    }
    return false;
  };

  on = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    this.addListener(event, listener);
    return this;
  };

  once = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;
    this.addListener(event, onceListener);
    return this;
  };

  addListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (!(event in this.events)) {
      this.events[event] = [listener];
    } else {
      this.events[event]!.push(listener);
    }

    return this;
  };

  removeListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (event in this.events) {
      const i = this.events[event]!.indexOf(listener);
      if (i !== -1) {
        this.events[event]!.splice(i, 1);
      }
    }
    return this;
  };

  prependListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (!(event in this.events)) {
      this.events[event] = [listener];
    } else {
      this.events[event]!.unshift(listener);
    }
    return this;
  };

  prependOnceListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;
    this.prependListener(event, onceListener);
    return this;
  };

  off = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    return this.removeListener(event, listener);
  };

  removeAllListeners = <EventKey extends keyof EventMap = string>(
    event?: EventKey
  ): this => {
    if (event) {
      delete this.events[event];
    }

    return this;
  };
}
