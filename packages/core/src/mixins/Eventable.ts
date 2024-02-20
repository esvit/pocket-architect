export interface IEventable<TEvent> {
  registerEvent(handler: Event<TEvent>): void;
  releaseEvents():Event<TEvent>[];
}
export class Event<TEvent> {
  constructor(public payload: TEvent) {}
}

export
function Eventable<TEvent>() {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  return function <TBase extends new (...args: any[]) => {}>(Base: TBase) {
    return class extends Base implements IEventable<TEvent> {
      _events: Event<TEvent>[] = [];

      registerEvent(handler: Event<TEvent>):void {
        this._events.push(handler);
      }

      releaseEvents(): Event<TEvent>[] {
        const list = this._events;
        this._events = [];
        return list;
      }
    };
  };
}
