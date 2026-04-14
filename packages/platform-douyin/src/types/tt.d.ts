/**
 * 扩展抖音官方类型定义，补充小游戏专用 API
 * 官方 @douyin-microapp/typings 主要覆盖小程序 API，缺少部分小游戏 API
 */

// ============================================================
// 扩展官方 API 模块
// ============================================================

declare module '@douyin-microapp/typings/api/system-info' {
  interface SystemInfo {
    /** 设备像素比（小游戏兼容字段） */
    devicePixelRatio: number;
    /** 系统语言 */
    language: string;
  }
}

declare module '@douyin-microapp/typings/api/inner-audio' {
  interface InnerAudioContext {
    /** 开始播放的位置 */
    startTime: number;
    /** 是否遵循系统静音开关 */
    obeyMuteSwitch: boolean;
    /** 缓冲的时间 */
    buffered: number;
  }
}

// ============================================================
// 小游戏专用类型定义
// ============================================================

/**
 * WebSocket 任务
 */
export interface SocketTask {
  send(options: { data: string | ArrayBuffer }): void;
  close(options?: { code?: number; reason?: string }): void;
  onOpen(callback: () => void): void;
  onClose(callback: (res: any) => void): void;
  onMessage(callback: (res: { data: string | ArrayBuffer }) => void): void;
  onError(callback: (res: { errMsg: string }) => void): void;
}

/**
 * Worker 实例
 */
export interface WorkerInstance {
  postMessage(message: any, transferList?: ArrayBuffer[]): void;
  onMessage(callback: (res: any) => void): void;
  terminate(): void;
}

/**
 * 文件系统管理器
 */
export interface FileSystemManager {
  readFile(options: {
    filePath: string;
    encoding?: 'ascii' | 'base64' | 'binary' | 'hex' | 'utf-8' | 'utf8' | 'latin1' | undefined;
    success?: (res: { data: string | ArrayBuffer }) => void;
    fail?: (res: { errMsg: string }) => void;
  }): void;
}

/**
 * 触摸对象
 */
export interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  force?: number;
  radiusX?: number;
  radiusY?: number;
}

/**
 * 触摸事件
 */
export interface TouchEvent {
  touches: Touch[];
  changedTouches: Touch[];
  timeStamp: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  preventDefault?(): void;
}

/**
 * 网络状态
 */
export interface NetworkStatus {
  isConnected: boolean;
  networkType: string;
}

/**
 * 请求任务
 */
export interface RequestTask {
  abort(): void;
}

/**
 * 请求选项
 */
export interface RequestOptions {
  /** 请求地址 */
  url: string;
  /** 请求 Header */
  header?: Record<string, string>;
  /** 网络请求方法 */
  method?: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'HEAD' | 'DELETE' | 'PATCH';
  /** 请求的参数 */
  data?: object | ArrayBuffer | string;
  /** 期望返回的数据类型 */
  dataType?: string;
  /** 响应类型 */
  responseType?: 'text' | 'arraybuffer';
  /** 成功回调 */
  success?: (res: { data: object | string | ArrayBuffer; statusCode: number; header: Record<string, string> }) => void;
  /** 失败回调 */
  fail?: (res: { errMsg: string }) => void;
}

/**
 * 小游戏专用 API 扩展接口
 */
export interface MiniGameAPIExtension {
  /** 创建 Canvas 实例 */
  createCanvas(): HTMLCanvasElement;

  /** 创建图片对象 */
  createImage(): HTMLImageElement;

  /** 获取性能对象 */
  getPerformance(): {
    now(): number;
  };

  /** 获取音频上下文 */
  getAudioContext?(): any;

  /** 连接 WebSocket */
  connectSocket(options: { url: string; protocols?: string[] }): SocketTask;

  /** 创建 Worker */
  createWorker(scriptPath: string): WorkerInstance;

  /** 获取文件系统管理器 */
  getFileSystemManager(): FileSystemManager;

  /** 监听隐藏事件 */
  onHide(callback: () => void): void;

  /** 监听显示事件 */
  onShow(callback: () => void): void;

  /** 监听触摸开始事件 */
  onTouchStart(callback: (res: TouchEvent) => void): void;

  /** 监听触摸移动事件 */
  onTouchMove(callback: (res: TouchEvent) => void): void;

  /** 监听触摸结束事件 */
  onTouchEnd(callback: (res: TouchEvent) => void): void;

  /** 监听触摸取消事件 */
  onTouchCancel(callback: (res: TouchEvent) => void): void;

  /** 监听窗口大小变化 */
  onWindowResize(callback: (res: { windowWidth: number; windowHeight: number }) => void): void;

  /** 发起网络请求（覆盖官方类型，支持 string 类型的 data） */
  request(options: RequestOptions): RequestTask;

  /** 清理本地数据缓存（无需参数） */
  clearStorage(): void;
}

// ============================================================
// 全局声明
// ============================================================

import type * as API from '@douyin-microapp/typings/types/api';

declare global {
  /** TT 命名空间 - 用于兼容旧代码 */
  namespace TT {
    /** 音频上下文 */
    type InnerAudioContext = import('@douyin-microapp/typings/api/inner-audio').InnerAudioContext;
    /** WebSocket 任务 */
    type SocketTask = import('./tt').SocketTask;
    /** Worker 实例 */
    type WorkerInstance = import('./tt').WorkerInstance;
    /** 网络状态 */
    type NetworkStatus = import('./tt').NetworkStatus;
    /** 触摸对象 */
    type Touch = import('./tt').Touch;
    /** 触摸事件 */
    type TouchEvent = import('./tt').TouchEvent;
  }

  /**
   * 抖音小游戏全局对象
   * 合并官方 API 和小游戏扩展 API
   */
  const tt: Omit<typeof API, 'request' | 'clearStorage'> & MiniGameAPIExtension;
}

export {};
