# Singularity v1.0.0 promotion baseline

This immutable checkpoint preserves the pre-edit state. Existing pre.1 production and prior conditional audit remain unchanged. Promotion direction is approved; final candidate publication/risk acceptance is still pending. No earlier CI is reused as stable-candidate acceptance.

```json
{
  "recordedAtJST": "2026-11-15 17:22:02+09:00",
  "sourceMain": "4f068544e670a85a6a4d34dd2c26e2be66bd9cb7",
  "sourceMainTree": "cf7af9334261b0cfbbde45929da9d217445fe526",
  "auditedCandidate": "c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095",
  "auditedTree": "bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b",
  "priorReportCommit": "be01f25ae9597b16551a5fa963e093b2247eff9f",
  "priorSolVerdict": "CONDITIONAL READY",
  "pullRequest": 67,
  "branch": "audit/v0188-astra-quality",
  "prState": "open/draft/unmerged",
  "targetVersion": "1.0.0",
  "targetTag": "v1.0.0",
  "existingRelease": "v0.188-pre.1",
  "existingTagPreserved": true,
  "stableTagsFoundByGit": [],
  "publicRepoMain": "b30c0f1863f3262574cf5365721be87c42ffa3e9",
  "existingOtherOpenPRs": [
    {
      "number": 46,
      "scope": "historical9-languagefoundation",
      "draft": true
    },
    {
      "number": 38,
      "scope": "historicalJAENfoundation",
      "draft": true
    }
  ],
  "rollbackSource": "4f068544e670a85a6a4d34dd2c26e2be66bd9cb7",
  "newSite": "https://kurohanolu.github.io/singularity/",
  "legacySite": "https://kurohanolu.github.io/chloha-damage-lab/",
  "priorCandidateCI": [
    {
      "id": 43691428099,
      "name": "Showdown differential audit",
      "conclusion": "success"
    },
    {
      "id": 43691428041,
      "name": "Showdown differential tests",
      "conclusion": "success"
    },
    {
      "id": 43691428158,
      "name": "Publish verified prerelease",
      "conclusion": "success"
    },
    {
      "id": 43691428114,
      "name": "GitHub Pages live smoke",
      "conclusion": "success"
    },
    {
      "id": 43691428229,
      "name": "Damage Lab CI and status ledger",
      "conclusion": "success"
    },
    {
      "id": 43691428027,
      "name": "v0.184 engine baseline",
      "conclusion": "success"
    },
    {
      "id": 43691428096,
      "name": "v0.185 anonymous feedback",
      "conclusion": "success"
    },
    {
      "id": 43691428044,
      "name": "v0.186 Accuracy & Mechanics Audit",
      "conclusion": "success"
    },
    {
      "id": 43691428061,
      "name": "v0.187 Singularity Migration",
      "conclusion": "success"
    },
    {
      "id": 43691428053,
      "name": "UI & damage regression",
      "conclusion": "success"
    },
    {
      "id": 43691428060,
      "name": "v0.188 Quality Remediation",
      "conclusion": "success"
    }
  ],
  "authorization": {
    "stablePromotionDirection": "approved by owner instruction",
    "preparation": "authorized",
    "finalCandidateRiskAcceptance": "pending after review",
    "publication": "requires recorded independent Sol review and explicit final owner acceptance"
  },
  "limits": [
    "Cloudflare authenticated management not established; fresh public/read-only work in progress",
    "Physical devices, game hardware, native screen readers and OS IME not comprehensively verified",
    "Long-session and universal memory stability not established",
    "Declared partial/unsupported/unverified mechanics remain so"
  ],
  "resume": "Continue PR67 with stable metadata/UI/release-gate changes; freeze new SHA, execute all mandatory CI and independentSol review before seeking concrete final publication decision. No merge/tag/release/deploy."
}
```
