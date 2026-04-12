// @ksgames26/spine - Spine animation module for PixiJS game framework
// Powered by @esotericsoftware/spine-pixi-v8

export { SpineModule } from './spine-module';
export { SpineAnimation } from './spine-animation';
export { SpineAssetResolver } from './spine-asset-resolver';
export type { SpineEventType, SpineEventCallback } from './spine-animation';
export { SpineSceneHelper, SpineSceneMixin } from './spine-scene-integration';

// Re-export spine-pixi-v8 types for convenience
export type {
  SkeletonData,
  Skeleton,
  AnimationState,
  AnimationStateData,
  TrackEntry,
} from '@esotericsoftware/spine-pixi-v8';
