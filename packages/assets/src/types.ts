/**
 * Asset type enum.
 */
export const AssetType = {
  TEXTURE: 'texture',
  SPRITESHEET: 'spritesheet',
  SPINE: 'spine',
  JSON: 'json',
  AUDIO: 'audio',
  FONT: 'font',
  OTHER: 'other',
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

/**
 * Asset lifecycle state.
 */
export const AssetState = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
  UNLOADING: 'unloading',
  UNLOADED: 'unloaded',
} as const;

export type AssetState = (typeof AssetState)[keyof typeof AssetState];

/**
 * Load options for individual assets.
 */
export interface LoadOptions {
  /** Asset type hint */
  type?: AssetType;
  /** Loading priority (lower = higher priority) */
  priority?: number;
  /** Whether this is a scene-level resource (unloaded with scene) */
  sceneLevel?: boolean;
}
