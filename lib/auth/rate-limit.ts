import "server-only";

import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function createAuthLimiter(
  prefix: string,
  limiter: ReturnType<typeof Ratelimit.slidingWindow>,
) {
  const rateLimiter = new Ratelimit({
    redis,
    limiter,
    prefix,
  });

  return {
    limit(identifier: string) {
      const hashedIdentifier = createHash("sha256")
        .update(identifier)
        .digest("hex");

      return rateLimiter.limit(hashedIdentifier);
    },
  };
}

export const authRateLimits = {
  register: createAuthLimiter(
    "pokedev:auth:register",
    Ratelimit.slidingWindow(5, "1 h"),
  ),

  login: createAuthLimiter(
    "pokedev:auth:login",
    Ratelimit.slidingWindow(5, "15 m"),
  ),

  emailVerification: createAuthLimiter(
    "pokedev:auth:verify",
    Ratelimit.slidingWindow(3, "15 m"),
  ),

  passwordReset: createAuthLimiter(
    "pokedev:auth:password-reset",
    Ratelimit.slidingWindow(3, "1 h"),
  ),
};
