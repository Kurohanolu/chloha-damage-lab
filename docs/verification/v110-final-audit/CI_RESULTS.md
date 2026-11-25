# Stable 候補のCI

対象 `226df627cbee4fb56287ca0191774af3233f8a93`。16実行成功。

- pull_request · [v0.187 Singularity Migration](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211887) · success
- pull_request · [v0.185 anonymous feedback](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211482) · success
- pull_request · [v0.184 engine baseline](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211578) · success
- pull_request · [Damage Lab CI and status ledger](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211483) · success
- pull_request · [GitHub Pages live smoke](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211876) · success
- pull_request · [v1.0.0 Stable Promotion](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211660) · success
- pull_request · [v0.186 Accuracy & Mechanics Audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211493) · success
- pull_request · [Conditional move UI acceptance](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211585) · success
- pull_request · [Publish verified release](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532212819) · success
- pull_request · [Showdown differential audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211974) · success
- pull_request · [Independent Champions damage audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532212006) · success
- pull_request · [Showdown differential tests](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211952) · success
- pull_request · [UI & damage regression](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211803) · success
- pull_request · [v0.188 Quality Remediation](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211879) · success
- pull_request · [v1.1.0 ES-LA Localization](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532211983) · success
- push · [Independent Champions damage audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/45532200982) · success

## 変更前の記録

# CI
The 17 runs at baseline main succeeded (baseline-ci.json). This is historical evidence. On the first audit commit 9a60a371928bd9c341b0edbda7e5fe6fb94f8979 the added single-hit and boundary workflow passed; other jobs signaled changed runtime bytes against the pre.20 publication inventory and content hash. The content hash in the candidate HTML was refreshed. The publication approval for pre.20 is bound to the earlier source and is deliberately not being reassigned. The subsequent audit workflow includes the explicit failing overflow gate and uploads its raw results. Required status for production is not achieved. All run results for the current revision are visible in PR #90 checks.
