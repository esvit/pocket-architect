import {bootstrap, BaseBootstrapEnv} from "./bootstrap";
import {Application} from "./application/Application";
import {asValue} from "awilix";
import {ApplicationModule} from "./application/ApplicationModule";
import {InMemoryEventBus} from "./eventBus/InMemoryEventBus";
import {DomainEventSubscriber} from "./DomainEventSubscriber";
import {DomainEventClass, DomainEvent} from "./DomainEvent";

class TestApplication extends Application {
  result: number[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scope: any;

  eventBus: InMemoryEventBus;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async initApplication({DIContainer: scope}: BaseBootstrapEnv) {
    this.eventBus = new InMemoryEventBus();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let provider: any = scope.resolve('TestProvider');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let service: any = scope.resolve('TestService');
    provider.inc();
    service.inc();

    let newScope = scope.createScope();
    provider = newScope.resolve('TestProvider')
    service = newScope.resolve('TestService');
    provider.inc();
    service.inc();

    newScope = scope.createScope();
    provider = newScope.resolve('TestProvider')
    service = newScope.resolve('TestService');
    provider.inc();
    service.inc();

    this.result = [provider.value, service.value];

    scope.register({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context: asValue({userId: '1'}),
      TestModule: asValue(new TestModule())
    });
    this.scope = scope;

    await this.initModules([
      scope.resolve('TestModule')
    ], scope.cradle);
  }
}

class TestModule extends ApplicationModule implements DomainEventSubscriber {
  events:string[] = [];

  subscribedTo(): DomainEventClass[] {
    return [TestDomainEvent];
  }

  async on(domainEvent: TestDomainEvent): Promise<void> {
    this.events.push(domainEvent.test);
  }

  async initModule(app: TestApplication) {
    app.eventBus.addSubscribers(this);
  }
}

class TestDomainEvent extends DomainEvent<{ test: string }> {
  get test() {
    return this.props.test;
  }
}

describe('bootstrap', () => {
  test('bootstrap', async () => {
    const app = new TestApplication();
    await bootstrap(app, {
      appFolder: `${__dirname}/../tests/testapp/app`,
      domainsFolder: `${__dirname}/../tests/testapp/domain`,
      infraFolder: `${__dirname}/../tests/testapp/infra`,
    });

    // провайдер в інфрі синглтон, сервіс - ні
    expect(app.result).toEqual([3, 1]);

    await app.eventBus.push(new TestDomainEvent({test: 'data'}));
    expect(app.eventBus.listenerCount('TestDomainEvent')).toBe(1);
    await app.eventBus.publish();

    expect((app.modules[0] as TestModule).events).toEqual(['data']);
  });

  test('bootstrap error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(() => bootstrap(new TestApplication(), <any>{})).rejects.toThrow('`appFolder` is required');
  });
});
