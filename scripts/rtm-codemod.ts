import fs from "node:fs";
import path from "node:path";

// Default to the repo's traceability RTM path; override with --file=...
const fileArg = process.argv.find(a => a.startsWith("--file="));
const RTM_PATH = fileArg
  ? path.resolve(fileArg.split("=")[1])
  : path.resolve("docs/traceability/rtm.md");

const WRITE = process.argv.includes("--write");

type Row = {
  raw: string;
  cells: string[];
  idx: number;
};

const STATUS_ORDER = ["Planned", "Implemented", "Tested", "Verified"] as const;
const STATUS_SET: ReadonlySet<string> = new Set(STATUS_ORDER);

function chooseStatus(cell: string): string {
  // Normalize combos like "Implemented, Tested" → highest status (Verified > Tested > Implemented > Planned)
  const tokens = cell
    .split(/[,|/;]+/g)
    .map(s => s.trim())
    .filter(Boolean);

  let best: (typeof STATUS_ORDER)[number] | null = null;
  for (const tok of tokens) {
    const title = tok.replace(/\*\*|__|`/g, "").trim();
    if (STATUS_SET.has(title)) {
      const t = title as (typeof STATUS_ORDER)[number];
      if (!best || STATUS_ORDER.indexOf(t) > STATUS_ORDER.indexOf(best)) {
        best = t;
      }
    }
  }
  // If we didn’t find a known status but the cell is a single known value, keep it; else default to original trimmed or Planned.
  if (best) return best;
  if (STATUS_SET.has(cell.trim())) return cell.trim();
  return cell.trim() || "Planned";
}

function main() {
  if (!fs.existsSync(RTM_PATH)) {
    console.error(`❌ RTM not found: ${RTM_PATH}`);
    process.exit(1);
  }
  const orig = fs.readFileSync(RTM_PATH, "utf8");
  const lines = orig.split(/\r?\n/);

  // Find the table header line (single-table RTM)
  const headerIdx = lines.findIndex(ln =>
    /^\|\s*ID\s*\|\s*Summary\s*\|\s*Acceptance Criteria\s*\|\s*Spec\/ADR\s*\|\s*Impl\s*\(PRs\)\s*\|\s*Tests\s*\|\s*Evidence\s*\|\s*Status\s*\|\s*Owner\s*\|/i.test(
      ln,
    ),
  );
  if (headerIdx === -1) {
    console.error("❌ Could not find RTM table header.");
    process.exit(1);
  }
  const sepIdx = headerIdx + 1;
  if (!/^\|[-\s|:]+\|$/.test(lines[sepIdx])) {
    console.error("❌ Expected markdown separator row under the header.");
    process.exit(1);
  }

  // Collect contiguous table rows after separator
  const rows: Row[] = [];
  let i = sepIdx + 1;
  while (i < lines.length && lines[i].trim().startsWith("|")) {
    const raw = lines[i];
    const cells = raw.split("|").slice(1, -1).map(c => c.trim());
    if (cells.length !== 9) {
      console.error(`❌ Row has ${cells.length} cells (expected 9):\n${raw}`);
      process.exit(1);
    }
    rows.push({ raw, cells, idx: i });
    i++;
  }

  let changes = 0;
  let statusFixes = 0;

  for (const r of rows) {
    const status = r.cells[7];

    // 1) Normalize Status
    const newStatus = chooseStatus(status);
    if (newStatus !== status) {
      r.cells[7] = newStatus;
      statusFixes++;
    }

    // Rebuild the raw row
    const rebuilt = `| ${r.cells.join(" | ")} |`;
    if (rebuilt !== r.raw) {
      lines[r.idx] = rebuilt;
      changes++;
    }
  }

  const output = lines.join("\n");

  // Summary
  console.log(`🔧 RTM codemod preview for ${path.relative(process.cwd(), RTM_PATH)}:`);
  console.log(`   • Rows changed: ${changes}`);
  console.log(`   • Status normalized: ${statusFixes}`);

  if (!WRITE) {
    console.log("ℹ️  Dry run (no changes written). Pass --write to save.");
    process.exit(0);
  }

  if (output !== orig) {
    fs.writeFileSync(RTM_PATH, output, "utf8");
    console.log("✅ Changes written.");
  } else {
    console.log("✅ No changes needed.");
  }
}

main();
