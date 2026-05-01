# BetAuto Agent Notes

- Before changing API-Football calls, mappings, normalizers, coverage scripts, or football analysis context code, consult `docs/api-football/usage-rules.md` and `docs/api-football/endpoint-reference.md`.
- Treat the raw files in `docs/api-football/*-raw.md` as the local official source extracts for endpoint details.
- Before changing OpenAI analysis, agent, prompt, model, cost, or orchestration code, consult `docs/api-openai/betauto_ai_workflow_plan.md` and the local OpenAI extracts in `docs/api-openai/`.
- Do not invent API-Football IDs, seasons, endpoint parameters, or fallbacks. Surface ambiguity explicitly.
- Keep strict-mode behavior intact unless the user explicitly requests legacy behavior.
