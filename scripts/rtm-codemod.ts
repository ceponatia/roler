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

function normalizeRefCell(cell: string, baseDir: string): string {
  const trimmed = cell.trim();

  // If explicitly [TBD], keep it
  if (/^\[TBD\]$/i.test(trimmed)) return "[TBD]";

  // If the cell has mixed content like "[TBD] somepath", split by ; or spaces and test each
  const candidates = trimmed
    // strip backticks/markdown links while preserving relative path-ish tokens
    .replace(/`/g, "")
    .split(/[;,\n]+/g)
    .map(s => s.trim())
    .filter(Boolean);

  if (candidates.length === 0) return "[TBD]";

  // Keep only paths that exist; if none exist, return [TBD]
  const existing: string[] = [];
  for (const cand of candidates) {
    if (cand.toLowerCase() === "[tbd]") continue;

    // allow markdown links: [text](path)
    const linkMatch = cand.match(/\[[^\]]*\]\(([^)]+)\)/);
    const rel = linkMatch ? linkMatch[1] : cand;

    // ignore obvious non-path notes
    if (/^https?:\/\//i.test(rel)) continue;

    // resolve relative to repo root and the baseDir (doc folder)
    const p = path.resolve(rel);
    const p2 = path.resolve(baseDir, rel);
    if (fs.existsSync(p)) existing.push(rel);
    else if (fs.existsSync(p2)) existing.push(path.relative(process.cwd(), p2));
  }

  if (existing.length === 0) return "[TBD]";
  return existing.join("; ");
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
    /^\|\s*Requirement\s*\|\s*PRD Ref\s*\|\s*Techspec Ref\s*\|\s*Implementation\s*\|\s*Tests\s*\|\s*Status\s*\|\s*Notes\s*\|/i.test(
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
    if (cells.length !== 7) {
      console.error(`❌ Row has ${cells.length} cells (expected 7):\n${raw}`);
      process.exit(1);
    }
    rows.push({ raw, cells, idx: i });
    i++;
  }

  let changes = 0;
  let statusFixes = 0;
  let prdFixes = 0;
  let techFixes = 0;

  for (const r of rows) {
    const [_req, prd, tech, _impl, _tests, status, _notes] = r.cells;

    // 1) Normalize Status
    const newStatus = chooseStatus(status);
    if (newStatus !== status) {
      r.cells[5] = newStatus;
      statusFixes++;
    }

    // 2) Normalize PRD/Techspec refs against filesystem existence
    const newPrd = normalizeRefCell(prd, path.dirname(RTM_PATH));
    if (newPrd !== prd) {
      r.cells[1] = newPrd;
      prdFixes++;
    }
    const newTech = normalizeRefCell(tech, path.dirname(RTM_PATH));
    if (newTech !== tech) {
      r.cells[2] = newTech;
      techFixes++;
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
  console.log(`   • PRD refs adjusted: ${prdFixes}`);
  console.log(`   • Techspec refs adjusted: ${techFixes}`);

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
