import { Component, Input } from '@angular/core';
import { confidenceScoreToTone } from '../../../core/api/api.mappers';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { SectionCardComponent } from '../section-card/section-card.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.id;
const _forTrack2 = ($index, $item) => $item + $index;
const _forTrack3 = ($index, $item) => $item.market_canonical_id + $item.selection_canonical_id + $index;
const _forTrack4 = ($index, $item) => $item.key;
function RunOutputInspectorComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 5);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("label", (ctx_r0.outputs == null ? null : ctx_r0.outputs.run_dir) || "");
} }
function RunOutputInspectorComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 7);
} if (rf & 2) {
    i0.ɵɵproperty("showPip", true);
} }
function RunOutputInspectorComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-loading-state", 9);
} if (rf & 2) {
    i0.ɵɵproperty("showShimmer", true);
} }
function RunOutputInspectorComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 10);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function RunOutputInspectorComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 11);
} }
function RunOutputInspectorComponent_Conditional_18_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "p", 1);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 21);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 22);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const card_r3 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r3.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r3.value);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r3.detail);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_3_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const status_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", status_r5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(status_r5);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_3_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 30)(1, "div", 33)(2, "p", 34);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 35);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 28);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", row_r6.index, " \u00B7 ", row_r6.event);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", row_r6.competition, " \u00B7 ", row_r6.kickoff);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", row_r6.status)("tone", ctx_r0.progressTone(row_r6.status))("showPip", true)("pulse", row_r6.status === "running");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_3_ForEmpty_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 31);
    i0.ɵɵtext(1, "No progress row matches this filter.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_3_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_3_Conditional_18_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleShowAll("progress")); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllProgress ? "Show less" : "Show all " + ctx_r0.filteredProgressRows.length, " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 14)(1, "div", 23)(2, "div")(3, "p", 1);
    i0.ɵɵtext(4, "Live match progress");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h4", 2);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 24)(8, "select", 25);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_3_Template_select_change_8_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.setStatusFilter($event)); });
    i0.ɵɵelementStart(9, "option", 26);
    i0.ɵɵtext(10, "All statuses");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(11, RunOutputInspectorComponent_Conditional_18_Conditional_3_For_12_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "ba-status-badge", 28);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 29);
    i0.ɵɵrepeaterCreate(15, RunOutputInspectorComponent_Conditional_18_Conditional_3_For_16_Template, 7, 8, "article", 30, _forTrack1, false, RunOutputInspectorComponent_Conditional_18_Conditional_3_ForEmpty_17_Template, 2, 0, "p", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(18, RunOutputInspectorComponent_Conditional_18_Conditional_3_Conditional_18_Template, 2, 1, "button", 32);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r0.progressSummary);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.statusFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.progressStatusOptions);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", ctx_r0.progressStatus)("tone", ctx_r0.progressTone(ctx_r0.progressStatus))("showPip", true)("pulse", ctx_r0.progressStatus === "running");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.visibleProgressRows);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.filteredProgressRows.length > ctx_r0.progressLimit ? 18 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 37);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("message", ((tmp_3_0 = ctx_r0.artifact("match_analysis")) == null ? null : tmp_3_0.error) || "Artifact missing for this run.");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const competition_r9 = ctx.$implicit;
    i0.ɵɵproperty("value", competition_r9);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(competition_r9);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 56);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const factor_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(factor_r10);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1, "No key factors returned.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 56);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const risk_r11 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(risk_r11);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1, "No explicit risks returned.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 64)(1, "div", 66)(2, "div", 33)(3, "p", 67);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 3);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 68);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const market_r12 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(market_r12.market_canonical_id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(market_r12.selection_canonical_id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", market_r12.confidenceLabel)("tone", ctx_r0.confidenceTone(market_r12.confidence));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(market_r12.reason);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 65);
    i0.ɵɵtext(1, "No predicted market returned for this match.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 51)(1, "div", 52)(2, "div", 33)(3, "p", 1);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h4", 53);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 54);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 4);
    i0.ɵɵelement(10, "ba-status-badge", 6)(11, "ba-status-badge", 6)(12, "ba-status-badge", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 55)(14, "div", 13)(15, "p", 1);
    i0.ɵɵtext(16, "Event");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p", 56);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 13)(20, "p", 1);
    i0.ɵɵtext(21, "Competition");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "p", 56);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 13)(25, "p", 1);
    i0.ɵɵtext(26, "Kickoff");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "p", 56);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 57)(30, "p", 1);
    i0.ɵɵtext(31, "Analysis summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "p", 58);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(34, "div", 59)(35, "div", 13)(36, "p", 1);
    i0.ɵɵtext(37, "Key factors");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(38, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_39_Template, 2, 1, "p", 56, _forTrack2, false, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_40_Template, 2, 0, "p", 60);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "div", 13)(42, "p", 1);
    i0.ɵɵtext(43, "Risks");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(44, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_45_Template, 2, 1, "p", 56, _forTrack2, false, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_46_Template, 2, 0, "p", 60);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(47, "div", 61)(48, "div", 13)(49, "p", 1);
    i0.ɵɵtext(50, "Global confidence");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "div", 62);
    i0.ɵɵelement(52, "ba-status-badge", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(53, "div", 13)(54, "p", 1);
    i0.ɵɵtext(55, "Data quality");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "div", 62);
    i0.ɵɵelement(57, "ba-status-badge", 6);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(58, "div", 57)(59, "p", 1);
    i0.ɵɵtext(60, "Predicted markets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "div", 63);
    i0.ɵɵrepeaterCreate(62, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_For_63_Template, 10, 5, "article", 64, _forTrack3, false, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_ForEmpty_64_Template, 2, 0, "p", 65);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const match_r13 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("border-accent/40", match_r13.confidence_tier === "elite")("border-success/40", match_r13.confidence_tier === "very_strong")("border-warning/40", match_r13.confidence_tier === "strong")("border-danger/30", match_r13.confidence_tier === "medium_or_low")("border-border/60", match_r13.confidence_tier === "unknown");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(match_r13.competition);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(match_r13.event);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(match_r13.kickoffDisplay);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", match_r13.confidence_tier)("tone", ctx_r0.confidenceTierTone(match_r13.confidence_tier));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", match_r13.global_confidence)("tone", ctx_r0.confidenceTone(match_r13.global_confidence_value));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", match_r13.data_quality)("tone", ctx_r0.qualityTone(match_r13.data_quality));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(match_r13.event);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(match_r13.competition);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(match_r13.kickoffDisplay);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(match_r13.summary);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(match_r13.keyFactors);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(match_r13.risks);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("label", match_r13.global_confidence)("tone", ctx_r0.confidenceTone(match_r13.global_confidence_value));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("label", match_r13.data_quality)("tone", ctx_r0.qualityTone(match_r13.data_quality));
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(match_r13.predicted_markets);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_ForEmpty_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 50);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Conditional_28_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleShowAll("matches")); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllMatches ? "Show less" : "Show more matches (" + ctx_r0.filteredMatchRows.length + ")", " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 38)(1, "select", 39);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Template_select_change_1_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setCompetitionFilter($event)); });
    i0.ɵɵelementStart(2, "option", 26);
    i0.ɵɵtext(3, "All competitions");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_5_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "select", 40);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Template_select_change_6_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setMatchProfileFilter($event)); });
    i0.ɵɵelementStart(7, "option", 26);
    i0.ɵɵtext(8, "All analyses");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "option", 41);
    i0.ɵɵtext(10, "Premium only (80%+)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "option", 42);
    i0.ɵɵtext(12, "Standard only (<80%)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "select", 43);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Template_select_change_13_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setMatchConfidenceFilter($event)); });
    i0.ɵɵelementStart(14, "option", 26);
    i0.ɵɵtext(15, "All confidence tiers");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "option", 44);
    i0.ɵɵtext(17, "Elite (90%+)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "option", 45);
    i0.ɵɵtext(19, "Very strong (80-89%)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "option", 46);
    i0.ɵɵtext(21, "Strong (70-79%)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "option", 47);
    i0.ɵɵtext(23, "Medium / low (<70%)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div", 48);
    i0.ɵɵrepeaterCreate(25, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_For_26_Template, 65, 30, "article", 49, _forTrack1, false, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_ForEmpty_27_Template, 1, 0, "ba-empty-state", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(28, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Conditional_28_Template, 2, 1, "button", 32);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.competitionFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.competitionOptions);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.matchProfileFilter);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("value", ctx_r0.matchConfidenceFilter);
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(ctx_r0.visibleMatchRows);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.filteredMatchRows.length > ctx_r0.rowLimit ? 28 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵconditionalCreate(1, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_1_Template, 1, 1, "ba-empty-state", 37)(2, RunOutputInspectorComponent_Conditional_18_Conditional_13_Conditional_2_Template, 29, 5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isAvailable(ctx_r0.artifact("match_analysis")) ? 1 : 2);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 69);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("message", ((tmp_3_0 = ctx_r0.artifact("aggregation_candidates")) == null ? null : tmp_3_0.error) || "Artifact missing for this run.");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const market_r16 = ctx.$implicit;
    i0.ɵɵproperty("value", market_r16);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(market_r16);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tier_r17 = ctx.$implicit;
    i0.ɵɵproperty("value", tier_r17);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tier_r17);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_13_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 79)(1, "p", 80);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "dl", 81)(4, "div")(5, "dt", 1);
    i0.ɵɵtext(6, "Odds");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "dd", 82);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div")(10, "dt", 1);
    i0.ɵɵtext(11, "Source");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "dd", 83);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div")(15, "dt", 1);
    i0.ɵɵtext(16, "Risk");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "dd", 83);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div")(20, "dt", 1);
    i0.ɵɵtext(21, "Tier");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "dd", 83);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const candidate_r19 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r19.reasoning);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(candidate_r19.odds);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(candidate_r19.odds_source);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(candidate_r19.risk);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(candidate_r19.tier);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_13_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 73)(1, "button", 75);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_13_Template_button_click_1_listener() { const candidate_r19 = i0.ɵɵrestoreView(_r18).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleRow("candidate:" + candidate_r19.id)); });
    i0.ɵɵelementStart(2, "span", 33)(3, "span", 76);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 77);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 77);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "span", 4);
    i0.ɵɵelement(10, "ba-status-badge", 5)(11, "ba-status-badge", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 78);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(14, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_13_Conditional_14_Template, 24, 5, "div", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const candidate_r19 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(candidate_r19.event);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", candidate_r19.competition, " \u00B7 ", candidate_r19.kickoff);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", candidate_r19.market, " \u00B7 ", candidate_r19.pick);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", candidate_r19.tier);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", candidate_r19.risk)("tone", ctx_r0.riskTone(candidate_r19.risk));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r19.confidence);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isRowOpen("candidate:" + candidate_r19.id) ? 14 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_ForEmpty_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 74);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleShowAll("aggregation")); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllAggregation ? "Show less" : "Show more candidates (" + ctx_r0.filteredAggregationRows.length + ")", " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 38)(1, "select", 70);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Template_select_change_1_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setMarketFilter($event)); });
    i0.ɵɵelementStart(2, "option", 26);
    i0.ɵɵtext(3, "All markets");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_5_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "select", 71);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Template_select_change_6_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setTierFilter($event)); });
    i0.ɵɵelementStart(7, "option", 26);
    i0.ɵɵtext(8, "All confidence tiers");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(9, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_10_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 72);
    i0.ɵɵrepeaterCreate(12, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_For_13_Template, 15, 10, "article", 73, _forTrack1, false, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_ForEmpty_14_Template, 1, 0, "ba-empty-state", 74);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(15, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Conditional_15_Template, 2, 1, "button", 32);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.marketFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.marketOptions);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.tierFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.tierOptions);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.visibleAggregationRows);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.filteredAggregationRows.length > ctx_r0.rowLimit ? 15 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵconditionalCreate(1, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_1_Template, 1, 1, "ba-empty-state", 69)(2, RunOutputInspectorComponent_Conditional_18_Conditional_22_Conditional_2_Template, 16, 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isAvailable(ctx_r0.artifact("aggregation_candidates")) ? 1 : 2);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 84);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("message", ((tmp_3_0 = ctx_r0.artifact("filtered_candidates")) == null ? null : tmp_3_0.error) || "Artifact missing for this run.");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const market_r22 = ctx.$implicit;
    i0.ɵɵproperty("value", market_r22);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(market_r22);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tier_r23 = ctx.$implicit;
    i0.ɵɵproperty("value", tier_r23);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tier_r23);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_20_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 79)(1, "p", 80);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 60);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 89);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const candidate_r25 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r25.reasoning);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Reasons: ", candidate_r25.reasons);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("Odds ", candidate_r25.odds, " \u00B7 ", candidate_r25.odds_source, " \u00B7 ", candidate_r25.tier);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_20_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 73)(1, "button", 75);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_20_Template_button_click_1_listener() { const candidate_r25 = i0.ɵɵrestoreView(_r24).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleRow("filtered:" + candidate_r25.id)); });
    i0.ɵɵelementStart(2, "span", 33)(3, "span", 76);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 77);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 77);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "span", 4);
    i0.ɵɵelement(10, "ba-status-badge", 6)(11, "ba-status-badge", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 78);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(14, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_20_Conditional_14_Template, 7, 5, "div", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const candidate_r25 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", candidate_r25.event, " \u00B7 ", candidate_r25.pick);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", candidate_r25.competition, " \u00B7 ", candidate_r25.kickoff);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r25.market);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", candidate_r25.retained ? "retained" : "rejected")("tone", candidate_r25.retained ? "success" : "warning");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", candidate_r25.risk)("tone", ctx_r0.riskTone(candidate_r25.risk));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r25.confidence);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isRowOpen("filtered:" + candidate_r25.id) ? 14 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_ForEmpty_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 88);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Conditional_22_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r26); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleShowAll("filtered")); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllFiltered ? "Show less" : "Show more filtered candidates (" + ctx_r0.filteredCandidateRows.length + ")", " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 38)(1, "select", 85);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Template_select_change_1_listener($event) { i0.ɵɵrestoreView(_r21); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setRetainedFilter($event)); });
    i0.ɵɵelementStart(2, "option", 26);
    i0.ɵɵtext(3, "Retained + rejected");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "option", 86);
    i0.ɵɵtext(5, "Retained only");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "option", 87);
    i0.ɵɵtext(7, "Rejected only");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "select", 70);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Template_select_change_8_listener($event) { i0.ɵɵrestoreView(_r21); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setMarketFilter($event)); });
    i0.ɵɵelementStart(9, "option", 26);
    i0.ɵɵtext(10, "All markets");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(11, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_12_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "select", 71);
    i0.ɵɵlistener("change", function RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Template_select_change_13_listener($event) { i0.ɵɵrestoreView(_r21); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setTierFilter($event)); });
    i0.ɵɵelementStart(14, "option", 26);
    i0.ɵɵtext(15, "All confidence tiers");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(16, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_17_Template, 2, 2, "option", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 72);
    i0.ɵɵrepeaterCreate(19, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_For_20_Template, 15, 11, "article", 73, _forTrack1, false, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_ForEmpty_21_Template, 1, 0, "ba-empty-state", 88);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(22, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Conditional_22_Template, 2, 1, "button", 32);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.retainedFilter);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("value", ctx_r0.marketFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.marketOptions);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.tierFilter);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.tierOptions);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.visibleFilteredCandidateRows);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.filteredCandidateRows.length > ctx_r0.rowLimit ? 22 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵconditionalCreate(1, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_1_Template, 1, 1, "ba-empty-state", 84)(2, RunOutputInspectorComponent_Conditional_18_Conditional_31_Conditional_2_Template, 23, 5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isAvailable(ctx_r0.artifact("filtered_candidates")) ? 1 : 2);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 90);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("message", ((tmp_3_0 = ctx_r0.artifact("selection")) == null ? null : tmp_3_0.error) || "Artifact missing for this run.");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Conditional_12_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "p", 1);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 56);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r29 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r29.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r29.value);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 79)(1, "p", 80);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 29);
    i0.ɵɵrepeaterCreate(4, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Conditional_12_For_5_Template, 5, 2, "div", 13, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pick_r28 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(pick_r28.reason);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(pick_r28.evidence);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 73)(1, "button", 96);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Template_button_click_1_listener() { const pick_r28 = i0.ɵɵrestoreView(_r27).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleRow("pick:" + pick_r28.id)); });
    i0.ɵɵelementStart(2, "span", 33)(3, "span", 1);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 97);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 77);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "span", 4);
    i0.ɵɵelement(10, "ba-status-badge", 6)(11, "ba-status-badge", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(12, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Conditional_12_Template, 6, 1, "div", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r28 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", pick_r28.competition, " \u00B7 ", pick_r28.kickoff);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(pick_r28.event);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", pick_r28.market, " \u00B7 ", pick_r28.pick);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", pick_r28.confidence)("tone", ctx_r0.confidenceTone(pick_r28.confidenceValue));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", pick_r28.risk)("tone", ctx_r0.riskTone(pick_r28.risk));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isRowOpen("pick:" + pick_r28.id) ? 12 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_ForEmpty_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 94);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r30 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_25_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r30); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.toggleShowAll("selection")); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllSelection ? "Show less" : "Show more picks (" + ctx_r0.selectionPicks.length + ")", " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const note_r31 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(note_r31);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_ForEmpty_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1, "No notes.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 101);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const error_r32 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(error_r32);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_ForEmpty_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 60);
    i0.ɵɵtext(1, "No errors.");
    i0.ɵɵelementEnd();
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 95)(1, "div", 98)(2, "p", 1);
    i0.ɵɵtext(3, "Notes");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_For_5_Template, 2, 1, "p", 60, _forTrack2, false, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_ForEmpty_6_Template, 2, 0, "p", 60);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 99)(8, "p", 100);
    i0.ɵɵtext(9, "Errors");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(10, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_For_11_Template, 2, 1, "p", 101, _forTrack2, false, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_ForEmpty_12_Template, 2, 0, "p", 60);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r0.selectionNotes);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r0.selectionErrors);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 91)(1, "div", 64)(2, "p", 1);
    i0.ɵɵtext(3, "Estimated odds");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 92);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 64)(7, "p", 1);
    i0.ɵɵtext(8, "Confidence");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 92);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 64)(12, "p", 1);
    i0.ɵɵtext(13, "Risk");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "p", 92);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 64)(17, "p", 1);
    i0.ɵɵtext(18, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 92);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div", 93);
    i0.ɵɵrepeaterCreate(22, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_For_23_Template, 13, 10, "article", 73, _forTrack1, false, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_ForEmpty_24_Template, 1, 0, "ba-empty-state", 94);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(25, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_25_Template, 2, 1, "button", 32);
    i0.ɵɵconditionalCreate(26, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Conditional_26_Template, 13, 2, "div", 95);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectionSummary.estimated_combo_odds);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectionSummary.global_confidence_score);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectionSummary.combo_risk_level);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectionSummary.status);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.visibleSelectionPicks);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.selectionPicks.length > ctx_r0.rowLimit ? 25 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.selectionNotes.length || ctx_r0.selectionErrors.length ? 26 : -1);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵconditionalCreate(1, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_1_Template, 1, 1, "ba-empty-state", 90)(2, RunOutputInspectorComponent_Conditional_18_Conditional_40_Conditional_2_Template, 27, 7);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isAvailable(ctx_r0.artifact("selection")) ? 1 : 2);
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_49_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r33 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 105);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Conditional_49_For_3_Template_button_click_0_listener() { const tab_r34 = i0.ɵɵrestoreView(_r33).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.rawArtifactKey = tab_r34.key); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r34 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border-accent", ctx_r0.rawArtifactKey === tab_r34.key)("bg-accent", ctx_r0.rawArtifactKey === tab_r34.key)("text-background", ctx_r0.rawArtifactKey === tab_r34.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", tab_r34.label, " ");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_49_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 103);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("label", (ctx_r0.rawArtifact == null ? null : ctx_r0.rawArtifact.filename) || ctx_r0.rawArtifactKey)("message", (ctx_r0.rawArtifact == null ? null : ctx_r0.rawArtifact.error) || "Artifact missing for this run.");
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_49_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "pre", 104);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.rawJson(ctx_r0.rawArtifact == null ? null : ctx_r0.rawArtifact.data));
} }
function RunOutputInspectorComponent_Conditional_18_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20)(1, "div", 38);
    i0.ɵɵrepeaterCreate(2, RunOutputInspectorComponent_Conditional_18_Conditional_49_For_3_Template, 2, 7, "button", 102, _forTrack4);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, RunOutputInspectorComponent_Conditional_18_Conditional_49_Conditional_4_Template, 1, 2, "ba-empty-state", 103)(5, RunOutputInspectorComponent_Conditional_18_Conditional_49_Conditional_5_Template, 2, 1, "pre", 104);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.artifactTabs);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r0.isAvailable(ctx_r0.rawArtifact) ? 4 : 5);
} }
function RunOutputInspectorComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 12);
    i0.ɵɵrepeaterCreate(1, RunOutputInspectorComponent_Conditional_18_For_2_Template, 7, 3, "div", 13, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, RunOutputInspectorComponent_Conditional_18_Conditional_3_Template, 19, 8, "section", 14);
    i0.ɵɵelementStart(4, "div", 15)(5, "section", 16)(6, "button", 17);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSection("match_analysis")); });
    i0.ɵɵelementStart(7, "span")(8, "span", 1);
    i0.ɵɵtext(9, "Match Analysis");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 18);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(12, "ba-status-badge", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(13, RunOutputInspectorComponent_Conditional_18_Conditional_13_Template, 3, 1, "div", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "section", 16)(15, "button", 17);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSection("aggregation_candidates")); });
    i0.ɵɵelementStart(16, "span")(17, "span", 1);
    i0.ɵɵtext(18, "Aggregated Candidates");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "span", 18);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(21, "ba-status-badge", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(22, RunOutputInspectorComponent_Conditional_18_Conditional_22_Template, 3, 1, "div", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "section", 16)(24, "button", 17);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSection("filtered_candidates")); });
    i0.ɵɵelementStart(25, "span")(26, "span", 1);
    i0.ɵɵtext(27, "Filtered Candidates");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "span", 18);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(30, "ba-status-badge", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(31, RunOutputInspectorComponent_Conditional_18_Conditional_31_Template, 3, 1, "div", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "section", 16)(33, "button", 17);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSection("selection")); });
    i0.ɵɵelementStart(34, "span")(35, "span", 1);
    i0.ɵɵtext(36, "Final Selection");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "span", 18);
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(39, "ba-status-badge", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(40, RunOutputInspectorComponent_Conditional_18_Conditional_40_Template, 3, 1, "div", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "section", 16)(42, "button", 17);
    i0.ɵɵlistener("click", function RunOutputInspectorComponent_Conditional_18_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSection("raw_json")); });
    i0.ɵɵelementStart(43, "span")(44, "span", 1);
    i0.ɵɵtext(45, "Raw JSON");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "span", 18);
    i0.ɵɵtext(47);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(48, "ba-status-badge", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(49, RunOutputInspectorComponent_Conditional_18_Conditional_49_Template, 6, 1, "div", 20);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.summaryCards);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.progressRows.length ? 3 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", ctx_r0.matchRows.length, " analyzed matches");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.sectionStateLabel("match_analysis"))("tone", ctx_r0.artifactTone(ctx_r0.artifact("match_analysis")))("showPip", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSectionOpen("match_analysis") ? 13 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1("", ctx_r0.aggregationRows.length, " candidates");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.sectionStateLabel("aggregation_candidates"))("tone", ctx_r0.artifactTone(ctx_r0.artifact("aggregation_candidates")))("showPip", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSectionOpen("aggregation_candidates") ? 22 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate2("", ctx_r0.retainedRows.length, " retained \u00B7 ", ctx_r0.rejectedRows.length, " rejected");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.sectionStateLabel("filtered_candidates"))("tone", ctx_r0.artifactTone(ctx_r0.artifact("filtered_candidates")))("showPip", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSectionOpen("filtered_candidates") ? 31 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate2("", ctx_r0.selectionPicks.length, " final picks \u00B7 ", ctx_r0.selectionSummary.status);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.sectionStateLabel("selection"))("tone", ctx_r0.artifactTone(ctx_r0.artifact("selection")))("showPip", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSectionOpen("selection") ? 40 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.rawArtifactTitle);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.isSectionOpen("raw_json") ? "open" : "closed");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSectionOpen("raw_json") ? 49 : -1);
} }
export class RunOutputInspectorComponent {
    constructor() {
        this.outputs = null;
        this.loading = false;
        this.error = '';
        this.rowLimit = 6;
        this.progressLimit = 6;
        this.rawArtifactKey = 'match_analysis';
        this.competitionFilter = 'all';
        this.matchProfileFilter = 'all';
        this.matchConfidenceFilter = 'all';
        this.statusFilter = 'all';
        this.marketFilter = 'all';
        this.tierFilter = 'all';
        this.retainedFilter = 'all';
        this.showAllProgress = false;
        this.showAllMatches = false;
        this.showAllAggregation = false;
        this.showAllFiltered = false;
        this.showAllSelection = false;
        this.expandedSections = {
            analysis_context: false,
            match_analysis: true,
            aggregation_candidates: false,
            filtered_candidates: false,
            resolved_strategy: false,
            strategy_applications: false,
            selection: false,
            raw_json: false
        };
        this.expandedRows = {};
        this.artifactTabs = [
            { key: 'analysis_context', label: 'Analysis Context' },
            { key: 'match_analysis', label: 'Match Analysis' },
            { key: 'aggregation_candidates', label: 'Aggregated Candidates' },
            { key: 'filtered_candidates', label: 'Filtered Candidates' },
            { key: 'resolved_strategy', label: 'Resolved Strategy' },
            { key: 'strategy_applications', label: 'Strategy Applications' },
            { key: 'selection', label: 'Final Selection' }
        ];
    }
    get availableCount() {
        return Object.values(this.outputs?.artifacts || {}).filter((artifact) => artifact.status === 'available').length;
    }
    get missingCount() {
        return Object.values(this.outputs?.artifacts || {}).filter((artifact) => artifact.status !== 'available').length;
    }
    get summaryCards() {
        const skipped = this.progressNumber('skipped_matches');
        const failed = this.progressNumber('failed_matches');
        const errors = this.selectionErrors.length + (failed || 0);
        return [
            { label: 'Matches found', value: this.progressLabel('total_matches', this.matchRows.length), tone: 'default', detail: `${this.progressStatus} run status` },
            { label: 'Matches analyzed', value: this.progressLabel('analyzed_matches', this.matchRows.length), tone: 'success', detail: `${this.filteredMatchRows.length} visible after filters` },
            { label: 'Aggregated candidates', value: String(this.aggregationRows.length), tone: 'default', detail: `${this.filteredAggregationRows.length} visible` },
            { label: 'Filtered candidates', value: String(this.retainedRows.length + this.rejectedRows.length), tone: 'warning', detail: `${this.retainedRows.length} retained · ${this.rejectedRows.length} rejected` },
            { label: 'Final picks', value: String(this.selectionPicks.length), tone: this.selectionPicks.length ? 'success' : 'default', detail: this.selectionSummary.status },
            { label: 'Errors / skips', value: String(errors + (skipped || 0)), tone: errors || skipped ? 'danger' : 'success', detail: `${errors} errors · ${skipped || 0} skips` }
        ];
    }
    get progressRows() {
        return this.arrayFrom(this.outputs?.progress, 'matches').map((item, fallbackIndex) => ({
            id: String(this.value(item, 'fixture_id') || fallbackIndex),
            index: String(this.value(item, 'index') || fallbackIndex + 1),
            status: String(this.value(item, 'status') || 'pending'),
            event: this.text(item, 'event'),
            competition: this.text(item, 'competition'),
            kickoff: this.text(item, 'kickoff')
        }));
    }
    get progressStatusOptions() {
        return this.unique(this.progressRows.map((row) => row.status));
    }
    get filteredProgressRows() {
        return this.statusFilter === 'all'
            ? this.progressRows
            : this.progressRows.filter((row) => row.status === this.statusFilter);
    }
    get visibleProgressRows() {
        return this.showAllProgress ? this.filteredProgressRows : this.filteredProgressRows.slice(0, this.progressLimit);
    }
    get progressStatus() {
        return String(this.objectOrEmpty(this.outputs?.progress)['status'] || 'pending');
    }
    get progressPartial() {
        return this.objectOrEmpty(this.outputs?.progress)['partial'] === true;
    }
    get progressSummary() {
        const progress = this.objectOrEmpty(this.outputs?.progress);
        const analyzed = progress['analyzed_matches'];
        const total = progress['total_matches'];
        const current = progress['current_match_label'];
        const base = typeof analyzed === 'number' && typeof total === 'number'
            ? `${analyzed}/${total} analyses settled`
            : 'Progress pending';
        return current ? `${base} · current ${current}` : base;
    }
    get matchRows() {
        const results = this.arrayFrom(this.artifact('match_analysis')?.data, 'results');
        return results.map((item, index) => {
            const analysis = this.objectValue(item, 'analysis');
            const predicted = this.arrayFrom(analysis, 'predicted_markets');
            const globalConfidenceValue = this.numberValue(analysis, 'global_confidence');
            return {
                id: String(this.value(analysis, 'fixture_id') || index),
                event: this.text(analysis, 'event'),
                competition: this.text(analysis, 'competition'),
                kickoff: this.text(analysis, 'kickoff'),
                kickoffDisplay: this.formatKickoffCompact(this.text(analysis, 'kickoff')),
                summary: this.text(analysis, 'analysis_summary'),
                keyFactors: this.arrayFrom(analysis, 'key_factors').map((factor) => String(factor)),
                risks: this.arrayFrom(analysis, 'risks').map((risk) => String(risk)),
                global_confidence: `${this.value(analysis, 'global_confidence') ?? '—'}% confidence`,
                global_confidence_value: globalConfidenceValue,
                data_quality: this.text(analysis, 'data_quality'),
                confidence_tier: this.matchConfidenceTier(globalConfidenceValue),
                premium: globalConfidenceValue >= 80,
                predicted_markets: predicted.map((market) => ({
                    market_canonical_id: this.text(market, 'market_canonical_id'),
                    selection_canonical_id: this.text(market, 'selection_canonical_id'),
                    confidence: this.numberValue(market, 'confidence'),
                    confidenceLabel: this.formatPercent(this.value(market, 'confidence')),
                    reason: this.text(market, 'reason')
                }))
            };
        });
    }
    get competitionOptions() {
        return this.unique([
            ...this.matchRows.map((row) => row.competition),
            ...this.selectionPicks.map((pick) => pick.competition)
        ]);
    }
    get filteredMatchRows() {
        return this.matchRows.filter((row) => {
            const competitionMatches = this.competitionFilter === 'all' || row.competition === this.competitionFilter;
            const profileMatches = this.matchProfileFilter === 'all'
                || (this.matchProfileFilter === 'premium_only' && row.premium)
                || (this.matchProfileFilter === 'standard_only' && !row.premium);
            const confidenceMatches = this.matchConfidenceFilter === 'all'
                || (this.matchConfidenceFilter === 'elite' && row.confidence_tier === 'elite')
                || (this.matchConfidenceFilter === 'very_strong' && row.confidence_tier === 'very_strong')
                || (this.matchConfidenceFilter === 'strong' && row.confidence_tier === 'strong')
                || (this.matchConfidenceFilter === 'medium_or_low' && row.confidence_tier === 'medium_or_low');
            return competitionMatches && profileMatches && confidenceMatches;
        });
    }
    get visibleMatchRows() {
        return this.showAllMatches ? this.filteredMatchRows : this.filteredMatchRows.slice(0, this.rowLimit);
    }
    get aggregationRows() {
        return this.candidateRows(this.arrayFrom(this.artifact('aggregation_candidates')?.data, 'candidates'), true);
    }
    get retainedRows() {
        return this.candidateRows(this.arrayFrom(this.artifact('filtered_candidates')?.data, 'candidates'), true);
    }
    get rejectedRows() {
        return this.candidateRows(this.arrayFrom(this.artifact('filtered_candidates')?.data, 'rejected_candidates'), false);
    }
    get marketOptions() {
        return this.unique([
            ...this.aggregationRows.map((row) => row.market),
            ...this.retainedRows.map((row) => row.market),
            ...this.rejectedRows.map((row) => row.market)
        ]);
    }
    get tierOptions() {
        return this.unique([
            ...this.aggregationRows.map((row) => row.tier),
            ...this.retainedRows.map((row) => row.tier),
            ...this.rejectedRows.map((row) => row.tier)
        ]);
    }
    get filteredAggregationRows() {
        return this.applyCandidateFilters(this.aggregationRows);
    }
    get visibleAggregationRows() {
        return this.showAllAggregation ? this.filteredAggregationRows : this.filteredAggregationRows.slice(0, this.rowLimit);
    }
    get filteredCandidateRows() {
        const rows = [...this.retainedRows, ...this.rejectedRows].filter((row) => {
            if (this.retainedFilter === 'retained') {
                return row.retained;
            }
            if (this.retainedFilter === 'rejected') {
                return !row.retained;
            }
            return true;
        });
        return this.applyCandidateFilters(rows);
    }
    get visibleFilteredCandidateRows() {
        return this.showAllFiltered ? this.filteredCandidateRows : this.filteredCandidateRows.slice(0, this.rowLimit);
    }
    get selectionSummary() {
        const data = this.objectOrEmpty(this.artifact('selection')?.data);
        return {
            status: String(data['status'] ?? 'unknown'),
            estimated_combo_odds: this.formatNumber(data['estimated_combo_odds']),
            global_confidence_score: this.formatPercent(data['global_confidence_score']),
            combo_risk_level: String(data['combo_risk_level'] ?? '—')
        };
    }
    get selectionPicks() {
        return this.arrayFrom(this.artifact('selection')?.data, 'picks').map((pick, index) => ({
            id: this.text(pick, 'pick_id') || String(index),
            event: this.text(pick, 'event'),
            competition: this.text(pick, 'competition'),
            kickoff: this.text(pick, 'kickoff'),
            market: this.text(pick, 'market'),
            pick: this.text(pick, 'pick'),
            confidence: this.formatPercent(this.value(pick, 'confidence_score')),
            confidenceValue: this.numberValue(pick, 'confidence_score'),
            risk: this.text(pick, 'risk_level'),
            reason: this.text(pick, 'reason'),
            evidence: this.selectionEvidence(this.objectValue(pick, 'evidence_summary'))
        }));
    }
    get visibleSelectionPicks() {
        return this.showAllSelection ? this.selectionPicks : this.selectionPicks.slice(0, this.rowLimit);
    }
    get selectionNotes() {
        return this.arrayFrom(this.artifact('selection')?.data, 'notes').map((note) => String(note));
    }
    get selectionErrors() {
        return this.arrayFrom(this.artifact('selection')?.data, 'errors').map((error) => String(error));
    }
    get rawArtifact() {
        return this.artifact(this.rawArtifactKey);
    }
    get rawArtifactTitle() {
        return this.artifactTabs.find((tab) => tab.key === this.rawArtifactKey)?.label || this.rawArtifactKey;
    }
    artifact(key) {
        return this.outputs?.artifacts?.[key];
    }
    isAvailable(artifact) {
        return artifact?.status === 'available';
    }
    sectionStateLabel(section) {
        const artifact = this.artifact(section);
        if (!artifact) {
            return 'missing';
        }
        return this.isSectionOpen(section) ? `${artifact.status} · open` : `${artifact.status} · closed`;
    }
    isSectionOpen(section) {
        return this.expandedSections[section];
    }
    toggleSection(section) {
        this.expandedSections[section] = !this.expandedSections[section];
    }
    isRowOpen(rowId) {
        return this.expandedRows[rowId] === true;
    }
    toggleRow(rowId) {
        this.expandedRows[rowId] = !this.expandedRows[rowId];
    }
    toggleShowAll(kind) {
        if (kind === 'progress') {
            this.showAllProgress = !this.showAllProgress;
        }
        if (kind === 'matches') {
            this.showAllMatches = !this.showAllMatches;
        }
        if (kind === 'aggregation') {
            this.showAllAggregation = !this.showAllAggregation;
        }
        if (kind === 'filtered') {
            this.showAllFiltered = !this.showAllFiltered;
        }
        if (kind === 'selection') {
            this.showAllSelection = !this.showAllSelection;
        }
    }
    setCompetitionFilter(event) {
        this.competitionFilter = this.selectValue(event);
        this.showAllMatches = false;
    }
    setMatchProfileFilter(event) {
        const value = this.selectValue(event);
        this.matchProfileFilter = value === 'premium_only' || value === 'standard_only' ? value : 'all';
        this.showAllMatches = false;
    }
    setMatchConfidenceFilter(event) {
        const value = this.selectValue(event);
        this.matchConfidenceFilter =
            value === 'elite' || value === 'very_strong' || value === 'strong' || value === 'medium_or_low'
                ? value
                : 'all';
        this.showAllMatches = false;
    }
    setStatusFilter(event) {
        this.statusFilter = this.selectValue(event);
        this.showAllProgress = false;
    }
    setMarketFilter(event) {
        this.marketFilter = this.selectValue(event);
        this.showAllAggregation = false;
        this.showAllFiltered = false;
    }
    setTierFilter(event) {
        this.tierFilter = this.selectValue(event);
        this.showAllAggregation = false;
        this.showAllFiltered = false;
    }
    setRetainedFilter(event) {
        const value = this.selectValue(event);
        this.retainedFilter = value === 'retained' || value === 'rejected' ? value : 'all';
        this.showAllFiltered = false;
    }
    artifactTone(artifact) {
        if (!artifact) {
            return 'default';
        }
        if (artifact.status === 'available') {
            return 'success';
        }
        if (artifact.status === 'error') {
            return 'danger';
        }
        return 'warning';
    }
    qualityTone(value) {
        const normalized = value.toLowerCase();
        if (normalized === 'high') {
            return 'success';
        }
        if (normalized === 'medium') {
            return 'warning';
        }
        if (normalized === 'low') {
            return 'danger';
        }
        return 'default';
    }
    confidenceTone(value) {
        return confidenceScoreToTone(value);
    }
    confidenceTierTone(value) {
        if (value === 'elite') {
            return 'live';
        }
        if (value === 'very_strong') {
            return 'success';
        }
        if (value === 'strong') {
            return 'warning';
        }
        if (value === 'medium_or_low') {
            return 'danger';
        }
        return 'default';
    }
    riskTone(value) {
        const normalized = value.toLowerCase();
        if (normalized === 'low') {
            return 'success';
        }
        if (normalized === 'medium') {
            return 'warning';
        }
        if (normalized === 'high') {
            return 'danger';
        }
        return 'default';
    }
    progressTone(value) {
        const normalized = value.toLowerCase();
        if (normalized === 'completed') {
            return 'success';
        }
        if (normalized === 'running') {
            return 'live';
        }
        if (normalized === 'failed') {
            return 'danger';
        }
        if (['pending', 'stopped'].includes(normalized)) {
            return 'warning';
        }
        return 'default';
    }
    rawJson(value) {
        return JSON.stringify(value ?? {}, null, 2);
    }
    applyCandidateFilters(rows) {
        return rows.filter((row) => {
            const marketMatches = this.marketFilter === 'all' || row.market === this.marketFilter;
            const tierMatches = this.tierFilter === 'all' || row.tier === this.tierFilter;
            return marketMatches && tierMatches;
        });
    }
    candidateRows(items, retained) {
        return items.map((candidate, index) => ({
            id: this.text(candidate, 'candidate_id') || `${retained ? 'retained' : 'rejected'}-${index}`,
            event: this.text(candidate, 'event'),
            competition: this.text(candidate, 'competition'),
            kickoff: this.text(candidate, 'kickoff'),
            market: this.text(candidate, 'market'),
            pick: this.text(candidate, 'pick'),
            confidence: this.formatPercent(this.value(candidate, 'confidence_score')),
            confidenceValue: this.numberValue(candidate, 'confidence_score'),
            tier: this.text(candidate, 'confidence_tier'),
            risk: this.text(candidate, 'risk_level'),
            odds: this.formatNumber(this.value(candidate, 'odds')),
            odds_source: this.text(candidate, 'odds_source'),
            reasoning: this.text(candidate, 'reasoning'),
            reasons: this.arrayFrom(candidate, 'rejection_reasons').join(', ')
                || this.arrayFrom(candidate, 'filter_reasons').join(', ')
                || '—',
            retained
        }));
    }
    selectionEvidence(source) {
        return [
            { label: 'Global confidence', value: this.formatPercent(source['global_confidence']) },
            { label: 'Confidence tier', value: this.displayValue(source['confidence_tier']) },
            { label: 'Data quality', value: this.displayValue(source['data_quality']) },
            { label: 'Odds source', value: this.displayValue(source['odds_source']) },
            { label: 'Source status', value: this.displayValue(source['source_status']) },
            {
                label: 'Expected odds',
                value: this.oddsRange(source['expected_odds_min'], source['expected_odds_max'])
            }
        ];
    }
    progressNumber(key) {
        const value = this.objectOrEmpty(this.outputs?.progress)[key];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    progressLabel(key, fallback) {
        const value = this.progressNumber(key);
        return String(value ?? fallback);
    }
    matchConfidenceTier(value) {
        if (value >= 90) {
            return 'elite';
        }
        if (value >= 80) {
            return 'very_strong';
        }
        if (value >= 70) {
            return 'strong';
        }
        if (value > 0) {
            return 'medium_or_low';
        }
        return 'unknown';
    }
    arrayFrom(source, key) {
        const obj = this.objectOrEmpty(source);
        return Array.isArray(obj[key]) ? obj[key] : [];
    }
    objectValue(source, key) {
        const obj = this.objectOrEmpty(source);
        return this.objectOrEmpty(obj[key]);
    }
    objectOrEmpty(source) {
        return source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    }
    value(source, key) {
        return this.objectOrEmpty(source)[key];
    }
    numberValue(source, key) {
        const value = this.value(source, key);
        return typeof value === 'number' && Number.isFinite(value) ? value : 0;
    }
    text(source, key) {
        const value = this.value(source, key);
        return value === null || value === undefined || value === '' ? '—' : String(value);
    }
    formatNumber(value) {
        return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
    }
    formatPercent(value) {
        return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}%` : '—';
    }
    oddsRange(min, max) {
        if (typeof min === 'number' && typeof max === 'number') {
            return `${min.toFixed(2)} - ${max.toFixed(2)}`;
        }
        return this.formatNumber(min ?? max);
    }
    displayValue(value) {
        return value === null || value === undefined || value === '' ? '—' : String(value);
    }
    formatKickoffCompact(value) {
        if (!value || value === '—') {
            return '—';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
    selectValue(event) {
        return event.target?.value || 'all';
    }
    unique(values) {
        return Array.from(new Set(values.filter((value) => value && value !== '—'))).sort((a, b) => a.localeCompare(b));
    }
    static { this.ɵfac = function RunOutputInspectorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RunOutputInspectorComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RunOutputInspectorComponent, selectors: [["ba-run-output-inspector"]], inputs: { outputs: "outputs", loading: "loading", error: "error" }, decls: 19, vars: 7, consts: [[1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [1, "flex", "flex-wrap", "gap-2"], ["tone", "default", 3, "label"], [3, "label", "tone"], ["label", "partial", "tone", "warning", 3, "showPip"], [1, "p-4"], ["message", "Loading run outputs...", "detail", "Reading match analysis, candidates, filtering and selection artifacts.", 3, "showShimmer"], ["label", "Run outputs unavailable", 3, "message"], ["label", "No run selected", "message", "Select a run to inspect produced artifacts."], [1, "grid", "gap-3", "sm:grid-cols-2", "xl:grid-cols-6"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "mt-4", "rounded-card", "border", "border-border/70", "bg-background/50", "p-3"], [1, "mt-4", "space-y-3"], [1, "rounded-card", "border", "border-border/70", "bg-background/50"], ["type", "button", 1, "flex", "w-full", "items-center", "justify-between", "gap-3", "px-4", "py-3", "text-left", 3, "click"], [1, "mt-1", "block", "text-sm", "font-semibold", "text-text"], [3, "label", "tone", "showPip"], [1, "border-t", "border-border/60", "p-4"], [1, "ba-data", "mt-2", "text-lg", "text-text"], [1, "mt-1", "truncate", "text-xs", "text-muted"], [1, "flex", "flex-col", "gap-2", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["aria-label", "Progress status filter", 1, "ba-tool", "max-w-44", "bg-background", "text-xs", 3, "change", "value"], ["value", "all"], [3, "value"], [3, "label", "tone", "showPip", "pulse"], [1, "mt-3", "grid", "gap-2", "lg:grid-cols-2"], [1, "flex", "items-center", "justify-between", "gap-3", "rounded-card", "border", "border-border/60", "bg-surface-low", "px-3", "py-2"], [1, "rounded-card", "border", "border-border/60", "bg-surface-low", "p-3", "text-sm", "text-muted"], ["type", "button", 1, "ba-tool", "mt-3"], [1, "min-w-0"], [1, "truncate", "text-sm", "font-medium", "text-text"], [1, "truncate", "text-xs", "text-muted"], ["type", "button", 1, "ba-tool", "mt-3", 3, "click"], ["label", "match_analysis.json", "tone", "warning", 3, "message"], [1, "mb-3", "flex", "flex-wrap", "gap-2"], ["aria-label", "Competition filter", 1, "ba-tool", "max-w-56", "bg-background", "text-xs", 3, "change", "value"], ["aria-label", "Match profile filter", 1, "ba-tool", "max-w-56", "bg-background", "text-xs", 3, "change", "value"], ["value", "premium_only"], ["value", "standard_only"], ["aria-label", "Match confidence filter", 1, "ba-tool", "max-w-56", "bg-background", "text-xs", 3, "change", "value"], ["value", "elite"], ["value", "very_strong"], ["value", "strong"], ["value", "medium_or_low"], [1, "grid", "gap-3"], [1, "rounded-card", "border", "bg-surface-low", "p-4", 3, "border-accent/40", "border-success/40", "border-warning/40", "border-danger/30", "border-border/60"], ["label", "No match analysis", "message", "No match matches the current filters."], [1, "rounded-card", "border", "bg-surface-low", "p-4"], [1, "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "mt-1", "text-base", "font-semibold", "text-text"], [1, "mt-1", "text-sm", "text-muted"], [1, "mt-4", "grid", "gap-3", "xl:grid-cols-3"], [1, "mt-2", "text-sm", "text-text"], [1, "mt-3", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "mt-2", "text-sm", "leading-6", "text-text"], [1, "mt-3", "grid", "gap-3", "xl:grid-cols-[1fr_1fr]"], [1, "mt-2", "text-sm", "text-muted"], [1, "mt-3", "grid", "gap-3", "xl:grid-cols-2"], [1, "mt-2"], [1, "mt-3", "grid", "gap-3"], [1, "rounded-card", "border", "border-border/60", "bg-surface-low", "p-3"], [1, "text-sm", "text-muted"], [1, "flex", "flex-col", "gap-2", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "text-sm", "font-medium", "text-text"], [1, "mt-3", "text-sm", "leading-6", "text-text"], ["label", "aggregation_candidates.json", "tone", "warning", 3, "message"], ["aria-label", "Market filter", 1, "ba-tool", "max-w-56", "bg-background", "text-xs", 3, "change", "value"], ["aria-label", "Confidence tier filter", 1, "ba-tool", "max-w-48", "bg-background", "text-xs", 3, "change", "value"], [1, "grid", "gap-2"], [1, "rounded-card", "border", "border-border/60", "bg-surface-low"], ["label", "No aggregated candidates", "message", "No candidate matches the current filters."], ["type", "button", 1, "grid", "w-full", "gap-2", "p-3", "text-left", "lg:grid-cols-[1.5fr_1fr_auto]", 3, "click"], [1, "block", "truncate", "text-sm", "font-medium", "text-text"], [1, "mt-1", "block", "truncate", "text-xs", "text-muted"], [1, "ba-data", "text-right", "text-text"], [1, "border-t", "border-border/60", "p-3"], [1, "text-sm", "leading-6", "text-text"], [1, "mt-3", "grid", "gap-3", "text-sm", "sm:grid-cols-4"], [1, "mt-1", "text-text"], [1, "mt-1", "text-muted"], ["label", "filtered_candidates.json", "tone", "warning", 3, "message"], ["aria-label", "Retained rejected filter", 1, "ba-tool", "max-w-44", "bg-background", "text-xs", 3, "change", "value"], ["value", "retained"], ["value", "rejected"], ["label", "No filtered candidates", "message", "No candidate matches the current filters."], [1, "mt-2", "text-xs", "text-muted"], ["label", "selection.json", "tone", "warning", 3, "message"], [1, "grid", "gap-3", "lg:grid-cols-4"], [1, "ba-data", "mt-2", "text-text"], [1, "mt-3", "grid", "gap-2"], ["label", "No final picks", "message", "selection.json contains no retained picks.", "tone", "warning"], [1, "mt-4", "grid", "gap-4", "lg:grid-cols-2"], ["type", "button", 1, "flex", "w-full", "flex-col", "gap-2", "p-3", "text-left", "lg:flex-row", "lg:items-start", "lg:justify-between", 3, "click"], [1, "mt-1", "block", "truncate", "text-sm", "font-semibold", "text-text"], [1, "rounded-card", "border", "border-border/60", "bg-surface-low", "p-4"], [1, "rounded-card", "border", "border-danger/30", "bg-danger/5", "p-4"], [1, "ba-label", "text-danger"], [1, "mt-2", "text-sm", "text-danger"], ["type", "button", 1, "ba-tool", 3, "border-accent", "bg-accent", "text-background"], ["tone", "warning", 3, "label", "message"], [1, "max-h-96", "overflow-auto", "whitespace-pre-wrap", "rounded-card", "border", "border-border/60", "bg-background", "p-3", "text-xs", "text-muted"], ["type", "button", 1, "ba-tool", 3, "click"]], template: function RunOutputInspectorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 0)(2, "div")(3, "p", 1);
            i0.ɵɵtext(4, "Run outputs");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h3", 2);
            i0.ɵɵtext(6, "Produced artifacts");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 3);
            i0.ɵɵtext(8, " Inspecte les fichiers stricts du run s\u00E9lectionn\u00E9, sans fallback latest_*. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 4);
            i0.ɵɵconditionalCreate(10, RunOutputInspectorComponent_Conditional_10_Template, 1, 1, "ba-status-badge", 5);
            i0.ɵɵelement(11, "ba-status-badge", 6)(12, "ba-status-badge", 6);
            i0.ɵɵconditionalCreate(13, RunOutputInspectorComponent_Conditional_13_Template, 1, 1, "ba-status-badge", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 8);
            i0.ɵɵconditionalCreate(15, RunOutputInspectorComponent_Conditional_15_Template, 1, 1, "ba-loading-state", 9)(16, RunOutputInspectorComponent_Conditional_16_Template, 1, 1, "ba-error-state", 10)(17, RunOutputInspectorComponent_Conditional_17_Template, 1, 0, "ba-empty-state", 11)(18, RunOutputInspectorComponent_Conditional_18_Template, 50, 26);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵconditional((ctx.outputs == null ? null : ctx.outputs.run_dir) ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", ctx.availableCount + " available")("tone", ctx.availableCount ? "success" : "default");
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", ctx.missingCount + " missing")("tone", ctx.missingCount ? "warning" : "default");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.progressPartial ? 13 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loading ? 15 : ctx.error ? 16 : !ctx.outputs ? 17 : 18);
        } }, dependencies: [EmptyStateComponent,
            ErrorStateComponent,
            LoadingStateComponent,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RunOutputInspectorComponent, [{
        type: Component,
        args: [{
                selector: 'ba-run-output-inspector',
                standalone: true,
                imports: [
                    EmptyStateComponent,
                    ErrorStateComponent,
                    LoadingStateComponent,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-section-card>
      <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="ba-label">Run outputs</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Produced artifacts</h3>
          <p class="mt-1 text-xs text-muted">
            Inspecte les fichiers stricts du run sélectionné, sans fallback latest_*.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          @if (outputs?.run_dir) {
            <ba-status-badge [label]="outputs?.run_dir || ''" tone="default"></ba-status-badge>
          }
          <ba-status-badge [label]="availableCount + ' available'" [tone]="availableCount ? 'success' : 'default'"></ba-status-badge>
          <ba-status-badge [label]="missingCount + ' missing'" [tone]="missingCount ? 'warning' : 'default'"></ba-status-badge>
          @if (progressPartial) {
            <ba-status-badge label="partial" tone="warning" [showPip]="true"></ba-status-badge>
          }
        </div>
      </div>

      <div class="p-4">
        @if (loading) {
          <ba-loading-state
            message="Loading run outputs..."
            detail="Reading match analysis, candidates, filtering and selection artifacts."
            [showShimmer]="true"
          ></ba-loading-state>
        } @else if (error) {
          <ba-error-state label="Run outputs unavailable" [message]="error"></ba-error-state>
        } @else if (!outputs) {
          <ba-empty-state
            label="No run selected"
            message="Select a run to inspect produced artifacts."
          ></ba-empty-state>
        } @else {
          <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            @for (card of summaryCards; track card.label) {
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">{{ card.label }}</p>
                <p class="ba-data mt-2 text-lg text-text">{{ card.value }}</p>
                <p class="mt-1 truncate text-xs text-muted">{{ card.detail }}</p>
              </div>
            }
          </section>

          @if (progressRows.length) {
            <section class="mt-4 rounded-card border border-border/70 bg-background/50 p-3">
              <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="ba-label">Live match progress</p>
                  <h4 class="mt-1 text-sm font-semibold text-text">{{ progressSummary }}</h4>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <select
                    class="ba-tool max-w-44 bg-background text-xs"
                    [value]="statusFilter"
                    (change)="setStatusFilter($event)"
                    aria-label="Progress status filter"
                  >
                    <option value="all">All statuses</option>
                    @for (status of progressStatusOptions; track status) {
                      <option [value]="status">{{ status }}</option>
                    }
                  </select>
                  <ba-status-badge [label]="progressStatus" [tone]="progressTone(progressStatus)" [showPip]="true" [pulse]="progressStatus === 'running'"></ba-status-badge>
                </div>
              </div>
              <div class="mt-3 grid gap-2 lg:grid-cols-2">
                @for (row of visibleProgressRows; track row.id) {
                  <article class="flex items-center justify-between gap-3 rounded-card border border-border/60 bg-surface-low px-3 py-2">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-text">{{ row.index }} · {{ row.event }}</p>
                      <p class="truncate text-xs text-muted">{{ row.competition }} · {{ row.kickoff }}</p>
                    </div>
                    <ba-status-badge
                      [label]="row.status"
                      [tone]="progressTone(row.status)"
                      [showPip]="true"
                      [pulse]="row.status === 'running'"
                    ></ba-status-badge>
                  </article>
                } @empty {
                  <p class="rounded-card border border-border/60 bg-surface-low p-3 text-sm text-muted">No progress row matches this filter.</p>
                }
              </div>
              @if (filteredProgressRows.length > progressLimit) {
                <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('progress')">
                  {{ showAllProgress ? 'Show less' : 'Show all ' + filteredProgressRows.length }}
                </button>
              }
            </section>
          }

          <div class="mt-4 space-y-3">
            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('match_analysis')"
              >
                <span>
                  <span class="ba-label">Match Analysis</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ matchRows.length }} analyzed matches</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('match_analysis')" [tone]="artifactTone(artifact('match_analysis'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('match_analysis')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('match_analysis'))) {
                    <ba-empty-state
                      label="match_analysis.json"
                      [message]="artifact('match_analysis')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select
                        class="ba-tool max-w-56 bg-background text-xs"
                        [value]="competitionFilter"
                        (change)="setCompetitionFilter($event)"
                        aria-label="Competition filter"
                      >
                        <option value="all">All competitions</option>
                        @for (competition of competitionOptions; track competition) {
                          <option [value]="competition">{{ competition }}</option>
                        }
                      </select>
                      <select
                        class="ba-tool max-w-56 bg-background text-xs"
                        [value]="matchProfileFilter"
                        (change)="setMatchProfileFilter($event)"
                        aria-label="Match profile filter"
                      >
                        <option value="all">All analyses</option>
                        <option value="premium_only">Premium only (80%+)</option>
                        <option value="standard_only">Standard only (&lt;80%)</option>
                      </select>
                      <select
                        class="ba-tool max-w-56 bg-background text-xs"
                        [value]="matchConfidenceFilter"
                        (change)="setMatchConfidenceFilter($event)"
                        aria-label="Match confidence filter"
                      >
                        <option value="all">All confidence tiers</option>
                        <option value="elite">Elite (90%+)</option>
                        <option value="very_strong">Very strong (80-89%)</option>
                        <option value="strong">Strong (70-79%)</option>
                        <option value="medium_or_low">Medium / low (&lt;70%)</option>
                      </select>
                    </div>

                    <div class="grid gap-3">
                      @for (match of visibleMatchRows; track match.id) {
                        <article
                          class="rounded-card border bg-surface-low p-4"
                          [class.border-accent/40]="match.confidence_tier === 'elite'"
                          [class.border-success/40]="match.confidence_tier === 'very_strong'"
                          [class.border-warning/40]="match.confidence_tier === 'strong'"
                          [class.border-danger/30]="match.confidence_tier === 'medium_or_low'"
                          [class.border-border/60]="match.confidence_tier === 'unknown'"
                        >
                          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div class="min-w-0">
                              <p class="ba-label">{{ match.competition }}</p>
                              <h4 class="mt-1 text-base font-semibold text-text">{{ match.event }}</h4>
                              <p class="mt-1 text-sm text-muted">{{ match.kickoffDisplay }}</p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="match.confidence_tier" [tone]="confidenceTierTone(match.confidence_tier)"></ba-status-badge>
                              <ba-status-badge [label]="match.global_confidence" [tone]="confidenceTone(match.global_confidence_value)"></ba-status-badge>
                              <ba-status-badge [label]="match.data_quality" [tone]="qualityTone(match.data_quality)"></ba-status-badge>
                            </div>
                          </div>

                          <div class="mt-4 grid gap-3 xl:grid-cols-3">
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Event</p>
                              <p class="mt-2 text-sm text-text">{{ match.event }}</p>
                            </div>
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Competition</p>
                              <p class="mt-2 text-sm text-text">{{ match.competition }}</p>
                            </div>
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Kickoff</p>
                              <p class="mt-2 text-sm text-text">{{ match.kickoffDisplay }}</p>
                            </div>
                          </div>

                          <div class="mt-3 rounded-card border border-border/60 bg-background/60 p-3">
                            <p class="ba-label">Analysis summary</p>
                            <p class="mt-2 text-sm leading-6 text-text">{{ match.summary }}</p>
                          </div>

                          <div class="mt-3 grid gap-3 xl:grid-cols-[1fr_1fr]">
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Key factors</p>
                              @for (factor of match.keyFactors; track factor + $index) {
                                <p class="mt-2 text-sm text-text">{{ factor }}</p>
                              } @empty {
                                <p class="mt-2 text-sm text-muted">No key factors returned.</p>
                              }
                            </div>
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Risks</p>
                              @for (risk of match.risks; track risk + $index) {
                                <p class="mt-2 text-sm text-text">{{ risk }}</p>
                              } @empty {
                                <p class="mt-2 text-sm text-muted">No explicit risks returned.</p>
                              }
                            </div>
                          </div>

                          <div class="mt-3 grid gap-3 xl:grid-cols-2">
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Global confidence</p>
                              <div class="mt-2">
                                <ba-status-badge [label]="match.global_confidence" [tone]="confidenceTone(match.global_confidence_value)"></ba-status-badge>
                              </div>
                            </div>
                            <div class="rounded-card border border-border/60 bg-background/60 p-3">
                              <p class="ba-label">Data quality</p>
                              <div class="mt-2">
                                <ba-status-badge [label]="match.data_quality" [tone]="qualityTone(match.data_quality)"></ba-status-badge>
                              </div>
                            </div>
                          </div>

                          <div class="mt-3 rounded-card border border-border/60 bg-background/60 p-3">
                            <p class="ba-label">Predicted markets</p>
                            <div class="mt-3 grid gap-3">
                              @for (market of match.predicted_markets; track market.market_canonical_id + market.selection_canonical_id + $index) {
                                <article class="rounded-card border border-border/60 bg-surface-low p-3">
                                  <div class="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                    <div class="min-w-0">
                                      <p class="text-sm font-medium text-text">{{ market.market_canonical_id }}</p>
                                      <p class="mt-1 text-xs text-muted">{{ market.selection_canonical_id }}</p>
                                    </div>
                                    <ba-status-badge [label]="market.confidenceLabel" [tone]="confidenceTone(market.confidence)"></ba-status-badge>
                                  </div>
                                  <p class="mt-3 text-sm leading-6 text-text">{{ market.reason }}</p>
                                </article>
                              } @empty {
                                <p class="text-sm text-muted">No predicted market returned for this match.</p>
                              }
                            </div>
                          </div>
                        </article>
                      } @empty {
                        <ba-empty-state label="No match analysis" message="No match matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredMatchRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('matches')">
                        {{ showAllMatches ? 'Show less' : 'Show more matches (' + filteredMatchRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('aggregation_candidates')"
              >
                <span>
                  <span class="ba-label">Aggregated Candidates</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ aggregationRows.length }} candidates</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('aggregation_candidates')" [tone]="artifactTone(artifact('aggregation_candidates'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('aggregation_candidates')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('aggregation_candidates'))) {
                    <ba-empty-state
                      label="aggregation_candidates.json"
                      [message]="artifact('aggregation_candidates')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select class="ba-tool max-w-56 bg-background text-xs" [value]="marketFilter" (change)="setMarketFilter($event)" aria-label="Market filter">
                        <option value="all">All markets</option>
                        @for (market of marketOptions; track market) {
                          <option [value]="market">{{ market }}</option>
                        }
                      </select>
                      <select class="ba-tool max-w-48 bg-background text-xs" [value]="tierFilter" (change)="setTierFilter($event)" aria-label="Confidence tier filter">
                        <option value="all">All confidence tiers</option>
                        @for (tier of tierOptions; track tier) {
                          <option [value]="tier">{{ tier }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid gap-2">
                      @for (candidate of visibleAggregationRows; track candidate.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="grid w-full gap-2 p-3 text-left lg:grid-cols-[1.5fr_1fr_auto]"
                            (click)="toggleRow('candidate:' + candidate.id)"
                          >
                            <span class="min-w-0">
                              <span class="block truncate text-sm font-medium text-text">{{ candidate.event }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.competition }} · {{ candidate.kickoff }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.market }} · {{ candidate.pick }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="candidate.tier" tone="default"></ba-status-badge>
                              <ba-status-badge [label]="candidate.risk" [tone]="riskTone(candidate.risk)"></ba-status-badge>
                            </span>
                            <span class="ba-data text-right text-text">{{ candidate.confidence }}</span>
                          </button>
                          @if (isRowOpen('candidate:' + candidate.id)) {
                            <div class="border-t border-border/60 p-3">
                              <p class="text-sm leading-6 text-text">{{ candidate.reasoning }}</p>
                              <dl class="mt-3 grid gap-3 text-sm sm:grid-cols-4">
                              <div><dt class="ba-label">Odds</dt><dd class="mt-1 text-text">{{ candidate.odds }}</dd></div>
                              <div><dt class="ba-label">Source</dt><dd class="mt-1 text-muted">{{ candidate.odds_source }}</dd></div>
                              <div><dt class="ba-label">Risk</dt><dd class="mt-1 text-muted">{{ candidate.risk }}</dd></div>
                              <div><dt class="ba-label">Tier</dt><dd class="mt-1 text-muted">{{ candidate.tier }}</dd></div>
                              </dl>
                            </div>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No aggregated candidates" message="No candidate matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredAggregationRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('aggregation')">
                        {{ showAllAggregation ? 'Show less' : 'Show more candidates (' + filteredAggregationRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('filtered_candidates')"
              >
                <span>
                  <span class="ba-label">Filtered Candidates</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ retainedRows.length }} retained · {{ rejectedRows.length }} rejected</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('filtered_candidates')" [tone]="artifactTone(artifact('filtered_candidates'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('filtered_candidates')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('filtered_candidates'))) {
                    <ba-empty-state
                      label="filtered_candidates.json"
                      [message]="artifact('filtered_candidates')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select class="ba-tool max-w-44 bg-background text-xs" [value]="retainedFilter" (change)="setRetainedFilter($event)" aria-label="Retained rejected filter">
                        <option value="all">Retained + rejected</option>
                        <option value="retained">Retained only</option>
                        <option value="rejected">Rejected only</option>
                      </select>
                      <select class="ba-tool max-w-56 bg-background text-xs" [value]="marketFilter" (change)="setMarketFilter($event)" aria-label="Market filter">
                        <option value="all">All markets</option>
                        @for (market of marketOptions; track market) {
                          <option [value]="market">{{ market }}</option>
                        }
                      </select>
                      <select class="ba-tool max-w-48 bg-background text-xs" [value]="tierFilter" (change)="setTierFilter($event)" aria-label="Confidence tier filter">
                        <option value="all">All confidence tiers</option>
                        @for (tier of tierOptions; track tier) {
                          <option [value]="tier">{{ tier }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid gap-2">
                      @for (candidate of visibleFilteredCandidateRows; track candidate.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="grid w-full gap-2 p-3 text-left lg:grid-cols-[1.5fr_1fr_auto]"
                            (click)="toggleRow('filtered:' + candidate.id)"
                          >
                            <span class="min-w-0">
                              <span class="block truncate text-sm font-medium text-text">{{ candidate.event }} · {{ candidate.pick }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.competition }} · {{ candidate.kickoff }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.market }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="candidate.retained ? 'retained' : 'rejected'" [tone]="candidate.retained ? 'success' : 'warning'"></ba-status-badge>
                              <ba-status-badge [label]="candidate.risk" [tone]="riskTone(candidate.risk)"></ba-status-badge>
                            </span>
                            <span class="ba-data text-right text-text">{{ candidate.confidence }}</span>
                          </button>
                          @if (isRowOpen('filtered:' + candidate.id)) {
                            <div class="border-t border-border/60 p-3">
                              <p class="text-sm leading-6 text-text">{{ candidate.reasoning }}</p>
                              <p class="mt-2 text-sm text-muted">Reasons: {{ candidate.reasons }}</p>
                              <p class="mt-2 text-xs text-muted">Odds {{ candidate.odds }} · {{ candidate.odds_source }} · {{ candidate.tier }}</p>
                            </div>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No filtered candidates" message="No candidate matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredCandidateRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('filtered')">
                        {{ showAllFiltered ? 'Show less' : 'Show more filtered candidates (' + filteredCandidateRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('selection')"
              >
                <span>
                  <span class="ba-label">Final Selection</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ selectionPicks.length }} final picks · {{ selectionSummary.status }}</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('selection')" [tone]="artifactTone(artifact('selection'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('selection')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('selection'))) {
                    <ba-empty-state
                      label="selection.json"
                      [message]="artifact('selection')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="grid gap-3 lg:grid-cols-4">
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Estimated odds</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.estimated_combo_odds }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Confidence</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.global_confidence_score }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Risk</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.combo_risk_level }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Status</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.status }}</p>
                      </div>
                    </div>

                    <div class="mt-3 grid gap-2">
                      @for (pick of visibleSelectionPicks; track pick.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="flex w-full flex-col gap-2 p-3 text-left lg:flex-row lg:items-start lg:justify-between"
                            (click)="toggleRow('pick:' + pick.id)"
                          >
                            <span class="min-w-0">
                              <span class="ba-label">{{ pick.competition }} · {{ pick.kickoff }}</span>
                              <span class="mt-1 block truncate text-sm font-semibold text-text">{{ pick.event }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ pick.market }} · {{ pick.pick }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="pick.confidence" [tone]="confidenceTone(pick.confidenceValue)"></ba-status-badge>
                              <ba-status-badge [label]="pick.risk" [tone]="riskTone(pick.risk)"></ba-status-badge>
                            </span>
                          </button>
                          @if (isRowOpen('pick:' + pick.id)) {
                            <div class="border-t border-border/60 p-3">
                              <p class="text-sm leading-6 text-text">{{ pick.reason }}</p>
                              <div class="mt-3 grid gap-2 lg:grid-cols-2">
                                @for (item of pick.evidence; track item.label) {
                                  <div class="rounded-card border border-border/60 bg-background/60 p-3">
                                    <p class="ba-label">{{ item.label }}</p>
                                    <p class="mt-2 text-sm text-text">{{ item.value }}</p>
                                  </div>
                                }
                              </div>
                            </div>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No final picks" message="selection.json contains no retained picks." tone="warning"></ba-empty-state>
                      }
                    </div>

                    @if (selectionPicks.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('selection')">
                        {{ showAllSelection ? 'Show less' : 'Show more picks (' + selectionPicks.length + ')' }}
                      </button>
                    }

                    @if (selectionNotes.length || selectionErrors.length) {
                      <div class="mt-4 grid gap-4 lg:grid-cols-2">
                        <div class="rounded-card border border-border/60 bg-surface-low p-4">
                          <p class="ba-label">Notes</p>
                          @for (note of selectionNotes; track note + $index) {
                            <p class="mt-2 text-sm text-muted">{{ note }}</p>
                          } @empty {
                            <p class="mt-2 text-sm text-muted">No notes.</p>
                          }
                        </div>
                        <div class="rounded-card border border-danger/30 bg-danger/5 p-4">
                          <p class="ba-label text-danger">Errors</p>
                          @for (error of selectionErrors; track error + $index) {
                            <p class="mt-2 text-sm text-danger">{{ error }}</p>
                          } @empty {
                            <p class="mt-2 text-sm text-muted">No errors.</p>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('raw_json')"
              >
                <span>
                  <span class="ba-label">Raw JSON</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ rawArtifactTitle }}</span>
                </span>
                <ba-status-badge [label]="isSectionOpen('raw_json') ? 'open' : 'closed'" tone="default"></ba-status-badge>
              </button>
              @if (isSectionOpen('raw_json')) {
                <div class="border-t border-border/60 p-4">
                  <div class="mb-3 flex flex-wrap gap-2">
                    @for (tab of artifactTabs; track tab.key) {
                      <button
                        type="button"
                        class="ba-tool"
                        [class.border-accent]="rawArtifactKey === tab.key"
                        [class.bg-accent]="rawArtifactKey === tab.key"
                        [class.text-background]="rawArtifactKey === tab.key"
                        (click)="rawArtifactKey = tab.key"
                      >
                        {{ tab.label }}
                      </button>
                    }
                  </div>
                  @if (!isAvailable(rawArtifact)) {
                    <ba-empty-state
                      [label]="rawArtifact?.filename || rawArtifactKey"
                      [message]="rawArtifact?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <pre class="max-h-96 overflow-auto whitespace-pre-wrap rounded-card border border-border/60 bg-background p-3 text-xs text-muted">{{ rawJson(rawArtifact?.data) }}</pre>
                  }
                </div>
              }
            </section>
          </div>
        }
      </div>
    </ba-section-card>
  `
            }]
    }], null, { outputs: [{
            type: Input
        }], loading: [{
            type: Input
        }], error: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RunOutputInspectorComponent, { className: "RunOutputInspectorComponent", filePath: "src/app/shared/ui/run-output-inspector/run-output-inspector.component.ts", lineNumber: 685 }); })();
//# sourceMappingURL=run-output-inspector.component.js.map