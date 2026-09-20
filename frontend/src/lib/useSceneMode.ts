import { useEffect } from "react";
import { useSceneStore, type SceneMode } from "@/store/sceneStore";

export function useSceneMode(mode: SceneMode) {
  const setMode = useSceneStore((state) => state.setMode);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
}
