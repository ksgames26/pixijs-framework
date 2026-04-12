/**
 * Texture batching configuration.
 * Satisfies Constitution I: "Texture batching and atlas MUST be the
 * default strategy for asset loading."
 *
 * Pure configuration - no platform API dependencies.
 */
export interface BatchingConfig {
  /** Prefer texture atlas packing. When true, multiple textures are packed into atlases. */
  preferAtlas: boolean;

  /** Auto-batch threshold. When the number of same-type assets exceeds this, they are auto-packed. */
  autoBatchThreshold: number;

  /** Maximum atlas size in pixels. */
  maxAtlasSize: number;
}

export const DEFAULT_BATCHING_CONFIG: BatchingConfig = {
  preferAtlas: true,
  autoBatchThreshold: 5,
  maxAtlasSize: 2048,
};
