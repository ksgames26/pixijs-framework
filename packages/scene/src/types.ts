/**
 * Scene lifecycle state.
 */
export const SceneState = {
  IDLE: 'idle',
  ENTERING: 'entering',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXITING: 'exiting',
  DESTROYED: 'destroyed',
} as const;

export type SceneState = (typeof SceneState)[keyof typeof SceneState];

/**
 * Scene transition configuration.
 */
export interface TransitionConfig {
  /** Transition type */
  type?: 'fade' | 'custom';
  /** Duration in ms, default 500 */
  duration?: number;
  /** Loading display threshold in ms, default 300 */
  loadingThreshold?: number;
  /** Custom loading scene name */
  loadingScene?: string;
}

/**
 * Scene asset declaration.
 */
export interface SceneAsset {
  key: string;
  url: string;
}
