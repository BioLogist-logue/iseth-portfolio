import { lazy } from "react";
import { ARCHETYPES, resolveArchetypeId, type SceneFamily } from "@/lib/archetypes";
import type { SceneTemplate } from "@/lib/types";

/**
 * Floor scene code is split per scene family and loaded on demand.
 * The elevator calls preloadFloorScene() as soon as a button is pressed,
 * so the destination code is usually loaded before the doors have closed.
 */
const loaders: Record<SceneFamily, () => Promise<unknown>> = {
  lobby: () => import("./LobbyScene"),
  garden: () => import("./GardenScene"),
  hall: () => import("./HallFloorScene"),
};

export function sceneFamily(t: SceneTemplate): SceneFamily {
  return ARCHETYPES[resolveArchetypeId(t)]?.family ?? "hall";
}

export const FloorSceneComponents = {
  lobby: lazy(() => import("./LobbyScene")),
  garden: lazy(() => import("./GardenScene")),
  hall: lazy(() => import("./HallFloorScene")),
};

export function preloadFloorScene(t: SceneTemplate) {
  void loaders[sceneFamily(t)]();
}
