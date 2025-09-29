// scripts/rtm-lint.ts
import fs from "node:fs";
import path from "node:path";

type Row = {
  requirement: string;
  prd: string;
  techspec: string;
  impl: string;
  tests: string;
  status: string;
  notes: string;
};

const RTM_PATH = path.resolve("docs/rtm.md");
const REQ_PATH = path.resolve("docs/requirements.md");

const STATUS_SET = new Set(["Planned", "Implemented", "Tested", "Verified"]);
const RE_REQ_ID = /\bR-(\d{3})\b/g;

function fail(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function warn(msg: string) {
  console.warn(`⚠️  ${msg}`);
}

function ok(msg: string) {
  console.log(`✅ ${msg}`);
}

function loadFile(p: string): string {
  if (!fs.existsSync(p)) fail(`File not found: ${p}`);
  return fs.readFileSync(p, "utf8");
}

function extractAllRequirementIdsFromRequirementsMd(md: string): string[] {
  const ids = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = RE_REQ_ID.exec(md))) {
    ids.add(`R-${m[1]}`);
  }
  if (ids.size === 0) fail("No requirement IDs (R-###) found in requirements.md");
  return [...ids].sort();
}

/**
 * Parse the first markdown table whose header includes:
 * Requirement | PRD Ref | Techspec Ref | Implementation | Tests | Status | Notes
 */
function parseRtmTable(md: string): Row[] {
  const lines = md.split(/\r?\n/);
  const headerIdx = lines.findIndex((ln) =>
    /^\|\s*Requirement\s*\|\s*PRD Ref\s*\|\s*Techspec Ref\s*\|\s*Implementation\s*\|\s*Tests\s*\|\s*Status\s*\|\s*Notes\s*\|/i.test(
      ln,
    ),
  );
  if (headerIdx === -1) {
    fail(
      "Could not find RTM table with header: | Requirement | PRD Ref | Techspec Ref | Implementation | Tests | Status | Notes |",
    );
  }

  // Expect the next line to be the markdown separator row ("| --- | --- | ... |")
  const sepIdx = headerIdx + 1;
  if (!/^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|/.test(lines[sepIdx])) {
    fail("RTM table missing separator row under the header.");
  }

  // Collect subsequent table rows until a non-table line appears
  const rows: Row[] = [];
  for (let i = sepIdx + 1; i < lines.length; i++) {
    const ln = lines[i];
    if (!ln.trim().startsWith("|")) break;
    const cells = ln
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    if (cells.length !== 7) {
      fail(`RTM row has ${cells.length} cells (expected 7):\n${ln}`);
    }

    const [requirement, prd, techspec, impl, tests, status, notes] = cells;
    rows.push({ requirement, prd, techspec, impl, tests, status, notes });
  }
  if (rows.length === 0) fail("RTM table has no data rows.");
  return rows;
}

function collectReverseIndex(md: string): { text: string; reqIds: Set<string> } {
  const idx = md.search(/##\s+Reverse Index\s*\(Implementation\s*→\s*Requirements\)/i);
  if (idx === -1) fail("Missing section: '## Reverse Index (Implementation → Requirements)'.");
  const section = md.slice(idx);
  const reqIds = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = RE_REQ_ID.exec(section))) {
    reqIds.add(`R-${m[1]}`);
  }
  return { text: section, reqIds };
}

function main() {
  const rtm = loadFile(RTM_PATH);
  const req = loadFile(REQ_PATH);

  const requiredIds = extractAllRequirementIdsFromRequirementsMd(req);
  ok(`Found ${requiredIds.length} requirement IDs in requirements.md`);

  const rows = parseRtmTable(rtm);
  ok(`Parsed ${rows.length} RTM row(s)`);

  // Map RTM
  const seen = new Map<string, Row>();
  for (const row of rows) {
    if (!/^R-\d{3}$/.test(row.requirement)) {
      fail(`Invalid requirement ID format in RTM row: "${row.requirement}"`);
    }
    if (seen.has(row.requirement)) {
      fail(`Duplicate RTM row for ${row.requirement}`);
    }
    if (!STATUS_SET.has(row.status)) {
      fail(`Invalid Status "${row.status}" for ${row.requirement} (allowed: ${[...STATUS_SET].join(", ")})`);
    }

    // Enforce TBD rules
    const implTbd = row.impl === "[TBD]";
    const testsTbd = row.tests === "[TBD]";
    const prdTbd = row.prd === "[TBD]";
    const techTbd = row.techspec === "[TBD]";

    if (row.status === "Implemented" || row.status === "Tested" || row.status === "Verified") {
      if (implTbd) fail(`${row.requirement}: Implementation must not be [TBD] when status is ${row.status}`);
      if (prdTbd) warn(`${row.requirement}: PRD Ref is [TBD] but status is ${row.status}`);
      if (techTbd) warn(`${row.requirement}: Techspec Ref is [TBD] but status is ${row.status}`);
    }
    if (row.status === "Tested" || row.status === "Verified") {
      if (testsTbd) fail(`${row.requirement}: Tests must not be [TBD] when status is ${row.status}`);
    }

    seen.set(row.requirement, row);
  }

  // Coverage check
  const missing = requiredIds.filter((id) => !seen.has(id));
  if (missing.length) {
    fail(
      `RTM missing ${missing.length} requirement(s) from requirements.md: ${missing
        .slice(0, 20)
        .join(", ")}${missing.length > 20 ? " …" : ""}`,
    );
  } else {
    ok("RTM covers all requirements from requirements.md");
  }

  // Reverse index sanity
  const rev = collectReverseIndex(rtm);
  if (rev.reqIds.size === 0) warn("Reverse Index has no requirement IDs; add mappings when files exist.");
  // ensure all referenced IDs exist in requirements
  for (const id of rev.reqIds) {
    if (!requiredIds.includes(id)) {
      fail(`Reverse Index references unknown requirement ID: ${id}`);
    }
  }
  ok("Reverse Index section present and references valid requirement IDs");

  ok("RTM lint passed.");
}

main();