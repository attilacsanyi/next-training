import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";

type Envs = {
  ENV: string;
};

const nextConfig = (phase: string, config: NextConfig): NextConfig => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config.env = {
      ...config.env,
      ENV: "development",
    } satisfies Envs;
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    config.env = {
      ...config.env,
      ENV: "production",
    } satisfies Envs;
  }

  return config;
};

export default nextConfig;
