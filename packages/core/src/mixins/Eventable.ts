export interface IEventable<TEvent> {
  registerEvent(handler: Event<TEvent>): void;
  releaseEvents():Event<TEvent>[];
}
export class Event<TEvent> {
  constructor(public payload: TEvent) {}
}

export
function Eventable<TEvent>() {
  return function <TBase extends new (...args: any[]) => {}>(Base: TBase) {
    return class extends Base implements IEventable<TEvent> {
      private _events: Event<TEvent>[] = [];

      registerEvent(handler: Event<TEvent>) {
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
