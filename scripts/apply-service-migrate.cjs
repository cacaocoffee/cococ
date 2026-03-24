const fs = require('fs');

const files = [
  'src/pages/admin/applications/index.jsx',
  'src/pages/admin/period/index.jsx',
  'src/pages/apply/index.jsx',
  'src/pages/apply/ClosedScreen.jsx',
  'src/pages/apply/steps/Step2Activity.jsx',
];

// Replace the import block
const importRegex = /import\s*\{[^}]+\}\s*from\s*["']@\/hooks\/useApplications["'];?/gs;

// Method name mappings (old → new)
const methodMap = [
  ['updateApplicationField(', 'applyService.updateFields('],
  ['loadApplications(', 'applyService.loadApplications('],
  ['saveApplication(', 'applyService.saveApplication('],
  ['updateStatus(', 'applyService.updateStatus('],
  ['deleteApplication(', 'applyService.deleteApplication('],
  ['loadInterviewSettings(', 'applyService.loadInterviewSettings('],
  ['saveInterviewSettings(', 'applyService.saveInterviewSettings('],
  ['loadApplyPeriod(', 'applyService.loadApplyPeriod('],
  ['saveApplyPeriod(', 'applyService.saveApplyPeriod('],
  ['isApplyOpen(', 'applyService.isApplyOpen('],
  ['DEFAULT_INTERVIEW_SETTINGS', 'applyService.DEFAULT_INTERVIEW_SETTINGS'],
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');

  // Replace import block
  content = content.replace(importRegex, `import { applyService } from "@/domain/apply/apply-service";`);

  // Replace usages
  for (const [from, to] of methodMap) {
    content = content.split(from).join(to);
  }

  fs.writeFileSync(f, content);
  console.log('✓', f);
}
console.log('완료');
