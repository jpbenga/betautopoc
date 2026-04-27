from __future__ import annotations

import unittest

from betauto.selection_engine.selector import (
    extract_json_from_llm_response,
    repair_json_string,
    safe_parse_json,
)


class SelectorJsonParsingTests(unittest.TestCase):
    def test_safe_parse_json_repairs_missing_comma(self) -> None:
        broken = '{"status":"completed" "picks":[]}'
        parsed = safe_parse_json(broken)
        self.assertEqual(parsed["status"], "completed")
        self.assertEqual(parsed["picks"], [])

    def test_safe_parse_json_extracts_with_prefix_suffix(self) -> None:
        payload = 'Voici la réponse: {"status":"completed","picks":[]} Merci.'
        parsed = safe_parse_json(payload)
        self.assertEqual(parsed["status"], "completed")

    def test_safe_parse_json_extracts_from_markdown_json_block(self) -> None:
        payload = "```json\n{\"status\":\"completed\",\"picks\":[]}\n```"
        parsed = safe_parse_json(payload)
        self.assertEqual(parsed["status"], "completed")

    def test_safe_parse_json_valid_json_passthrough(self) -> None:
        payload = '{"status":"completed","picks":[]}'
        parsed = safe_parse_json(payload)
        self.assertEqual(parsed["status"], "completed")

    def test_extract_json_from_llm_response_only_returns_object(self) -> None:
        payload = "hello ```json\n{\"a\":1}\n``` world"
        extracted = extract_json_from_llm_response(payload)
        self.assertEqual(extracted, '{"a":1}')

    def test_repair_json_string_handles_python_literals(self) -> None:
        payload = "{status: 'ok', value: None, enabled: True,}"
        repaired = repair_json_string(payload)
        parsed = safe_parse_json(repaired)
        self.assertEqual(parsed["status"], "ok")
        self.assertIsNone(parsed["value"])
        self.assertTrue(parsed["enabled"])


if __name__ == "__main__":
    unittest.main()
