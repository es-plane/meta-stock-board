import { defineConfig } from "vitest/config";

// explorerのworktreeコピー（.loops/explore/*/workspace）をテスト対象から除外する
export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/.loops/**"],
  },
});
