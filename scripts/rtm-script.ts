// scripts/rtm-script.ts
import fs from "node:fs";
import path from "node:path";

type Row = {
  id: string;
  summary: string;
  acceptanceCriteria: string;
  specAdr: string;
  impl: string;
  tests: string;
  evidence: string;
  status: string;
  owner: string;
};

const RTM_PATH = path.resolve("docs/traceability/rtm.md");
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
    /^\|\s*ID\s*\|\s*Summary\s*\|\s*Acceptance Criteria\s*\|\s*Spec\/ADR\s*\|\s*Impl\s*\(PRs\)\s*\|\s*Tests\s*\|\s*Evidence\s*\|\s*Status\s*\|\s*Owner\s*\|/i.test(
      ln,
    ),
  );
  if (headerIdx === -1) {
    fail(
      "Could not find RTM table with header: | ID | Summary | Acceptance Criteria | Spec/ADR | Impl (PRs) | Tests | Evidence | Status | Owner |",
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

    if (cells.length !== 9) {
      fail(`RTM row has ${cells.length} cells (expected 9):\n${ln}`);
    }

    const [id, summary, acceptanceCriteria, specAdr, impl, tests, evidence, status, owner] = cells;
    rows.push({ id, summary, acceptanceCriteria, specAdr, impl, tests, evidence, status, owner });
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
    if (!/^R-\d{3}$/.test(row.id)) {
      fail(`Invalid requirement ID format in RTM row: "${row.id}"`);
    }
    if (seen.has(row.id)) {
      fail(`Duplicate RTM row for ${row.id}`);
    }
    if (!STATUS_SET.has(row.status)) {
      fail(`Invalid Status "${row.status}" for ${row.id} (allowed: ${[...STATUS_SET].join(", ")})`);
    }

    const isTbd = (cell: string) => /^\[TBD\]$/i.test(cell.trim());
    const implTbd = isTbd(row.impl);
    const testsTbd = isTbd(row.tests);
    const specTbd = isTbd(row.specAdr);

    if (row.status === "Implemented" || row.status === "Tested" || row.status === "Verified") {
      if (implTbd) fail(`${row.id}: Implementation must not be [TBD] when status is ${row.status}`);
      if (specTbd) warn(`${row.id}: Spec/ADR is [TBD] but status is ${row.status}`);
    }
    if (row.status === "Tested" || row.status === "Verified") {
      if (testsTbd) fail(`${row.id}: Tests must not be [TBD] when status is ${row.status}`);
    }

    seen.set(row.id, row);
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