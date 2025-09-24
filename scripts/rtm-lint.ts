import { readFileSync } from "node:fs";
import path from "node:path";

// Placeholder for future RTM-specific lint checks.
// Currently, it just verifies the RTM table header is present.

const fileArg = process.argv.find(a => a.startsWith("--file="));
const RTM_PATH = fileArg
  ? path.resolve(fileArg.split("=")[1])
  : path.resolve("docs/traceability/rtm.md");

const content = readFileSync(RTM_PATH, "utf8");
const hasHeader = /\|\s*Requirement\s*\|\s*PRD Ref\s*\|\s*Techspec Ref\s*\|\s*Implementation\s*\|\s*Tests\s*\|\s*Status\s*\|\s*Notes\s*\|/.test(
  content,
);
if (!hasHeader) {
  console.error("RTM header not found.");
  process.exit(1);
}
console.log("RTM lint: header OK");
