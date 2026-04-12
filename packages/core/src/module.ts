import type { GameApplication } from './application';

/**
 * Abstract base class for framework modules.
 * Each module is an independent npm package, loaded via tree-shaking.
 */
export abstract class Module {
  /** Module unique identifier */
  abstract readonly name: string;

  /** Module version */
  abstract readonly version: string;

  /** Framework instance reference (injected on register) */
  protected app!: GameApplication;

  /** Whether the module is enabled */
  enabled = false;

  /**
   * Called when the module is registered with the framework.
   * Receives the GameApplication instance for dependency injection.
   */
  onRegister(_app: GameApplication): void {
    this.app = _app;
  }

  /**
   * Enable the module. Can be async to support resource loading.
   */
  onEnable(): Promise<void> {
    this.enabled = true;
    return Promise.resolve();
  }

  /**
   * Disable the module.
   */
  onDisable(): void {
    this.enabled = false;
  }

  /**
   * Destroy the module and release all resources.
   */
  onDestroy(): void {
    this.enabled = false;
  }
}
