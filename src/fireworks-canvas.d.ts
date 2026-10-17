// Type declarations for the CJS package `fireworks-canvas`.
// This ambient module shadows the package's own fireworks.d.ts (which uses
// `export =` + a class/namespace merge that TS resolves poorly here), so it
// must list every API member we rely on - keep in sync with fireworks.mjs.
declare module 'fireworks-canvas' {
  interface Point {
    x: number;
    y: number;
  }

  interface FireworksOptions {
    maxRockets?: number;
    rocketSpawnInterval?: number;
    numParticles?: number;
    explosionMinHeight?: number;
    explosionMaxHeight?: number;
    explosionChance?: number;
    rocketInitialPoint?: number;
    cannons?: Point[];
    width?: number;
    height?: number;
  }

  export default class Fireworks {
    constructor(container: HTMLElement, options?: FireworksOptions);
    destroy(): void;
    start(): () => void;
    stop(): void;
    kill(): void;
    fire(): void;
    update(): void;
    setSize(width: number, height: number): void;
    resetSize(): void;
    onFinish(cb: () => void): void;
  }
}

