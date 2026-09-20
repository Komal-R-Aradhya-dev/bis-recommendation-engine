import { create } from "zustand";

export type SceneMode =
  | "auth"
  | "hero"
  | "analyzing"
  | "results"
  | "settings";

interface SceneState {
  mode: SceneMode;
  setMode: (mode: SceneMode) => void;
}

export const SCENE_MODE_INDEX: Record<SceneMode, number> = {
  auth: 0,
  hero: 1,
  analyzing: 2,
  results: 3,
  settings: 4,
};

export const useSceneStore = create<SceneState>((set) => ({
  mode: "hero",
  setMode: (mode) => set({ mode }),
}));
