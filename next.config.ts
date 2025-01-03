import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";

type Envs = {
  ENV: string;
};

const nextConfig = (
  phase: string,
  { defaultConfig }: { defaultConfig: NextConfig }
): NextConfig => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    defaultConfig.env = {
      ...defaultConfig.env,
      ENV: "development",
    } satisfies Envs;
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    defaultConfig.env = {
      ...defaultConfig.env,
      ENV: "production",
    } satisfies Envs;
  }

  return defaultConfig;
};

export default nextConfig;
