export type Constructor<T = {}> = new (...args: any[]) => T;
export type ServiceIdentifier<T = any> = string | symbol | Constructor<T>;

export interface Container {
  bind<T>(identifier: ServiceIdentifier<T>): BindingBuilder<T>;
  get<T>(identifier: ServiceIdentifier<T>): T;
  isBound<T>(identifier: ServiceIdentifier<T>): boolean;
}

export interface BindingBuilder<T> {
  to(constructor: Constructor<T>): void;
  toConstantValue(value: T): void;
  toFactory(factory: () => T): void;
  toSingleton(constructor: Constructor<T>): void;
}

export class DIContainer implements Container {
  private bindings = new Map<ServiceIdentifier, any>();
  private singletons = new Map<ServiceIdentifier, any>();

  bind<T>(identifier: ServiceIdentifier<T>): BindingBuilder<T> {
    return {
      to: (constructor: Constructor<T>) => {
        this.bindings.set(identifier, { type: 'constructor', value: constructor });
      },
      toConstantValue: (value: T) => {
        this.bindings.set(identifier, { type: 'constant', value });
      },
      toFactory: (factory: () => T) => {
        this.bindings.set(identifier, { type: 'factory', value: factory });
      },
      toSingleton: (constructor: Constructor<T>) => {
        this.bindings.set(identifier, { type: 'singleton', value: constructor });
      },
    };
  }

  get<T>(identifier: ServiceIdentifier<T>): T {
    const binding = this.bindings.get(identifier);
    if (!binding) {
      throw new Error(`No binding found for ${String(identifier)}`);
    }

    switch (binding.type) {
      case 'constant':
        return binding.value;
      case 'factory':
        return binding.value();
      case 'constructor':
        return new binding.value();
      case 'singleton':
        if (!this.singletons.has(identifier)) {
          this.singletons.set(identifier, new binding.value());
        }
        return this.singletons.get(identifier);
      default:
        throw new Error(`Unknown binding type: ${binding.type}`);
    }
  }

  isBound<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.bindings.has(identifier);
  }
}
