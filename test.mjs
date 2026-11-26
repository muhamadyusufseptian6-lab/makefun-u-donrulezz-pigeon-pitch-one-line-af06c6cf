// TDD-lite checks for the Pigeon Pitch entry (Node stdlib only).
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = new URL(".", import.meta.url).pathname;
let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};

const run = (outDir) =>
  spawnSync("node", [join(dir, "main.ts")], {
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir, MAKEFUN_INPUT_DIR: "/input" },
    encoding: "utf8",
  });

const out1 = mkdtempSync(join(tmpdir(), "pigeon-1-"));
const out2 = mkdtempSync(join(tmpdir(), "pigeon-2-"));
const r1 = run(out1);
const r2 = run(out2);
check("main.ts exits 0", r1.status === 0, r1.stderr || "");
const entry1 = existsSync(join(out1, "entry.txt")) ? readFileSync(join(out1, "entry.txt"), "utf8") : "";
const entry2 = existsSync(join(out2, "entry.txt")) ? readFileSync(join(out2, "entry.txt"), "utf8") : "";
check("entry.txt exists and is non-empty", entry1.length > 0);
check("entry is 1..200 chars", entry1.length >= 1 && entry1.length <= 200, `${entry1.length} chars`);
check("entry is not only whitespace", entry1.trim().length > 0);
check("entry is a single line", !entry1.includes("\n"));
check("deterministic: two runs identical", entry1 === entry2);
const src = readFileSync(join(dir, "main.ts"), "utf8");
check("stdlib-only (no npm imports)", !/from\s+["'](?!node:)[^."/][^"']*["']/.test(src) && !/require\(["'](?!node:)[^."/]/.test(src));
check("entry mentions investors + a startup idea", /investor/i.test(entry1) && entry1.length > 40);
console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
