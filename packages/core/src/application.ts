import { Application } from 'pixi.js';
import type { GameConfig } from './config';
import { EventBus, GameEvents } from './events';
import { Module } from './module';
import type { PlatformAdapter } from './platform';
import { detectPlatformName } from './platform';
import { WebAdapter } from './platform-web-adapter';
import { ScreenAdapter } from './screen';
import type { DisplayObjectFactory } from './factory';
import { DefaultDisplayObjectFactory } from './factory';

/**
 * Framework main entry point.
 * Initializes the PixiJS renderer and coordinates all modules.
 */
export class GameApplication {
  /** PixiJS Application instance */
  readonly pixiApp: Application;

  /** Event bus for module communication */
  readonly events = new EventBus();

  /** Display object factory (Constitution VI) */
  readonly factory: DisplayObjectFactory;

  /** Registered modules */
  private modules = new Map<string, Module>();

  /** Platform adapter */
  private _platform!: PlatformAdapter;

  /** Screen adapter */
  private _screen!: ScreenAdapter;

  /** Framework config */
  private _config: GameConfig = {};

  /** Whether in development mode */
  isDev = false;

  /** Get framework configuration (read-only) */
  get config(): Readonly<GameConfig> {
    return this._config;
  }

  /** Application state */
  private state: 'idle' | 'initializing' | 'running' | 'destroying' | 'destroyed' = 'idle';

  constructor(factory?: DisplayObjectFactory) {
    this.pixiApp = new Application();
    this.factory = factory ?? new DefaultDisplayObjectFactory();
  }

  /**
   * Initialize the framework with configuration.
   * Creates PixiJS Application, selects platform adapter, and enables modules.
   */
  async init(config: GameConfig = {}): Promise<this> {
    if (this.state !== 'idle') {
      throw new Error(`[GameApplication] Cannot init in state "${this.state}"`);
    }

    this.state = 'initializing';
    this._config = config;
    this.isDev = config.debug ?? false;

    // Setup platform adapter first to access system info
    await this.setupPlatform(config.platform ?? 'auto');

    // Get screen info from platform adapter (cross-platform compatible)
    const sysInfo = this._platform.getSystemInfo();

    // Initialize PixiJS v8 Application (async)
    await this.pixiApp.init({
      canvas: config.canvas || (globalThis as any).canvas,
      width: config.width ?? sysInfo.screenWidth,
      height: config.height ?? sysInfo.screenHeight,
      backgroundColor: config.backgroundColor ?? 0x000000,
      resolution: config.resolution ?? sysInfo.pixelRatio,
      antialias: config.antialias ?? true,
      autoDensity: true,
      preference: 'webgl',
    });

    // Setup screen adapter (event-driven resize via PlatformAdapter.onResize)
    this._screen = new ScreenAdapter(this.pixiApp, this._platform, this.events);
    this._screen.start();

    // Register WebGL context loss handlers
    this.setupContextLossHandling();

    // Enable all registered modules
    await this.enableModules();

    this.state = 'running';
    this.events.emit(GameEvents.APP_INIT);
    return this;
  }

  /**
   * Register a module with the framework.
   */
  registerModule(module: Module): this {
    if (this.modules.has(module.name)) {
      throw new Error(`[GameApplication] Module "${module.name}" is already registered`);
    }
    module.onRegister(this);
    this.modules.set(module.name, module);
    return this;
  }

  /**
   * Get a registered module by name.
   */
  getModule<T extends Module>(name: string): T | undefined {
    return this.modules.get(name) as T | undefined;
  }

  /**
   * Get the platform adapter.
   */
  get platform(): PlatformAdapter {
    return this._platform;
  }

  /**
   * Get the screen adapter.
   */
  get screen(): ScreenAdapter {
    return this._screen;
  }

  /**
   * Destroy the framework and release all resources.
   * Order: scenes → modules → assets → renderer
   */
  destroy(): void {
    if (this.state === 'destroyed' || this.state === 'destroying') return;

    this.state = 'destroying';

    // Destroy modules in reverse order
    const moduleNames = [...this.modules.keys()].reverse();
    for (const name of moduleNames) {
      const mod = this.modules.get(name)!;
      mod.onDisable();
      mod.onDestroy();
    }
    this.modules.clear();

    // Stop screen adapter
    this._screen?.stop();

    // Destroy PixiJS application
    this.pixiApp.destroy(true);
    this.events.clear();

    this.state = 'destroyed';
  }

  /**
   * Setup platform adapter based on config or auto-detection.
   * For mini-game platforms (WeChat/Douyin), user must provide adapter instance
   * since dynamic imports are not supported in mini-game environments.
   */
  private setupPlatform(platformName: string): void {
    // Use provided adapter if available
    if (this._config.platformAdapter) {
      this._platform = this._config.platformAdapter;
      return;
    }

    const detected = platformName === 'auto' ? detectPlatformName() : platformName;

    switch (detected) {
      case 'wechat':
      case 'douyin':
        throw new Error(
          `[GameApplication] Platform "${detected}" requires explicit adapter. ` +
            `Please import and pass it via config.platformAdapter. ` +
            `Example: import { ${detected === 'wechat' ? 'WechatAdapter' : 'DouyinAdapter'} } from ` +
            `'@ksgames26/platform-${detected}'; init({ platformAdapter: new ${detected === 'wechat' ? 'WechatAdapter' : 'DouyinAdapter'}() })`
        );
      case 'web':
      default:
        this._platform = new WebAdapter();
        break;
    }
  }

  /**
   * Register WebGL context loss handling with auto-recovery.
   * PixiJS v8 handles the actual recovery; we emit events for business logic.
   */
  private setupContextLossHandling(): void {
    const renderer = this.pixiApp.renderer as unknown as {
      on(event: string, handler: () => void): void;
    };

    renderer.on('contextlost', () => {
      this.events.emit(GameEvents.APP_CONTEXT_LOST);
    });

    renderer.on('contextrestored', () => {
      this.events.emit(GameEvents.APP_CONTEXT_RESTORED);
    });
  }

  /**
   * Enable all registered modules.
   */
  private async enableModules(): Promise<void> {
    for (const mod of this.modules.values()) {
      await mod.onEnable();
    }
  }
}
