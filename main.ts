// Pigeon Pitch, One Line — make.fun entry
// Writes one elevator pitch (a city pigeon pitching investors its startup)
// to $MAKEFUN_OUTPUT_DIR/entry.txt. Node 22, stdlib-only, deterministic.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entry's home directory, resolved from this script's own location
// (never from process.cwd(), which the sandbox may set anywhere).
const scriptDir = dirname(fileURLToPath(import.meta.url));

const ENTRY =
  "Investors, meet CrumbDash: my 40,000 pigeons deliver your leftovers before the rats do — no drivers, no rent, just wings, a statue to nap on, and a seed round. Actual seed.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

// The sandbox provides the output directory; create it only if missing,
// never delete or recreate it, and never copy dotfiles into it.
mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, ENTRY, "utf8");

console.log(`Wrote ${ENTRY.length} chars from ${scriptDir} to ${entryPath}`);
