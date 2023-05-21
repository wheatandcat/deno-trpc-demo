import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { fetchRequestHandler } from "npm:@trpc/server/adapters/fetch";
import { publicProcedure, router } from "./trpc.ts";

interface Something {
  id: number;
  name: string;
}

const appRouter = router({
  helloWorld: publicProcedure.query((req) => {
    return "Hello World";
  }),
  createSomething: publicProcedure.input(z.object({ name: z.string() }))
    .mutation((req) => {
      const s = Math.random();
      const sm: Something = { id: s, name: req.input.name };
      return sm;
    }),
});

export type AppRouter = typeof appRouter;

function handler(request: any) {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    // @ts-ignore
    router: appRouter,
    createContext: () => ({}),
  });
}

serve(handler, { port: 8000 });
