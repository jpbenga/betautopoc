import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, interval, of } from 'rxjs';
import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { formatApiDate, statusToTone } from '../../core/api/api.mappers';
import { BetautoApiService } from '../../core/api/betauto-api.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RunOutputInspectorComponent } from '../../shared/ui/run-output-inspector/run-output-inspector.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent } from '../../shared/ui/timeline/timeline.component';
import * as i0 from "@angular/core";
const _c0 = ["logsSection"];
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.run_id;
function AnalysisPage_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 8)(1, "div", 18)(2, "p", 19);
    i0.ɵɵtext(3, "Target date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 20);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 18)(7, "p", 19);
    i0.ɵɵtext(8, "Active run");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 21);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 18)(12, "p", 19);
    i0.ɵɵtext(13, "Polling");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 22);
    i0.ɵɵelement(15, "ba-status-badge", 23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 18)(17, "p", 19);
    i0.ɵɵtext(18, "Last updated");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 20);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.targetDate);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("title", ctx_r0.selectedRunId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.shortId(ctx_r0.selectedRunId));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("label", ctx_r0.isPolling ? "Polling every 3s" : "Polling stopped")("tone", ctx_r0.isPolling ? "live" : "default")("pulse", ctx_r0.isPolling)("showPip", true);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.lastUpdatedAt || "\u2014");
} }
function AnalysisPage_Conditional_11_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 28);
} }
function AnalysisPage_Conditional_11_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("job_id ", ctx_r0.selectedRunId);
} }
function AnalysisPage_Conditional_11_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 35);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("label", "run " + (ctx_r0.selectedRun == null ? null : ctx_r0.selectedRun.orchestrator_run_id));
} }
function AnalysisPage_Conditional_11_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 36);
} if (rf & 2) {
    i0.ɵɵproperty("showPip", true);
} }
function AnalysisPage_Conditional_11_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function AnalysisPage_Conditional_11_Conditional_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.stopAnalysis()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r0.isStoppingRun);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.isStoppingRun ? "Stop requested..." : "Stop Analysis", " ");
} }
function AnalysisPage_Conditional_11_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38);
    i0.ɵɵelement(1, "div", 40);
    i0.ɵɵelementEnd();
} }
function AnalysisPage_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 24)(1, "div", 25)(2, "div", 26)(3, "span", 27);
    i0.ɵɵconditionalCreate(4, AnalysisPage_Conditional_11_Conditional_4_Template, 1, 0, "span", 28);
    i0.ɵɵelement(5, "span", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 30)(7, "p", 19);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h2", 31);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p", 32);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(13, AnalysisPage_Conditional_11_Conditional_13_Template, 2, 1, "p", 33);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 34);
    i0.ɵɵelement(15, "ba-status-badge", 23);
    i0.ɵɵconditionalCreate(16, AnalysisPage_Conditional_11_Conditional_16_Template, 1, 1, "ba-status-badge", 35);
    i0.ɵɵconditionalCreate(17, AnalysisPage_Conditional_11_Conditional_17_Template, 1, 1, "ba-status-badge", 36);
    i0.ɵɵelement(18, "ba-status-badge", 35);
    i0.ɵɵconditionalCreate(19, AnalysisPage_Conditional_11_Conditional_19_Template, 2, 2, "button", 37);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(20, AnalysisPage_Conditional_11_Conditional_20_Template, 2, 0, "div", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("border-accent/60", ctx_r0.isSelectedRunLive || ctx_r0.isStartingRun)("border-success/50", ctx_r0.isSelectedRunSuccess)("border-danger/50", ctx_r0.isSelectedRunFailed)("border-border/70", !ctx_r0.isSelectedRunLive && !ctx_r0.isStartingRun && !ctx_r0.isSelectedRunSuccess && !ctx_r0.isSelectedRunFailed);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.isSelectedRunLive || ctx_r0.isStartingRun ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.selectedRunPipClass);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunEyebrow);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunHeadline);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunDescription);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.selectedRunId ? 13 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", ctx_r0.selectedRunStatusLabel)("tone", ctx_r0.selectedRunTone)("pulse", ctx_r0.isSelectedRunLive || ctx_r0.isStartingRun)("showPip", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r0.selectedRun == null ? null : ctx_r0.selectedRun.orchestrator_run_id) ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r0.selectedRun == null ? null : ctx_r0.selectedRun.stop_requested) ? 17 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.lastUpdatedAt ? "Updated " + ctx_r0.lastUpdatedAt : "Waiting for first update");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.canStopSelectedRun ? 19 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSelectedRunLive || ctx_r0.isStartingRun ? 20 : -1);
} }
function AnalysisPage_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10)(1, "div", 18)(2, "p", 19);
    i0.ɵɵtext(3, "Matches found");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 20);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 18)(7, "p", 19);
    i0.ɵɵtext(8, "Analyzed");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 20);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 18)(12, "p", 19);
    i0.ɵɵtext(13, "Remaining");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "p", 20);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 18)(17, "p", 19);
    i0.ɵɵtext(18, "Current match");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 41);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 18)(22, "p", 19);
    i0.ɵɵtext(23, "Leagues / fixtures");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "p", 20);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.totalMatchesLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.analyzedMatchesLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.remainingMatchesLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.currentMatchLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r0.activeLeaguesLabel, " / ", ctx_r0.fixturesFetchedLabel);
} }
function AnalysisPage_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵelement(1, "ba-error-state", 42);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.stopRunError);
} }
function AnalysisPage_For_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 15);
} if (rf & 2) {
    const state_r3 = ctx.$implicit;
    i0.ɵɵproperty("label", state_r3.label)("tone", state_r3.tone)("showPip", true)("pulse", state_r3.label === "running");
} }
function AnalysisPage_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵelement(1, "ba-error-state", 43);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.startRunError);
} }
function AnalysisPage_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 44);
    i0.ɵɵelement(2, "ba-loading-state", 45);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("showShimmer", true);
} }
function AnalysisPage_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 16);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.errorMessage);
} }
function AnalysisPage_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 17);
} }
function AnalysisPage_Conditional_24_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 47);
} if (rf & 2) {
    const kpi_r4 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r4.label)("value", kpi_r4.value)("status", kpi_r4.status || "")("tone", kpi_r4.tone || "default");
} }
function AnalysisPage_Conditional_24_Conditional_14_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 67)(1, "div", 68)(2, "div", 30)(3, "p", 19);
    i0.ɵɵtext(4, "Run ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h4", 21);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 69);
    i0.ɵɵelement(9, "div", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "dl", 71)(11, "div")(12, "dt", 19);
    i0.ɵɵtext(13, "Progress");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "dd", 72);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div")(17, "dt", 19);
    i0.ɵɵtext(18, "Steps");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "dd", 72);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div")(22, "dt", 19);
    i0.ɵɵtext(23, "Target");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "dd", 73);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div")(27, "dt", 19);
    i0.ɵɵtext(28, "Picks");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "dd", 74);
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const run_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("title", run_r5.run_id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.shortId(run_r5.run_id));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", run_r5.status)("tone", ctx_r0.toneFor(run_r5.status))("pulse", ctx_r0.isLiveStatus(run_r5.status))("showPip", true);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", run_r5.progress, "%");
    i0.ɵɵclassProp("animate-pulse", ctx_r0.isLiveStatus(run_r5.status));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", run_r5.progress, "%");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", run_r5.completed_steps, " / ", run_r5.step_count);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(run_r5.target_date || "\u2014");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(run_r5.picks_count ?? "\u2014");
} }
function AnalysisPage_Conditional_24_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 54);
    i0.ɵɵrepeaterCreate(1, AnalysisPage_Conditional_24_Conditional_14_For_2_Template, 31, 15, "article", 67, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.activeRuns);
} }
function AnalysisPage_Conditional_24_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44);
    i0.ɵɵelement(1, "ba-empty-state", 75);
    i0.ɵɵelementEnd();
} }
function AnalysisPage_Conditional_24_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-timeline", 56);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("items", ctx_r0.timeline);
} }
function AnalysisPage_Conditional_24_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 57);
} }
function AnalysisPage_Conditional_24_For_36_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 76);
    i0.ɵɵlistener("click", function AnalysisPage_Conditional_24_For_36_Template_button_click_0_listener() { const run_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectRun(run_r7.run_id)); });
    i0.ɵɵelementStart(1, "div", 77)(2, "div", 30)(3, "p", 78);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 79);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 80)(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const run_r7 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("border-accent", run_r7.run_id === ctx_r0.selectedRunId)("bg-accent/10", run_r7.run_id === ctx_r0.selectedRunId)("border-border", run_r7.run_id !== ctx_r0.selectedRunId)("bg-background", run_r7.run_id !== ctx_r0.selectedRunId);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", run_r7.run_id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.shortId(run_r7.run_id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", run_r7.target_date || "\u2014", " \u00B7 ", ctx_r0.formatRunDate(run_r7.created_at));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", run_r7.status)("tone", ctx_r0.toneFor(run_r7.status))("pulse", ctx_r0.isLiveStatus(run_r7.status))("showPip", true);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", run_r7.progress, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", run_r7.completed_steps, "/", run_r7.step_count, " steps");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", run_r7.picks_count ?? "\u2014", " picks");
} }
function AnalysisPage_Conditional_24_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 66);
    i0.ɵɵelement(1, "ba-run-output-inspector", 81);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("outputs", ctx_r0.runOutputs)("loading", ctx_r0.isOutputsLoading)("error", ctx_r0.outputsError);
} }
function AnalysisPage_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 46);
    i0.ɵɵrepeaterCreate(1, AnalysisPage_Conditional_24_For_2_Template, 1, 4, "ba-kpi-card", 47, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "section", 48)(4, "ba-section-card")(5, "div", 49)(6, "div")(7, "p", 19);
    i0.ɵɵtext(8, "Active runs");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h3", 50);
    i0.ɵɵtext(10, "Orchestrator execution queue");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 51);
    i0.ɵɵelement(12, "ba-status-badge", 52)(13, "ba-status-badge", 53);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(14, AnalysisPage_Conditional_24_Conditional_14_Template, 3, 0, "div", 54)(15, AnalysisPage_Conditional_24_Conditional_15_Template, 2, 0, "div", 44);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "ba-section-card")(17, "div", 55)(18, "p", 19);
    i0.ɵɵtext(19, "Analysis timeline");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "h3", 50);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 44);
    i0.ɵɵconditionalCreate(23, AnalysisPage_Conditional_24_Conditional_23_Template, 1, 1, "ba-timeline", 56)(24, AnalysisPage_Conditional_24_Conditional_24_Template, 1, 0, "ba-empty-state", 57);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "section", 58)(26, "ba-section-card")(27, "div", 59)(28, "div", 30)(29, "p", 19);
    i0.ɵɵtext(30, "Runs");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "h3", 60);
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(33, "ba-status-badge", 61);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 62);
    i0.ɵɵrepeaterCreate(35, AnalysisPage_Conditional_24_For_36_Template, 15, 20, "button", 63, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 64, 0);
    i0.ɵɵelement(39, "ba-log-console", 65);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(40, AnalysisPage_Conditional_24_Conditional_40_Template, 2, 3, "section", 66);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("label", ctx_r0.activeRuns.length + " active");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.failedRuns.length + " failed");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.activeRuns.length > 0 ? 14 : 15);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunTitle);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.timeline.length > 0 ? 23 : 24);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1("", ctx_r0.runs.length, " known runs");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.failedRuns.length + " failed")("tone", ctx_r0.failedRuns.length ? "danger" : "success");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.runs);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("ring-2", ctx_r0.isLogsFocused)("ring-accent/50", ctx_r0.isLogsFocused);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("entries", ctx_r0.logs)("highlightNewest", ctx_r0.isSelectedRunLive);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.selectedRunId ? 40 : -1);
} }
export class AnalysisPage {
    constructor() {
        this.analysisApi = inject(AnalysisApiService);
        this.betautoApi = inject(BetautoApiService);
        this.route = inject(ActivatedRoute);
        this.visibilityHandler = () => this.handleVisibilityChange();
        this.isRefreshingSelectedRun = false;
        this.runsSignature = '';
        this.selectedRunSignature = '';
        this.timelineSignature = '';
        this.logsSignature = '';
        this.outputsSignature = '';
        this.isLoading = true;
        this.isStartingRun = false;
        this.isStoppingRun = false;
        this.isPolling = false;
        this.isLogsFocused = false;
        this.errorMessage = '';
        this.startRunError = '';
        this.stopRunError = '';
        this.lastUpdatedAt = '';
        this.targetDate = this.todayIsoDate();
        this.runs = [];
        this.selectedRunId = '';
        this.timeline = [];
        this.logs = [];
        this.runOutputs = null;
        this.isOutputsLoading = false;
        this.outputsError = '';
        this.stateBadges = [
            { label: 'idle', tone: 'default' },
            { label: 'pending', tone: 'warning' },
            { label: 'running', tone: 'live' },
            { label: 'completed', tone: 'success' },
            { label: 'completed_no_data', tone: 'default' },
            { label: 'failed', tone: 'danger' },
            { label: 'stopped', tone: 'warning' },
            { label: 'partial', tone: 'warning' },
            { label: 'proxy', tone: 'warning' },
            { label: 'estimated', tone: 'warning' },
            { label: 'unavailable', tone: 'default' }
        ];
    }
    ngOnInit() {
        document.addEventListener('visibilitychange', this.visibilityHandler);
        const runId = this.route.snapshot.queryParamMap.get('run_id') || '';
        if (runId) {
            this.selectedRunId = runId;
        }
        this.loadRuns(runId);
    }
    ngOnDestroy() {
        this.stopPolling();
        document.removeEventListener('visibilitychange', this.visibilityHandler);
        if (this.logsFocusTimeout) {
            clearTimeout(this.logsFocusTimeout);
        }
    }
    get activeRuns() {
        return this.runs.filter((run) => ['running', 'active', 'pending'].includes(run.status.toLowerCase()));
    }
    get failedRuns() {
        return this.runs.filter((run) => ['failed', 'error'].includes(run.status.toLowerCase()) || run.failed_steps > 0);
    }
    get kpis() {
        const completed = this.runs.filter((run) => ['completed', 'done', 'success', 'succeeded'].includes(run.status.toLowerCase()));
        const averageProgress = this.runs.length
            ? Math.round(this.runs.reduce((sum, run) => sum + run.progress, 0) / this.runs.length)
            : 0;
        return [
            { label: 'Known runs', value: String(this.runs.length), status: 'API', tone: 'default' },
            { label: 'Active runs', value: String(this.activeRuns.length), status: 'Live', tone: this.activeRuns.length ? 'live' : 'default' },
            { label: 'Completed', value: String(completed.length), status: 'Done', tone: 'success' },
            { label: 'Failed runs', value: String(this.failedRuns.length), status: this.failedRuns.length ? 'Review' : 'Clear', tone: this.failedRuns.length ? 'danger' : 'success' },
            { label: 'Avg progress', value: `${averageProgress}%`, status: 'Jobs', tone: 'default' }
        ];
    }
    get selectedRunTitle() {
        if (!this.selectedRunId) {
            return 'No run selected';
        }
        return this.selectedRun ? `${this.selectedRunId} · ${this.selectedRun.status}` : `${this.selectedRunId} timeline`;
    }
    get selectedRunStatusLabel() {
        return this.isStartingRun ? 'starting' : this.selectedRun?.status || 'idle';
    }
    get canStopSelectedRun() {
        return Boolean(this.selectedRunId && this.isSelectedRunLive && !this.selectedRun?.stop_requested);
    }
    get runProgress() {
        return this.runOutputs?.progress || {};
    }
    get totalMatchesLabel() {
        return this.progressNumberLabel('total_matches');
    }
    get analyzedMatchesLabel() {
        return this.progressNumberLabel('analyzed_matches');
    }
    get remainingMatchesLabel() {
        const pending = this.progressNumber('pending_matches');
        const running = this.progressNumber('running_matches');
        if (pending === null && running === null) {
            return '—';
        }
        return String((pending || 0) + (running || 0));
    }
    get currentMatchLabel() {
        return String(this.runProgress['current_match_label'] || '—');
    }
    get activeLeaguesLabel() {
        const trace = this.progressObject('upstream_trace');
        const value = trace['active_leagues_count'];
        return typeof value === 'number' ? String(value) : '—';
    }
    get fixturesFetchedLabel() {
        const trace = this.progressObject('upstream_trace');
        const value = trace['fixtures_fetched_total'];
        return typeof value === 'number' ? String(value) : '—';
    }
    get selectedRunTone() {
        return this.isStartingRun ? 'live' : this.toneFor(this.selectedRunStatusLabel);
    }
    get isSelectedRunLive() {
        return this.isLiveStatus(this.selectedRun?.status);
    }
    get isSelectedRunSuccess() {
        return ['completed', 'done', 'success', 'succeeded'].includes(String(this.selectedRun?.status || '').toLowerCase());
    }
    get isSelectedRunFailed() {
        return ['failed', 'error'].includes(String(this.selectedRun?.status || '').toLowerCase());
    }
    get isSelectedRunNoData() {
        return ['completed_no_data', 'no_data', 'unavailable'].includes(String(this.selectedRun?.status || '').toLowerCase());
    }
    get selectedRunEyebrow() {
        if (this.isStartingRun || this.isSelectedRunLive) {
            return 'Process active';
        }
        if (this.isSelectedRunSuccess) {
            return 'Process completed';
        }
        if (this.isSelectedRunFailed) {
            return 'Process failed';
        }
        if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
            return 'Process stopped';
        }
        if (this.isSelectedRunNoData) {
            return 'Process completed with no data';
        }
        return 'Process state';
    }
    get selectedRunHeadline() {
        if (this.isStartingRun) {
            return 'Starting analysis run';
        }
        if (this.isSelectedRunLive) {
            return 'Analysis is actively running';
        }
        if (this.isSelectedRunSuccess) {
            return 'Analysis completed successfully';
        }
        if (this.isSelectedRunFailed) {
            return 'Analysis needs attention';
        }
        if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
            return 'Analysis stopped by user';
        }
        if (this.isSelectedRunNoData) {
            return 'Run finished without eligible data';
        }
        return this.selectedRunId ? 'Run selected' : 'No run selected';
    }
    get selectedRunDescription() {
        if (this.isStartingRun) {
            return 'The run request has been sent; the queue will update as soon as the job is visible.';
        }
        if (this.isSelectedRunLive) {
            return 'Polling is active. Timeline and logs continue to refresh while the orchestrator works.';
        }
        if (this.isSelectedRunSuccess) {
            return 'All known steps are settled. Review the summary, picks and generated artifacts below.';
        }
        if (this.isSelectedRunFailed) {
            return this.selectedRun?.error || 'A step failed. Inspect the failed timeline entry and recent logs.';
        }
        if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
            return 'The run stopped at a safe point. Completed match analyses remain available below.';
        }
        if (this.isSelectedRunNoData) {
            return 'The process ended normally, but no eligible fixtures, odds or selections were available for this target.';
        }
        return 'Select a run to inspect status, progression, logs and generated artifacts.';
    }
    get selectedRunPipClass() {
        const map = {
            default: 'bg-muted',
            success: 'bg-success shadow-glow-success',
            warning: 'bg-warning shadow-glow-warning',
            danger: 'bg-danger',
            live: 'bg-accent shadow-glow',
            'score-70': 'bg-[#d97d68]',
            'score-75': 'bg-[#e5a155]',
            'score-80': 'bg-[#d4c45a]',
            'score-85': 'bg-[#86c86d]',
            'score-90': 'bg-[#41c7a5]',
            'score-95-plus': 'bg-[#4cd7f6] shadow-glow'
        };
        return map[this.selectedRunTone];
    }
    toneFor(status) {
        return statusToTone(status);
    }
    formatRunDate(value) {
        return formatApiDate(value);
    }
    shortId(value) {
        const text = String(value || '');
        if (!text) {
            return '—';
        }
        if (text.length <= 28) {
            return text;
        }
        return `${text.slice(0, 14)}…${text.slice(-10)}`;
    }
    startRun() {
        if (this.isStartingRun) {
            return;
        }
        this.isStartingRun = true;
        this.startRunError = '';
        this.betautoApi.runPipeline({ date: this.targetDate }).pipe(catchError((error) => {
            this.startRunError = this.errorToMessage(error);
            return of(null);
        })).subscribe((response) => {
            this.isStartingRun = false;
            if (!response) {
                return;
            }
            this.selectedRunId = response.job_id;
            this.loadRuns(response.job_id, false);
        });
    }
    stopAnalysis() {
        if (!this.canStopSelectedRun || this.isStoppingRun) {
            return;
        }
        this.isStoppingRun = true;
        this.stopRunError = '';
        this.analysisApi.stopRun(this.selectedRunId).pipe(catchError((error) => {
            this.stopRunError = this.errorToMessage(error);
            return of(null);
        })).subscribe(() => {
            this.isStoppingRun = false;
            this.refreshSelectedRun();
        });
    }
    selectRun(runId) {
        if (runId === this.selectedRunId) {
            return;
        }
        this.selectedRunId = runId;
        this.selectedRun = undefined;
        this.timeline = [];
        this.logs = [];
        this.runOutputs = null;
        this.outputsError = '';
        this.resetSelectedRunSignatures();
        this.stopPolling();
        this.loadSelectedRunDetails(runId);
    }
    clearSelectedRun() {
        this.selectedRunId = '';
        this.selectedRun = undefined;
        this.timeline = [];
        this.logs = [];
        this.runOutputs = null;
        this.outputsError = '';
        this.isOutputsLoading = false;
        this.resetSelectedRunSignatures();
        this.stopPolling();
    }
    viewLogs() {
        this.logsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.isLogsFocused = true;
        if (this.logsFocusTimeout) {
            clearTimeout(this.logsFocusTimeout);
        }
        this.logsFocusTimeout = setTimeout(() => {
            this.isLogsFocused = false;
        }, 1400);
    }
    setTargetDate(event) {
        const input = event.target;
        if (input?.value) {
            this.targetDate = input.value;
        }
    }
    loadRuns(preferredRunId = '', showLoading = true) {
        this.isLoading = showLoading;
        this.errorMessage = '';
        this.analysisApi.getRuns().pipe(catchError((error) => {
            this.errorMessage = this.errorToMessage(error);
            return of([]);
        })).subscribe((runs) => {
            this.setRuns(runs);
            const preferredRun = preferredRunId ? runs.find((run) => run.run_id === preferredRunId) : undefined;
            const currentRun = this.selectedRunId ? runs.find((run) => run.run_id === this.selectedRunId) : undefined;
            this.selectedRunId = preferredRun?.run_id || currentRun?.run_id || runs[0]?.run_id || '';
            if (!this.selectedRunId || this.errorMessage) {
                this.isLoading = false;
                this.stopPolling();
                return;
            }
            this.loadSelectedRunDetails(this.selectedRunId);
        });
    }
    loadSelectedRunDetails(runId) {
        forkJoin({
            run: this.analysisApi.getRun(runId).pipe(catchError(() => of(undefined))),
            timeline: this.analysisApi.getTimeline(runId).pipe(catchError(() => of([]))),
            logs: this.analysisApi.getLogs(runId).pipe(catchError(() => of([])))
        }).pipe(catchError((error) => {
            this.errorMessage = this.errorToMessage(error);
            return of({ run: undefined, timeline: [], logs: [] });
        })).subscribe(({ run, timeline, logs }) => {
            if (this.selectedRunId !== runId) {
                return;
            }
            if (!run) {
                if (this.selectedRunId === runId) {
                    this.clearSelectedRun();
                }
                this.isLoading = false;
                return;
            }
            this.setSelectedRun(run);
            this.setTimeline(timeline);
            this.setLogs(logs);
            this.lastUpdatedAt = formatApiDate(new Date().toISOString());
            this.isLoading = false;
            this.updatePollingState(run?.status);
            this.loadRunOutputs(runId);
        });
    }
    loadRunOutputs(runId, options = {}) {
        if (!options.silent) {
            this.isOutputsLoading = true;
            this.outputsError = '';
        }
        this.analysisApi.getRunOutputs(runId).pipe(catchError((error) => {
            if (!options.silent) {
                this.outputsError = this.errorToMessage(error);
            }
            return of(null);
        })).subscribe((outputs) => {
            if (this.selectedRunId !== runId) {
                return;
            }
            if (outputs) {
                this.setRunOutputs(outputs);
                this.outputsError = '';
            }
            if (!options.silent) {
                this.isOutputsLoading = false;
            }
        });
    }
    refreshSelectedRun() {
        if (!this.selectedRunId || document.hidden) {
            this.stopPolling();
            return;
        }
        if (this.isRefreshingSelectedRun) {
            return;
        }
        const requestedRunId = this.selectedRunId;
        this.isRefreshingSelectedRun = true;
        this.analysisApi.getRuns().pipe(catchError((error) => {
            this.errorMessage = this.errorToMessage(error);
            this.stopPolling();
            return of([]);
        })).subscribe((runs) => {
            this.setRuns(runs);
            const selectedStillExists = runs.some((run) => run.run_id === this.selectedRunId);
            if (!selectedStillExists) {
                const fallbackRunId = runs[0]?.run_id || '';
                if (!fallbackRunId) {
                    this.clearSelectedRun();
                    this.isRefreshingSelectedRun = false;
                    return;
                }
                this.selectedRunId = fallbackRunId;
            }
            if (!this.selectedRunId) {
                this.clearSelectedRun();
                this.isRefreshingSelectedRun = false;
                return;
            }
            this.refreshSelectedRunDetails(this.selectedRunId, requestedRunId);
        });
    }
    refreshSelectedRunDetails(runId, requestedRunId) {
        forkJoin({
            run: this.analysisApi.getRun(runId).pipe(catchError(() => of(undefined))),
            timeline: this.analysisApi.getTimeline(runId).pipe(catchError(() => of([]))),
            logs: this.analysisApi.getLogs(runId).pipe(catchError(() => of([]))),
            outputs: this.analysisApi.getRunOutputs(runId).pipe(catchError(() => of(null)))
        }).subscribe(({ run, timeline, logs, outputs }) => {
            this.isRefreshingSelectedRun = false;
            if (this.selectedRunId !== runId && this.selectedRunId !== requestedRunId) {
                return;
            }
            if (!run) {
                if (this.selectedRunId === runId) {
                    this.clearSelectedRun();
                }
                return;
            }
            this.setSelectedRun(run);
            this.setTimeline(timeline);
            this.setLogs(logs);
            if (outputs) {
                this.setRunOutputs(outputs);
                this.outputsError = '';
            }
            this.lastUpdatedAt = formatApiDate(new Date().toISOString());
            this.updatePollingState(run.status);
        });
    }
    updatePollingState(status) {
        const normalized = String(status || '').toLowerCase();
        if (['running', 'active', 'pending'].includes(normalized) && !document.hidden) {
            this.startPolling();
            return;
        }
        if (['completed', 'done', 'success', 'succeeded', 'failed', 'error', 'skipped', 'stopped', 'cancelled', 'interrupted'].includes(normalized)) {
            this.stopPolling();
        }
    }
    startPolling() {
        if (!this.selectedRunId || document.hidden) {
            this.isPolling = false;
            return;
        }
        if (this.pollingSubscription) {
            this.isPolling = true;
            return;
        }
        this.isPolling = true;
        this.pollingSubscription = interval(3000).subscribe(() => this.refreshSelectedRun());
    }
    stopPolling() {
        this.pollingSubscription?.unsubscribe();
        this.pollingSubscription = undefined;
        this.isPolling = false;
    }
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopPolling();
            return;
        }
        if (this.selectedRunId && this.isLiveStatus(this.selectedRun?.status)) {
            this.refreshSelectedRun();
            this.startPolling();
        }
    }
    isLiveStatus(status) {
        return ['running', 'active', 'pending'].includes(String(status || '').toLowerCase());
    }
    progressNumber(key) {
        const value = this.runProgress[key];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    progressNumberLabel(key) {
        const value = this.progressNumber(key);
        return value === null ? '—' : String(value);
    }
    progressObject(key) {
        const value = this.runProgress[key];
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    }
    todayIsoDate() {
        return new Date().toISOString().slice(0, 10);
    }
    toTimelineItem(step) {
        return {
            id: step.id || `${step.title}:${step.status}`,
            title: step.title,
            meta: step.status,
            description: step.message || 'No message.',
            tone: statusToTone(step.status)
        };
    }
    toLogEntry(entry) {
        return {
            id: `${entry.at || ''}:${entry.level}:${entry.message}`,
            time: formatApiDate(entry.at),
            level: this.logLevel(entry.level),
            message: entry.message
        };
    }
    toRecentLogEntries(entries) {
        return [...entries]
            .filter((entry) => String(entry.message || '').trim().length > 0)
            .map((entry) => this.toLogEntry(entry))
            .reverse();
    }
    logLevel(level) {
        if (level === 'success' || level === 'warning') {
            return level;
        }
        if (level === 'error') {
            return 'danger';
        }
        return 'info';
    }
    errorToMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'Impossible de charger les runs analysis depuis l’API.';
    }
    setRuns(runs) {
        const signature = this.stringifyStable(runs);
        if (signature === this.runsSignature) {
            return;
        }
        this.runsSignature = signature;
        this.runs = runs;
    }
    setSelectedRun(run) {
        const signature = this.stringifyStable(run);
        if (signature === this.selectedRunSignature) {
            return;
        }
        this.selectedRunSignature = signature;
        this.selectedRun = run;
    }
    setTimeline(steps) {
        const signature = this.stringifyStable(steps);
        if (signature === this.timelineSignature) {
            return;
        }
        this.timelineSignature = signature;
        this.timeline = steps.map((step) => this.toTimelineItem(step));
    }
    setLogs(entries) {
        const visibleEntries = entries.filter((entry) => String(entry.message || '').trim().length > 0);
        const signature = this.stringifyStable(visibleEntries);
        if (signature === this.logsSignature) {
            return;
        }
        this.logsSignature = signature;
        this.logs = this.toRecentLogEntries(visibleEntries);
    }
    setRunOutputs(outputs) {
        const signature = this.stringifyStable(outputs);
        if (signature === this.outputsSignature) {
            return;
        }
        this.outputsSignature = signature;
        this.runOutputs = outputs;
    }
    resetSelectedRunSignatures() {
        this.selectedRunSignature = '';
        this.timelineSignature = '';
        this.logsSignature = '';
        this.outputsSignature = '';
    }
    stringifyStable(value) {
        return JSON.stringify(value ?? null);
    }
    static { this.ɵfac = function AnalysisPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AnalysisPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AnalysisPage, selectors: [["ba-analysis-page"]], viewQuery: function AnalysisPage_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.logsSection = _t.first);
        } }, decls: 25, vars: 9, consts: [["logsSection", ""], ["eyebrow", "AI Analysis Pipeline", "title", "Analysis Queue", "subtitle", "Suivi des analyses programm\u00E9es et des runs d\u2019orchestrateur."], [1, "flex", "w-full", "flex-wrap", "gap-2", "md:w-auto", "md:justify-end"], [1, "ba-tool", "flex", "min-w-0", "flex-1", "items-center", "gap-2", "md:flex-none"], [1, "ba-label", "normal-case", "tracking-normal"], ["type", "date", "aria-label", "Analysis target date", 1, "min-w-0", "bg-transparent", "font-data", "text-text", "outline-none", 3, "change", "value"], ["type", "button", 1, "ba-tool", "min-w-[8.5rem]", "flex-1", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", "disabled:cursor-not-allowed", "disabled:opacity-60", "md:flex-none", 3, "click", "disabled"], ["type", "button", 1, "ba-tool", "flex-1", "md:flex-none", 3, "click"], [1, "mb-4", "grid", "gap-3", "sm:grid-cols-2", "xl:grid-cols-4"], [1, "mb-4", "overflow-hidden", "rounded-card", "border", "bg-surface-low", 3, "border-accent/60", "border-success/50", "border-danger/50", "border-border/70"], [1, "mb-4", "grid", "gap-3", "md:grid-cols-2", "xl:grid-cols-5"], [1, "mb-4"], [1, "mb-4", "overflow-hidden", "rounded-card", "border", "border-border/60", "bg-surface-low", "p-3"], [1, "flex", "items-center", "gap-2", "overflow-x-auto", "pb-1"], [1, "ba-label", "mr-2"], [3, "label", "tone", "showPip", "pulse"], ["label", "Analysis API unavailable", 3, "message"], ["label", "No analysis runs", "message", "Aucun job n\u2019est pr\u00E9sent en m\u00E9moire. Lance un run via l\u2019API pour alimenter cette page."], [1, "rounded-card", "border", "border-border/60", "bg-surface-low", "p-3"], [1, "ba-label"], [1, "ba-data", "mt-2", "text-text"], [1, "ba-data", "mt-2", "truncate", "text-text", 3, "title"], [1, "mt-2", "flex", "items-center", "gap-2"], [3, "label", "tone", "pulse", "showPip"], [1, "mb-4", "overflow-hidden", "rounded-card", "border", "bg-surface-low"], [1, "flex", "flex-col", "gap-4", "p-4", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "flex", "min-w-0", "items-start", "gap-3"], [1, "relative", "mt-1", "flex", "h-3", "w-3", "shrink-0"], [1, "absolute", "inline-flex", "h-full", "w-full", "animate-ping", "rounded-full", "bg-accent", "opacity-30"], [1, "relative", "h-3", "w-3", "rounded-full"], [1, "min-w-0"], [1, "mt-1", "text-base", "font-semibold", "text-text"], [1, "mt-1", "text-sm", "text-muted"], [1, "ba-data", "mt-2", "truncate", "text-muted"], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["tone", "default", 3, "label"], ["label", "stop requested", "tone", "warning", 3, "showPip"], ["type", "button", 1, "ba-tool", "border-danger/60", "text-danger", "hover:bg-danger/10", "disabled:cursor-not-allowed", "disabled:opacity-60", 3, "disabled"], [1, "h-1", "overflow-hidden", "bg-background"], ["type", "button", 1, "ba-tool", "border-danger/60", "text-danger", "hover:bg-danger/10", "disabled:cursor-not-allowed", "disabled:opacity-60", 3, "click", "disabled"], [1, "h-full", "w-1/2", "animate-pulse", "rounded-full", "bg-accent", "shadow-glow"], [1, "mt-2", "truncate", "text-sm", "text-text"], ["label", "Stop request failed", 3, "message"], ["label", "Run start failed", 3, "message"], [1, "p-4"], ["message", "Chargement des runs d\u2019analyse...", "detail", "Lecture des jobs, timelines et logs stricts.", 3, "showShimmer"], [1, "grid", "gap-3", "sm:grid-cols-2", "xl:grid-cols-5"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "flex", "flex-wrap", "gap-2"], ["tone", "live", 3, "label"], ["tone", "danger", 3, "label"], [1, "grid", "max-h-[26rem]", "gap-3", "overflow-y-auto", "p-3", "md:grid-cols-2"], [1, "ba-card-header"], [3, "items"], ["label", "No timeline", "message", "Ce run ne contient pas encore d\u2019\u00E9tapes."], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)]"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-3"], [1, "mt-1", "truncate", "text-sm", "font-semibold", "text-text"], [3, "label", "tone"], [1, "max-h-[30rem]", "space-y-2", "overflow-y-auto", "p-3"], ["type", "button", 1, "w-full", "rounded-card", "border", "px-3", "py-2", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "border-accent", "bg-accent/10", "border-border", "bg-background"], [1, "rounded-card", "transition"], ["label", "Recent logs", "title", "Analysis pipeline output", "emptyMessage", "No logs yet", 3, "entries", "highlightNewest"], [1, "mt-4"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "mt-4", "h-2", "overflow-hidden", "rounded-full", "bg-surface-high"], [1, "h-full", "rounded-full", "bg-accent", "shadow-glow"], [1, "mt-4", "grid", "grid-cols-2", "gap-3", "text-sm"], [1, "ba-data", "mt-1", "text-text"], [1, "mt-1", "text-muted"], [1, "ba-data", "mt-1", "text-success"], ["label", "No active runs", "message", "Les runs connus sont termin\u00E9s, \u00E9chou\u00E9s ou en attente."], ["type", "button", 1, "w-full", "rounded-card", "border", "px-3", "py-2", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "click"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "ba-data", "truncate", "text-text", 3, "title"], [1, "mt-1", "truncate", "text-xs", "text-muted"], [1, "mt-2", "flex", "flex-wrap", "gap-2", "text-xs", "text-muted"], [3, "outputs", "loading", "error"]], template: function AnalysisPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 1)(1, "div", 2)(2, "label", 3)(3, "span", 4);
            i0.ɵɵtext(4, "Target");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "input", 5);
            i0.ɵɵlistener("change", function AnalysisPage_Template_input_change_5_listener($event) { return ctx.setTargetDate($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "button", 6);
            i0.ɵɵlistener("click", function AnalysisPage_Template_button_click_6_listener() { return ctx.startRun(); });
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "button", 7);
            i0.ɵɵlistener("click", function AnalysisPage_Template_button_click_8_listener() { return ctx.viewLogs(); });
            i0.ɵɵtext(9, " View Logs ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(10, AnalysisPage_Conditional_10_Template, 21, 8, "section", 8);
            i0.ɵɵconditionalCreate(11, AnalysisPage_Conditional_11_Template, 21, 24, "section", 9);
            i0.ɵɵconditionalCreate(12, AnalysisPage_Conditional_12_Template, 26, 6, "section", 10);
            i0.ɵɵconditionalCreate(13, AnalysisPage_Conditional_13_Template, 2, 1, "div", 11);
            i0.ɵɵelementStart(14, "section", 12)(15, "div", 13)(16, "span", 14);
            i0.ɵɵtext(17, "State vocabulary");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(18, AnalysisPage_For_19_Template, 1, 4, "ba-status-badge", 15, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(20, AnalysisPage_Conditional_20_Template, 2, 1, "div", 11);
            i0.ɵɵconditionalCreate(21, AnalysisPage_Conditional_21_Template, 3, 1, "ba-section-card")(22, AnalysisPage_Conditional_22_Template, 1, 1, "ba-error-state", 16)(23, AnalysisPage_Conditional_23_Template, 1, 0, "ba-empty-state", 17)(24, AnalysisPage_Conditional_24_Template, 41, 15);
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("value", ctx.targetDate);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isStartingRun);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.isStartingRun ? "Starting run..." : "Run Analysis", " ");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.selectedRunId || ctx.isPolling || ctx.lastUpdatedAt || ctx.startRunError ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.selectedRunId || ctx.isStartingRun ? 11 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.selectedRunId ? 12 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.stopRunError ? 13 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.stateBadges);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.startRunError ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading ? 21 : ctx.errorMessage ? 22 : ctx.runs.length === 0 ? 23 : 24);
        } }, dependencies: [EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            RunOutputInspectorComponent,
            SectionCardComponent,
            StatusBadgeComponent,
            TimelineComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AnalysisPage, [{
        type: Component,
        args: [{
                selector: 'ba-analysis-page',
                standalone: true,
                imports: [
                    EmptyStateComponent,
                    ErrorStateComponent,
                    KpiCardComponent,
                    LoadingStateComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    RunOutputInspectorComponent,
                    SectionCardComponent,
                    StatusBadgeComponent,
                    TimelineComponent
                ],
                template: `
    <ba-page-header
      eyebrow="AI Analysis Pipeline"
      title="Analysis Queue"
      subtitle="Suivi des analyses programmées et des runs d’orchestrateur."
    >
      <div class="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
        <label class="ba-tool flex min-w-0 flex-1 items-center gap-2 md:flex-none">
          <span class="ba-label normal-case tracking-normal">Target</span>
          <input
            class="min-w-0 bg-transparent font-data text-text outline-none"
            type="date"
            [value]="targetDate"
            (change)="setTargetDate($event)"
            aria-label="Analysis target date"
          />
        </label>
        <button
          type="button"
          class="ba-tool min-w-[8.5rem] flex-1 border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
          [disabled]="isStartingRun"
          (click)="startRun()"
        >
          {{ isStartingRun ? 'Starting run...' : 'Run Analysis' }}
        </button>
        <button type="button" class="ba-tool flex-1 md:flex-none" (click)="viewLogs()">
          View Logs
        </button>
      </div>
    </ba-page-header>

    @if (selectedRunId || isPolling || lastUpdatedAt || startRunError) {
      <section class="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Target date</p>
          <p class="ba-data mt-2 text-text">{{ targetDate }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Active run</p>
          <p class="ba-data mt-2 truncate text-text" [title]="selectedRunId">{{ shortId(selectedRunId) }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Polling</p>
          <div class="mt-2 flex items-center gap-2">
            <ba-status-badge
              [label]="isPolling ? 'Polling every 3s' : 'Polling stopped'"
              [tone]="isPolling ? 'live' : 'default'"
              [pulse]="isPolling"
              [showPip]="true"
            ></ba-status-badge>
          </div>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Last updated</p>
          <p class="ba-data mt-2 text-text">{{ lastUpdatedAt || '—' }}</p>
        </div>
      </section>
    }

    @if (selectedRunId || isStartingRun) {
      <section
        class="mb-4 overflow-hidden rounded-card border bg-surface-low"
        [class.border-accent/60]="isSelectedRunLive || isStartingRun"
        [class.border-success/50]="isSelectedRunSuccess"
        [class.border-danger/50]="isSelectedRunFailed"
        [class.border-border/70]="!isSelectedRunLive && !isStartingRun && !isSelectedRunSuccess && !isSelectedRunFailed"
      >
        <div class="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="relative mt-1 flex h-3 w-3 shrink-0">
              @if (isSelectedRunLive || isStartingRun) {
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
              }
              <span class="relative h-3 w-3 rounded-full" [class]="selectedRunPipClass"></span>
            </span>
            <div class="min-w-0">
              <p class="ba-label">{{ selectedRunEyebrow }}</p>
              <h2 class="mt-1 text-base font-semibold text-text">{{ selectedRunHeadline }}</h2>
              <p class="mt-1 text-sm text-muted">{{ selectedRunDescription }}</p>
              @if (selectedRunId) {
                <p class="ba-data mt-2 truncate text-muted">job_id {{ selectedRunId }}</p>
              }
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <ba-status-badge
              [label]="selectedRunStatusLabel"
              [tone]="selectedRunTone"
              [pulse]="isSelectedRunLive || isStartingRun"
              [showPip]="true"
            ></ba-status-badge>
            @if (selectedRun?.orchestrator_run_id) {
              <ba-status-badge [label]="'run ' + selectedRun?.orchestrator_run_id" tone="default"></ba-status-badge>
            }
            @if (selectedRun?.stop_requested) {
              <ba-status-badge label="stop requested" tone="warning" [showPip]="true"></ba-status-badge>
            }
            <ba-status-badge [label]="lastUpdatedAt ? 'Updated ' + lastUpdatedAt : 'Waiting for first update'" tone="default"></ba-status-badge>
            @if (canStopSelectedRun) {
              <button
                type="button"
                class="ba-tool border-danger/60 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                [disabled]="isStoppingRun"
                (click)="stopAnalysis()"
              >
                {{ isStoppingRun ? 'Stop requested...' : 'Stop Analysis' }}
              </button>
            }
          </div>
        </div>
        @if (isSelectedRunLive || isStartingRun) {
          <div class="h-1 overflow-hidden bg-background">
            <div class="h-full w-1/2 animate-pulse rounded-full bg-accent shadow-glow"></div>
          </div>
        }
      </section>
    }

    @if (selectedRunId) {
      <section class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Matches found</p>
          <p class="ba-data mt-2 text-text">{{ totalMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Analyzed</p>
          <p class="ba-data mt-2 text-text">{{ analyzedMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Remaining</p>
          <p class="ba-data mt-2 text-text">{{ remainingMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Current match</p>
          <p class="mt-2 truncate text-sm text-text">{{ currentMatchLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Leagues / fixtures</p>
          <p class="ba-data mt-2 text-text">{{ activeLeaguesLabel }} / {{ fixturesFetchedLabel }}</p>
        </div>
      </section>
    }

    @if (stopRunError) {
      <div class="mb-4">
        <ba-error-state
          label="Stop request failed"
          [message]="stopRunError"
        ></ba-error-state>
      </div>
    }

    <section class="mb-4 overflow-hidden rounded-card border border-border/60 bg-surface-low p-3">
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        <span class="ba-label mr-2">State vocabulary</span>
        @for (state of stateBadges; track state.label) {
          <ba-status-badge
            [label]="state.label"
            [tone]="state.tone"
            [showPip]="true"
            [pulse]="state.label === 'running'"
          ></ba-status-badge>
        }
      </div>
    </section>

    @if (startRunError) {
      <div class="mb-4">
        <ba-error-state
          label="Run start failed"
          [message]="startRunError"
        ></ba-error-state>
      </div>
    }

    @if (isLoading) {
      <ba-section-card>
          <div class="p-4">
          <ba-loading-state
            message="Chargement des runs d’analyse..."
            detail="Lecture des jobs, timelines et logs stricts."
            [showShimmer]="true"
          ></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (errorMessage) {
      <ba-error-state
        label="Analysis API unavailable"
        [message]="errorMessage"
      ></ba-error-state>
    } @else if (runs.length === 0) {
      <ba-empty-state
        label="No analysis runs"
        message="Aucun job n’est présent en mémoire. Lance un run via l’API pour alimenter cette page."
      ></ba-empty-state>
    } @else {
      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        @for (kpi of kpis; track kpi.label) {
          <ba-kpi-card
            [label]="kpi.label"
            [value]="kpi.value"
            [status]="kpi.status || ''"
            [tone]="kpi.tone || 'default'"
          ></ba-kpi-card>
        }
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="ba-label">Active runs</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Orchestrator execution queue</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <ba-status-badge [label]="activeRuns.length + ' active'" tone="live"></ba-status-badge>
              <ba-status-badge [label]="failedRuns.length + ' failed'" tone="danger"></ba-status-badge>
            </div>
          </div>

          @if (activeRuns.length > 0) {
            <div class="grid max-h-[26rem] gap-3 overflow-y-auto p-3 md:grid-cols-2">
              @for (run of activeRuns; track run.run_id) {
                <article class="rounded-card border border-border/60 bg-background/60 p-3">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <p class="ba-label">Run ID</p>
                      <h4 class="ba-data mt-2 truncate text-text" [title]="run.run_id">{{ shortId(run.run_id) }}</h4>
                    </div>
                    <ba-status-badge
                      [label]="run.status"
                      [tone]="toneFor(run.status)"
                      [pulse]="isLiveStatus(run.status)"
                      [showPip]="true"
                    ></ba-status-badge>
                  </div>
                  <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-high">
                    <div
                      class="h-full rounded-full bg-accent shadow-glow"
                      [class.animate-pulse]="isLiveStatus(run.status)"
                      [style.width.%]="run.progress"
                    ></div>
                  </div>
                  <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt class="ba-label">Progress</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.progress }}%</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Steps</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.completed_steps }} / {{ run.step_count }}</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Target</dt>
                      <dd class="mt-1 text-muted">{{ run.target_date || '—' }}</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Picks</dt>
                      <dd class="ba-data mt-1 text-success">{{ run.picks_count ?? '—' }}</dd>
                    </div>
                  </dl>
                </article>
              }
            </div>
          } @else {
            <div class="p-4">
              <ba-empty-state
                label="No active runs"
                message="Les runs connus sont terminés, échoués ou en attente."
              ></ba-empty-state>
            </div>
          }
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Analysis timeline</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ selectedRunTitle }}</h3>
          </div>
          <div class="p-4">
            @if (timeline.length > 0) {
              <ba-timeline [items]="timeline"></ba-timeline>
            } @else {
              <ba-empty-state
                label="No timeline"
                message="Ce run ne contient pas encore d’étapes."
              ></ba-empty-state>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)]">
        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="ba-label">Runs</p>
              <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ runs.length }} known runs</h3>
            </div>
            <ba-status-badge [label]="failedRuns.length + ' failed'" [tone]="failedRuns.length ? 'danger' : 'success'"></ba-status-badge>
          </div>
          <div class="max-h-[30rem] space-y-2 overflow-y-auto p-3">
            @for (run of runs; track run.run_id) {
              <button
                type="button"
                class="w-full rounded-card border px-3 py-2 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="run.run_id === selectedRunId"
                [class.bg-accent/10]="run.run_id === selectedRunId"
                [class.border-border]="run.run_id !== selectedRunId"
                [class.bg-background]="run.run_id !== selectedRunId"
                (click)="selectRun(run.run_id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-data truncate text-text" [title]="run.run_id">{{ shortId(run.run_id) }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ run.target_date || '—' }} · {{ formatRunDate(run.created_at) }}</p>
                  </div>
                  <ba-status-badge
                    [label]="run.status"
                    [tone]="toneFor(run.status)"
                    [pulse]="isLiveStatus(run.status)"
                    [showPip]="true"
                  ></ba-status-badge>
                </div>
                <div class="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                  <span>{{ run.progress }}%</span>
                  <span>{{ run.completed_steps }}/{{ run.step_count }} steps</span>
                  <span>{{ run.picks_count ?? '—' }} picks</span>
                </div>
              </button>
            }
          </div>
        </ba-section-card>

        <div
          #logsSection
          class="rounded-card transition"
          [class.ring-2]="isLogsFocused"
          [class.ring-accent/50]="isLogsFocused"
        >
          <ba-log-console
            label="Recent logs"
            title="Analysis pipeline output"
            [entries]="logs"
            emptyMessage="No logs yet"
            [highlightNewest]="isSelectedRunLive"
          ></ba-log-console>
        </div>
      </section>

      @if (selectedRunId) {
        <section class="mt-4">
          <ba-run-output-inspector
            [outputs]="runOutputs"
            [loading]="isOutputsLoading"
            [error]="outputsError"
          ></ba-run-output-inspector>
        </section>
      }
    }
  `
            }]
    }], null, { logsSection: [{
            type: ViewChild,
            args: ['logsSection']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AnalysisPage, { className: "AnalysisPage", filePath: "src/app/features/analysis/analysis.page.ts", lineNumber: 403 }); })();
//# sourceMappingURL=analysis.page.js.map