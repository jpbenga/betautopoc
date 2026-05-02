import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { TicketApiService } from '../../core/api/ticket-api.service';
import { confidenceScoreToTone, statusToTone } from '../../core/api/api.mappers';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _c0 = a0 => ({ run_id: a0 });
const _c1 = () => [];
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.ticket_id;
const _forTrack2 = ($index, $item) => $item.pick_id || $index;
const _forTrack3 = ($index, $item) => $item + $index;
const _forTrack4 = ($index, $item) => $item.marketCanonicalId + $item.selectionCanonicalId + $index;
function TicketsPage_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 5);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Disabled while job ", ctx_r0.generatedRunId || "is starting", " runs.");
} }
function TicketsPage_For_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 9);
} if (rf & 2) {
    const state_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", state_r2.label)("tone", state_r2.tone)("showPip", true)("pulse", state_r2.label === "running");
} }
function TicketsPage_Conditional_15_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 18);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("label", "job " + ctx_r0.generatedRunId);
} }
function TicketsPage_Conditional_15_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 19);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("label", ctx_r0.generationStatus)("tone", ctx_r0.generationTone)("pulse", ctx_r0.isGenerationLive)("showPip", true);
} }
function TicketsPage_Conditional_15_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 20);
} if (rf & 2) {
    i0.ɵɵproperty("pulse", true)("showPip", true);
} }
function TicketsPage_Conditional_15_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 21);
    i0.ɵɵtext(1, " View run ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("queryParams", i0.ɵɵpureFunction1(1, _c0, ctx_r0.generatedRunId));
} }
function TicketsPage_Conditional_15_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 25);
} }
function TicketsPage_Conditional_15_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33);
    i0.ɵɵelement(1, "ba-error-state", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.generationError);
} }
function TicketsPage_Conditional_15_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33);
    i0.ɵɵelement(1, "ba-empty-state", 35);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("meta", ctx_r0.generatedRunId ? "job_id " + ctx_r0.generatedRunId : "");
} }
function TicketsPage_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10)(1, "ba-section-card")(2, "div", 13)(3, "div")(4, "p", 14);
    i0.ɵɵtext(5, "Ticket generation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "h3", 15);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 16);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 17);
    i0.ɵɵconditionalCreate(11, TicketsPage_Conditional_15_Conditional_11_Template, 1, 1, "ba-status-badge", 18);
    i0.ɵɵconditionalCreate(12, TicketsPage_Conditional_15_Conditional_12_Template, 1, 4, "ba-status-badge", 19);
    i0.ɵɵconditionalCreate(13, TicketsPage_Conditional_15_Conditional_13_Template, 1, 2, "ba-status-badge", 20);
    i0.ɵɵconditionalCreate(14, TicketsPage_Conditional_15_Conditional_14_Template, 2, 3, "a", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 22)(16, "div", 23)(17, "span", 24);
    i0.ɵɵconditionalCreate(18, TicketsPage_Conditional_15_Conditional_18_Template, 1, 0, "span", 25);
    i0.ɵɵelement(19, "span", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 27);
    i0.ɵɵelement(21, "div", 28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 29);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div", 30)(25, "div", 31)(26, "p", 14);
    i0.ɵɵtext(27, "Target date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "p", 32);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "div", 31)(31, "p", 14);
    i0.ɵɵtext(32, "Orchestrator run");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "p", 32);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 31)(36, "p", 14);
    i0.ɵɵtext(37, "Last updated");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "p", 32);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()()();
    i0.ɵɵconditionalCreate(40, TicketsPage_Conditional_15_Conditional_40_Template, 2, 1, "div", 33)(41, TicketsPage_Conditional_15_Conditional_41_Template, 2, 1, "div", 33);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.generationMessage);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.generationDetail);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.generatedRunId ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.generationStatus ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isGenerationPolling ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showViewRunLink ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-accent/5", ctx_r0.isGenerationLive)("bg-success/5", ctx_r0.isGenerationSuccess)("bg-danger/5", ctx_r0.isGenerationFailed)("bg-surface", !ctx_r0.isGenerationLive && !ctx_r0.isGenerationSuccess && !ctx_r0.isGenerationFailed);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.isGenerationLive ? 18 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.generationPipClass);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r0.generationProgress, "%");
    i0.ɵɵclassProp("bg-accent", ctx_r0.isGenerationLive)("bg-success", ctx_r0.isGenerationSuccess)("bg-danger", ctx_r0.isGenerationFailed)("bg-warning", ctx_r0.isGenerationNoTicket)("bg-muted", !ctx_r0.isGenerationLive && !ctx_r0.isGenerationSuccess && !ctx_r0.isGenerationFailed && !ctx_r0.isGenerationNoTicket)("animate-pulse", ctx_r0.isGenerationLive);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.generationProgress, "%");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r0.generationTargetDate || ctx_r0.targetDate);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.generatedOrchestratorRunId || "Waiting for run artifact");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.ticketGenerationLastUpdatedAt || "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.generationError ? 40 : ctx_r0.isGenerationNoTicket ? 41 : -1);
} }
function TicketsPage_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 11);
    i0.ɵɵelement(1, "ba-loading-state", 36);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("showShimmer", true);
} }
function TicketsPage_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10);
    i0.ɵɵelement(1, "ba-error-state", 37);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function TicketsPage_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10);
    i0.ɵɵelement(1, "ba-empty-state", 38);
    i0.ɵɵelementEnd();
} }
function TicketsPage_Conditional_19_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 40);
} if (rf & 2) {
    const kpi_r3 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r3.label)("value", kpi_r3.value)("status", kpi_r3.status)("tone", kpi_r3.tone);
} }
function TicketsPage_Conditional_19_For_14_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 60);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_19_For_14_Template_button_click_0_listener() { const ticket_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectTicket(ticket_r5.ticket_id)); });
    i0.ɵɵelementStart(1, "div", 61)(2, "div", 43)(3, "p", 62);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 63);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 65)(9, "span", 66);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 66);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "ba-status-badge", 64);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ticket_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("border-accent", ticket_r5.ticket_id === ctx_r0.selectedTicketId)("bg-accent/10", ticket_r5.ticket_id === ctx_r0.selectedTicketId)("border-border", ticket_r5.ticket_id !== ctx_r0.selectedTicketId)("bg-background", ticket_r5.ticket_id !== ctx_r0.selectedTicketId);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.shortId(ticket_r5.ticket_id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ticket_r5.target_date || "no date", " \u00B7 ", ctx_r0.competitionSummary(ticket_r5.competitions));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ticket_r5.status)("tone", ctx_r0.toneFor(ticket_r5.status));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ticket_r5.picks_count, " picks");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.formatOdds(ticket_r5.estimated_combo_odds), " odds");
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.formatPercent(ticket_r5.global_confidence_score))("tone", ctx_r0.confidenceTone(ticket_r5.global_confidence_score));
} }
function TicketsPage_Conditional_19_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-loading-state", 50);
} }
function TicketsPage_Conditional_19_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 67)(2, "div", 43)(3, "p", 14);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h4", 68);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 69);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 17);
    i0.ɵɵelement(10, "ba-status-badge", 64)(11, "ba-status-badge", 64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 70)(13, "div")(14, "p", 14);
    i0.ɵɵtext(15, "Picks");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "p", 71);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div")(19, "p", 14);
    i0.ɵɵtext(20, "Odds");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "p", 71);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div")(24, "p", 14);
    i0.ɵɵtext(25, "Risk");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "p", 71);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div")(29, "p", 14);
    i0.ɵɵtext(30, "Target");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "p", 71);
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.selectedTicket.target_date || "Target date unknown");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.shortId(ctx_r0.selectedTicket.ticket_id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.competitionSummary(ctx_r0.selectedTicket.competitions));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", ctx_r0.selectedTicket.status)("tone", ctx_r0.toneFor(ctx_r0.selectedTicket.status));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.formatPercent(ctx_r0.selectedTicket.global_confidence_score))("tone", ctx_r0.confidenceTone(ctx_r0.selectedTicket.global_confidence_score));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r0.selectedTicket.picks_count);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.formatOdds(ctx_r0.selectedTicket.estimated_combo_odds));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectedTicket.combo_risk_level || "unknown");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.comboTargetLabel(ctx_r0.selectedTicket));
} }
function TicketsPage_Conditional_19_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 51);
} }
function TicketsPage_Conditional_19_For_36_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 72);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_19_For_36_Template_button_click_0_listener() { const ticket_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectTicket(ticket_r7.ticket_id)); });
    i0.ɵɵelementStart(1, "div", 61)(2, "div", 43)(3, "p", 73);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 63);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 74)(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ticket_r7 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("border-accent", ticket_r7.ticket_id === ctx_r0.selectedTicketId)("bg-accent/10", ticket_r7.ticket_id === ctx_r0.selectedTicketId);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ticket_r7.target_date || "No date");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.competitionSummary(ticket_r7.competitions));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.formatPercent(ticket_r7.global_confidence_score))("tone", ctx_r0.confidenceTone(ticket_r7.global_confidence_score));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ticket_r7.picks_count, " picks");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.formatOdds(ticket_r7.estimated_combo_odds), " odds");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ticket_r7.combo_risk_level || "risk \u2014");
} }
function TicketsPage_Conditional_19_For_46_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 72);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_19_For_46_Template_button_click_0_listener() { const pick_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openPickModal(pick_r9)); });
    i0.ɵɵelementStart(1, "div", 75)(2, "div", 43)(3, "p", 73);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 63);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 63);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 76);
    i0.ɵɵelement(10, "ba-status-badge", 64)(11, "ba-status-badge", 64);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const pick_r9 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(pick_r9.event || "Event unknown");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", pick_r9.competition || "Competition unknown", " \u00B7 ", ctx_r0.compactDate(pick_r9.kickoff));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", pick_r9.market || "Market unknown", " \u00B7 ", pick_r9.pick || "Pick unknown");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", ctx_r0.formatPercent(pick_r9.confidence_score))("tone", ctx_r0.confidenceTone(pick_r9.confidence_score));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", pick_r9.risk_level || "risk \u2014")("tone", ctx_r0.riskTone(pick_r9.risk_level));
} }
function TicketsPage_Conditional_19_ForEmpty_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵelement(1, "ba-empty-state", 77);
    i0.ɵɵelementEnd();
} }
function TicketsPage_Conditional_19_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-loading-state", 58);
} }
function TicketsPage_Conditional_19_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-log-console", 59);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", ctx_r0.selectedTicketId || "No ticket")("entries", ctx_r0.auditEntries)("highlightNewest", ctx_r0.isGeneratingTicket);
} }
function TicketsPage_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 39);
    i0.ɵɵrepeaterCreate(1, TicketsPage_Conditional_19_For_2_Template, 1, 4, "ba-kpi-card", 40, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "section", 41)(4, "ba-section-card")(5, "div", 42)(6, "div", 43)(7, "p", 14);
    i0.ɵɵtext(8, "Tickets sauvegard\u00E9s");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h3", 44);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(11, "ba-status-badge", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 46);
    i0.ɵɵrepeaterCreate(13, TicketsPage_Conditional_19_For_14_Template, 14, 17, "button", 47, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "ba-section-card")(16, "div", 48)(17, "p", 14);
    i0.ɵɵtext(18, "Selected ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "h3", 15);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 49);
    i0.ɵɵconditionalCreate(22, TicketsPage_Conditional_19_Conditional_22_Template, 1, 0, "ba-loading-state", 50)(23, TicketsPage_Conditional_19_Conditional_23_Template, 33, 11, "div", 31)(24, TicketsPage_Conditional_19_Conditional_24_Template, 1, 0, "ba-empty-state", 51);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "section", 10)(26, "ba-section-card")(27, "div", 52)(28, "div")(29, "p", 14);
    i0.ɵɵtext(30, "Ticket proposals");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "h3", 15);
    i0.ɵɵtext(32, "R\u00E9sum\u00E9 compact des s\u00E9lections");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(33, "ba-status-badge", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 53);
    i0.ɵɵrepeaterCreate(35, TicketsPage_Conditional_19_For_36_Template, 15, 11, "button", 54, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "section", 55)(38, "ba-section-card")(39, "div", 48)(40, "p", 14);
    i0.ɵɵtext(41, "Selected picks");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "h3", 15);
    i0.ɵɵtext(43, "Clique un pick pour ouvrir son d\u00E9tail");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div", 56);
    i0.ɵɵrepeaterCreate(45, TicketsPage_Conditional_19_For_46_Template, 12, 9, "button", 57, _forTrack2, false, TicketsPage_Conditional_19_ForEmpty_47_Template, 2, 0, "div", 49);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(48, "ba-section-card")(49, "div", 48)(50, "p", 14);
    i0.ɵɵtext(51, "Audit log");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "h3", 15);
    i0.ɵɵtext(53, "Notes, errors and metadata");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(54, "div", 49);
    i0.ɵɵconditionalCreate(55, TicketsPage_Conditional_19_Conditional_55_Template, 1, 0, "ba-loading-state", 58)(56, TicketsPage_Conditional_19_Conditional_56_Template, 1, 3, "ba-log-console", 59);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1("", ctx_r0.tickets.length, " tickets disponibles");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.tickets);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate((ctx_r0.selectedTicket == null ? null : ctx_r0.selectedTicket.ticket_id) || "No ticket selected");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.isDetailLoading ? 22 : ctx_r0.selectedTicket ? 23 : 24);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("label", ctx_r0.tickets.length + " proposals");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.tickets);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater((ctx_r0.selectedTicket == null ? null : ctx_r0.selectedTicket.picks) || i0.ɵɵpureFunction0(6, _c1));
    i0.ɵɵadvance(10);
    i0.ɵɵconditional(ctx_r0.isAuditLoading ? 55 : 56);
} }
function TicketsPage_Conditional_20_Conditional_13_For_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 88);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const factor_r11 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(factor_r11);
} }
function TicketsPage_Conditional_20_Conditional_13_ForEmpty_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 91);
    i0.ɵɵtext(1, "No key factors returned.");
    i0.ɵɵelementEnd();
} }
function TicketsPage_Conditional_20_Conditional_13_For_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 88);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const risk_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(risk_r12);
} }
function TicketsPage_Conditional_20_Conditional_13_ForEmpty_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 91);
    i0.ɵɵtext(1, "No explicit risks returned.");
    i0.ɵɵelementEnd();
} }
function TicketsPage_Conditional_20_Conditional_13_For_75_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 104);
} }
function TicketsPage_Conditional_20_Conditional_13_For_75_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 100)(1, "div", 101)(2, "div", 43)(3, "p", 102);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 103);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 89);
    i0.ɵɵconditionalCreate(8, TicketsPage_Conditional_20_Conditional_13_For_75_Conditional_8_Template, 1, 0, "ba-status-badge", 104);
    i0.ɵɵelement(9, "ba-status-badge", 64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "p", 105);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const market_r13 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border-accent/60", ctx_r0.isSelectedPredictedMarket(ctx_r0.selectedPickForModal, market_r13.marketCanonicalId, market_r13.selectionCanonicalId))("bg-accent/5", ctx_r0.isSelectedPredictedMarket(ctx_r0.selectedPickForModal, market_r13.marketCanonicalId, market_r13.selectionCanonicalId))("border-border/60", !ctx_r0.isSelectedPredictedMarket(ctx_r0.selectedPickForModal, market_r13.marketCanonicalId, market_r13.selectionCanonicalId))("bg-surface-low", !ctx_r0.isSelectedPredictedMarket(ctx_r0.selectedPickForModal, market_r13.marketCanonicalId, market_r13.selectionCanonicalId));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(market_r13.marketCanonicalId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(market_r13.selectionCanonicalId);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.isSelectedPredictedMarket(ctx_r0.selectedPickForModal, market_r13.marketCanonicalId, market_r13.selectionCanonicalId) ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", market_r13.confidenceLabel)("tone", ctx_r0.confidenceTone(market_r13.confidence));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(market_r13.reason);
} }
function TicketsPage_Conditional_20_Conditional_13_ForEmpty_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 96);
    i0.ɵɵtext(1, "No predicted market returned for this match.");
    i0.ɵɵelementEnd();
} }
function TicketsPage_Conditional_20_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 67)(1, "div", 43)(2, "p", 14);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h4", 84);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 69);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 17);
    i0.ɵɵelement(9, "ba-status-badge", 64)(10, "ba-status-badge", 64)(11, "ba-status-badge", 64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 85)(13, "div", 31)(14, "p", 14);
    i0.ɵɵtext(15, "Event");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "p", 32);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 31)(19, "p", 14);
    i0.ɵɵtext(20, "Competition");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "p", 32);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 31)(24, "p", 14);
    i0.ɵɵtext(25, "Kickoff");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "p", 32);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(28, "div", 86)(29, "div", 75)(30, "div")(31, "p", 14);
    i0.ɵɵtext(32, "Selected pick");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "p", 87);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "p", 88);
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 89);
    i0.ɵɵelement(38, "ba-status-badge", 64)(39, "ba-status-badge", 64)(40, "ba-status-badge", 18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(41, "div", 31)(42, "p", 14);
    i0.ɵɵtext(43, "Analysis summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "p", 88);
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "div", 90)(47, "div", 31)(48, "p", 14);
    i0.ɵɵtext(49, "Key factors");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(50, TicketsPage_Conditional_20_Conditional_13_For_51_Template, 2, 1, "p", 88, _forTrack3, false, TicketsPage_Conditional_20_Conditional_13_ForEmpty_52_Template, 2, 0, "p", 91);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "div", 31)(54, "p", 14);
    i0.ɵɵtext(55, "Risks");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(56, TicketsPage_Conditional_20_Conditional_13_For_57_Template, 2, 1, "p", 88, _forTrack3, false, TicketsPage_Conditional_20_Conditional_13_ForEmpty_58_Template, 2, 0, "p", 91);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(59, "div", 92)(60, "div", 31)(61, "p", 14);
    i0.ɵɵtext(62, "Global confidence");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "div", 93);
    i0.ɵɵelement(64, "ba-status-badge", 64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "div", 31)(66, "p", 14);
    i0.ɵɵtext(67, "Data quality");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "div", 93);
    i0.ɵɵelement(69, "ba-status-badge", 64);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(70, "div", 31)(71, "p", 14);
    i0.ɵɵtext(72, "Tous les predicted markets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "div", 94);
    i0.ɵɵrepeaterCreate(74, TicketsPage_Conditional_20_Conditional_13_For_75_Template, 12, 14, "article", 95, _forTrack4, false, TicketsPage_Conditional_20_Conditional_13_ForEmpty_76_Template, 2, 0, "p", 96);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(77, "div", 31)(78, "p", 14);
    i0.ɵɵtext(79, "Evidence summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(80, "div", 97)(81, "p");
    i0.ɵɵtext(82, "Market IDs: ");
    i0.ɵɵelementStart(83, "span", 98);
    i0.ɵɵtext(84);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(85, "p");
    i0.ɵɵtext(86, "Source analysis: ");
    i0.ɵɵelementStart(87, "span", 99);
    i0.ɵɵtext(88);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(89, "p");
    i0.ɵɵtext(90, "Evidence confidence: ");
    i0.ɵɵelementStart(91, "span", 99);
    i0.ɵɵtext(92);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(93, "p");
    i0.ɵɵtext(94, "Data quality: ");
    i0.ɵɵelementStart(95, "span", 99);
    i0.ɵɵtext(96);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(97, "p");
    i0.ɵɵtext(98, "Odds source: ");
    i0.ɵɵelementStart(99, "span", 99);
    i0.ɵɵtext(100);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(101, "p");
    i0.ɵɵtext(102, "Expected odds: ");
    i0.ɵɵelementStart(103, "span", 99);
    i0.ɵɵtext(104);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const matchAnalysis_r14 = ctx;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.competition);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.event);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.kickoffDisplay);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", matchAnalysis_r14.confidenceTier)("tone", ctx_r0.confidenceTierTone(matchAnalysis_r14.confidenceTier));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", matchAnalysis_r14.globalConfidenceLabel)("tone", ctx_r0.confidenceTone(matchAnalysis_r14.globalConfidence));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", matchAnalysis_r14.dataQuality)("tone", ctx_r0.qualityTone(matchAnalysis_r14.dataQuality));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.event);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.competition);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.kickoffDisplay);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate2("", ctx_r0.selectedPickForModal.market || "Market unknown", " \u00B7 ", ctx_r0.selectedPickForModal.pick || "Pick unknown");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.selectedPickForModal.reason || "No reason provided in selection.json.");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("label", ctx_r0.formatPercent(ctx_r0.selectedPickForModal.confidence_score))("tone", ctx_r0.confidenceTone(ctx_r0.selectedPickForModal.confidence_score));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.selectedPickForModal.risk_level || "risk unknown")("tone", ctx_r0.riskTone(ctx_r0.selectedPickForModal.risk_level));
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.pickOdds(ctx_r0.selectedPickForModal.expected_odds_min, ctx_r0.selectedPickForModal.expected_odds_max));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(matchAnalysis_r14.summary);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(matchAnalysis_r14.keyFactors);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(matchAnalysis_r14.risks);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("label", matchAnalysis_r14.globalConfidenceLabel)("tone", ctx_r0.confidenceTone(matchAnalysis_r14.globalConfidence));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("label", matchAnalysis_r14.dataQuality)("tone", ctx_r0.qualityTone(matchAnalysis_r14.dataQuality));
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(matchAnalysis_r14.predictedMarkets);
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate2("", ctx_r0.selectedPickForModal.market_canonical_id || "\u2014", " \u00B7 ", ctx_r0.selectedPickForModal.selection_canonical_id || "\u2014");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.selectedPickForModal.source_match_analysis_id || matchAnalysis_r14.sourceId || "\u2014");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.formatPercent(ctx_r0.evidenceNumber(ctx_r0.selectedPickForModal.evidence_summary, "global_confidence")));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.evidenceText(ctx_r0.selectedPickForModal.evidence_summary, "data_quality"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.evidenceText(ctx_r0.selectedPickForModal.evidence_summary, "odds_source"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.pickOdds(ctx_r0.evidenceNumber(ctx_r0.selectedPickForModal.evidence_summary, "expected_odds_min"), ctx_r0.evidenceNumber(ctx_r0.selectedPickForModal.evidence_summary, "expected_odds_max")));
} }
function TicketsPage_Conditional_20_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 83);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("message", ctx_r0.selectedTicketOutputsError || "No matching match_analysis entry was found for this pick in the ticket run outputs.");
} }
function TicketsPage_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 78);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_20_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closePickModal()); });
    i0.ɵɵelementStart(1, "section", 79);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_20_Template_section_click_1_listener($event) { i0.ɵɵrestoreView(_r10); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 80)(3, "div", 43)(4, "p", 14);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "h3", 68);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 69);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 81);
    i0.ɵɵlistener("click", function TicketsPage_Conditional_20_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r10); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closePickModal()); });
    i0.ɵɵtext(11, "Close");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 82);
    i0.ɵɵconditionalCreate(13, TicketsPage_Conditional_20_Conditional_13_Template, 105, 35)(14, TicketsPage_Conditional_20_Conditional_14_Template, 1, 1, "ba-empty-state", 83);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r0.selectedPickForModal.competition || "Competition unknown", " \u00B7 ", ctx_r0.compactDate(ctx_r0.selectedPickForModal.kickoff));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.selectedPickForModal.event || "Event unknown");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r0.selectedPickForModal.market || "Market unknown", " \u00B7 ", ctx_r0.selectedPickForModal.pick || "Pick unknown");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional((tmp_4_0 = ctx_r0.selectedPickMatchAnalysis) ? 13 : 14, tmp_4_0);
} }
export class TicketsPage {
    constructor() {
        this.ticketApi = inject(TicketApiService);
        this.analysisApi = inject(AnalysisApiService);
        this.route = inject(ActivatedRoute);
        this.generationPollId = null;
        this.generationPollInFlight = false;
        this.generationStartedAt = 0;
        this.generationTimeoutMs = 10 * 60 * 1000;
        this.requestedTicketId = '';
        this.tickets = [];
        this.selectedTicketId = '';
        this.selectedTicket = null;
        this.selectedTicketRunOutputs = null;
        this.selectedTicketOutputsError = '';
        this.auditLog = null;
        this.targetDate = this.today();
        this.isLoading = true;
        this.isDetailLoading = false;
        this.isAuditLoading = false;
        this.isGeneratingTicket = false;
        this.isGenerationPolling = false;
        this.generatedRunId = '';
        this.generatedOrchestratorRunId = '';
        this.generationStatus = '';
        this.generationTargetDate = '';
        this.generationError = '';
        this.generationMessage = '';
        this.generationOutcome = 'idle';
        this.ticketGenerationLastUpdatedAt = '';
        this.selectedPickForModal = null;
        this.error = '';
        this.stateBadges = [
            { label: 'idle', tone: 'default' },
            { label: 'pending', tone: 'warning' },
            { label: 'running', tone: 'live' },
            { label: 'completed', tone: 'success' },
            { label: 'completed_no_data', tone: 'default' },
            { label: 'failed', tone: 'danger' },
            { label: 'partial', tone: 'warning' },
            { label: 'proxy', tone: 'warning' },
            { label: 'estimated', tone: 'warning' },
            { label: 'unavailable', tone: 'default' }
        ];
    }
    ngOnInit() {
        this.requestedTicketId = this.route.snapshot.queryParamMap.get('ticket_id') || '';
        this.refreshTickets();
    }
    ngOnDestroy() {
        this.stopGenerationPolling();
    }
    refreshTickets() {
        this.loadTickets(true);
    }
    loadTickets(showLoading) {
        this.isLoading = showLoading;
        this.error = '';
        this.ticketApi.getTickets().subscribe({
            next: (tickets) => {
                this.tickets = tickets;
                this.isLoading = false;
                const requestedTicket = this.requestedTicketId
                    ? tickets.find((ticket) => ticket.ticket_id === this.requestedTicketId)
                    : undefined;
                if (requestedTicket) {
                    this.requestedTicketId = '';
                    this.selectTicket(requestedTicket.ticket_id);
                }
                else if (tickets.length && !this.selectedTicketId) {
                    this.selectTicket(tickets[0].ticket_id);
                }
                else if (this.selectedTicketId && tickets.some((ticket) => ticket.ticket_id === this.selectedTicketId)) {
                    this.selectTicket(this.selectedTicketId);
                }
            },
            error: (error) => {
                this.error = this.errorMessage(error);
                this.isLoading = false;
            }
        });
    }
    selectTicket(ticketId) {
        this.selectedTicketId = ticketId;
        this.isDetailLoading = true;
        this.isAuditLoading = true;
        this.selectedTicketRunOutputs = null;
        this.selectedTicketOutputsError = '';
        const runId = this.tickets.find((ticket) => ticket.ticket_id === ticketId)?.run_id || '';
        forkJoin({
            ticket: this.ticketApi.getTicket(ticketId),
            auditLog: this.ticketApi.getAuditLog(ticketId),
            outputs: runId
                ? this.analysisApi.getRunOutputs(runId).pipe(catchError((error) => {
                    this.selectedTicketOutputsError = this.errorMessage(error);
                    return of(null);
                }))
                : of(null)
        }).subscribe({
            next: ({ ticket, auditLog, outputs }) => {
                this.selectedTicket = ticket;
                this.auditLog = auditLog;
                this.selectedTicketRunOutputs = outputs;
                if (this.selectedPickForModal && !ticket.picks.some((pick) => pick.pick_id === this.selectedPickForModal?.pick_id)) {
                    this.selectedPickForModal = null;
                }
                this.isDetailLoading = false;
                this.isAuditLoading = false;
            },
            error: (error) => {
                this.error = this.errorMessage(error);
                this.isDetailLoading = false;
                this.isAuditLoading = false;
            }
        });
    }
    generateTicket() {
        if (this.isGeneratingTicket) {
            return;
        }
        this.stopGenerationPolling();
        this.isGeneratingTicket = true;
        this.isGenerationPolling = false;
        this.generatedRunId = '';
        this.generatedOrchestratorRunId = '';
        this.generationStatus = 'starting';
        this.generationTargetDate = this.targetDate;
        this.generationError = '';
        this.generationMessage = 'Generating ticket...';
        this.generationOutcome = 'idle';
        this.ticketGenerationLastUpdatedAt = this.nowLabel();
        this.ticketApi.generateTicket({ date: this.targetDate }).subscribe({
            next: (response) => {
                this.generatedRunId = response.job_id;
                this.generationTargetDate = response.target_date;
                this.generationStatus = response.status;
                this.generationMessage = 'Generating ticket...';
                this.generationStartedAt = Date.now();
                this.ticketGenerationLastUpdatedAt = this.nowLabel();
                this.startGenerationPolling(response.job_id);
                this.pollGenerationOnce();
            },
            error: (error) => {
                this.isGeneratingTicket = false;
                this.generationStatus = 'error';
                this.generationError = this.errorMessage(error);
                this.generationMessage = 'Ticket generation failed to start';
                this.generationOutcome = 'failed';
                this.ticketGenerationLastUpdatedAt = this.nowLabel();
            }
        });
    }
    startGenerationPolling(runId) {
        this.stopGenerationPolling();
        this.generatedRunId = runId;
        this.isGenerationPolling = true;
        this.generationPollId = setInterval(() => this.pollGenerationOnce(), 3000);
    }
    pollGenerationOnce() {
        if (!this.generatedRunId) {
            return;
        }
        if (this.generationPollInFlight) {
            return;
        }
        if (Date.now() - this.generationStartedAt > this.generationTimeoutMs) {
            this.isGeneratingTicket = false;
            this.generationStatus = 'timeout';
            this.generationError = 'Ticket generation timed out after 10 minutes. The run may still finish server-side; refresh tickets later.';
            this.generationMessage = 'Ticket generation timed out';
            this.generationOutcome = 'failed';
            this.ticketGenerationLastUpdatedAt = this.nowLabel();
            this.stopGenerationPolling();
            return;
        }
        this.generationPollInFlight = true;
        forkJoin({
            run: this.analysisApi.getRun(this.generatedRunId),
            tickets: this.ticketApi.getTickets()
        }).subscribe({
            next: ({ run, tickets }) => {
                this.generationPollInFlight = false;
                this.tickets = tickets;
                this.generationStatus = run.status;
                this.generatedOrchestratorRunId = run.orchestrator_run_id || this.extractRunId(run) || this.generatedOrchestratorRunId;
                this.ticketGenerationLastUpdatedAt = this.nowLabel();
                const generatedTicket = this.findGeneratedTicket(tickets, run);
                if (generatedTicket && generatedTicket.picks_count > 0) {
                    this.generationMessage = 'Ticket generated successfully';
                    this.generationOutcome = 'ticket_ready';
                    this.isGeneratingTicket = false;
                    this.stopGenerationPolling();
                    this.selectTicket(generatedTicket.ticket_id);
                    return;
                }
                if (this.isTerminalStatus(run.status)) {
                    this.isGeneratingTicket = false;
                    this.generationMessage = 'Run completed but no ticket was generated';
                    this.generationOutcome = this.isFailureStatus(run.status) ? 'failed' : 'no_ticket';
                    if (generatedTicket) {
                        this.selectTicket(generatedTicket.ticket_id);
                    }
                    if (this.isFailureStatus(run.status)) {
                        this.generationError = run.error || 'Run finished with an error before a ticket artifact appeared.';
                    }
                    this.stopGenerationPolling();
                    return;
                }
                this.generationMessage = 'Generating ticket...';
            },
            error: (error) => {
                this.generationPollInFlight = false;
                this.isGeneratingTicket = false;
                this.generationStatus = 'error';
                this.generationError = this.errorMessage(error);
                this.generationMessage = 'Ticket generation polling failed';
                this.generationOutcome = 'failed';
                this.ticketGenerationLastUpdatedAt = this.nowLabel();
                this.stopGenerationPolling();
            }
        });
    }
    stopGenerationPolling() {
        if (this.generationPollId) {
            clearInterval(this.generationPollId);
            this.generationPollId = null;
        }
        this.generationPollInFlight = false;
        this.isGenerationPolling = false;
    }
    findGeneratedTicket(tickets, run) {
        const orchestratorRunId = run.orchestrator_run_id || this.extractRunId(run);
        if (!orchestratorRunId) {
            return undefined;
        }
        return tickets.find((ticket) => ticket.run_id === orchestratorRunId);
    }
    extractRunId(run) {
        const summary = run.run_summary;
        if (summary && typeof summary === 'object' && 'run_id' in summary) {
            return String(summary.run_id || '');
        }
        return '';
    }
    isTerminalStatus(status) {
        return ['completed', 'done', 'failed', 'error', 'skipped', 'completed_no_data'].includes(String(status).toLowerCase());
    }
    isFailureStatus(status) {
        return ['failed', 'error'].includes(String(status).toLowerCase());
    }
    get showViewRunLink() {
        return Boolean(this.generatedRunId && (this.isGeneratingTicket || this.isFailureStatus(this.generationStatus) || this.generationError || this.generationOutcome === 'no_ticket'));
    }
    get isGenerationLive() {
        return this.isGeneratingTicket || ['starting', 'pending', 'running', 'active'].includes(String(this.generationStatus || '').toLowerCase());
    }
    get isGenerationSuccess() {
        return this.generationOutcome === 'ticket_ready';
    }
    get isGenerationFailed() {
        return Boolean(this.generationError) || this.generationOutcome === 'failed' || this.isFailureStatus(this.generationStatus);
    }
    get isGenerationNoTicket() {
        return this.generationOutcome === 'no_ticket';
    }
    get generationTone() {
        if (this.isGenerationSuccess) {
            return 'success';
        }
        if (this.isGenerationFailed) {
            return 'danger';
        }
        if (this.isGenerationLive) {
            return 'live';
        }
        if (this.isGenerationNoTicket) {
            return 'warning';
        }
        return this.toneFor(this.generationStatus);
    }
    get generationProgress() {
        if (this.isGenerationSuccess || this.isGenerationFailed || this.isGenerationNoTicket) {
            return 100;
        }
        if (this.isGenerationLive) {
            return this.generatedOrchestratorRunId ? 68 : this.generatedRunId ? 38 : 16;
        }
        return this.generationStatus ? 24 : 0;
    }
    get generationDetail() {
        if (this.isGenerationSuccess) {
            return 'The ticket artifact is ready and selected below.';
        }
        if (this.isGenerationFailed) {
            return 'The generation job stopped before a usable ticket was available.';
        }
        if (this.isGenerationNoTicket) {
            return 'The run is visible for inspection, but no ticket card should be shown for this attempt.';
        }
        if (this.isGenerationLive) {
            return 'Auto-refresh is on. BetAuto is polling the run until a ticket artifact appears or the job settles.';
        }
        return 'Generation status will appear here after a ticket request is started.';
    }
    get generationPipClass() {
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
        return map[this.generationTone];
    }
    get kpis() {
        const bestOdds = Math.max(...this.tickets.map((ticket) => ticket.estimated_combo_odds || 0));
        const avgConfidence = this.average(this.tickets.map((ticket) => ticket.global_confidence_score || 0));
        const validRange = this.tickets.filter((ticket) => ticket.combo_in_target_range).length;
        const withErrors = this.tickets.filter((ticket) => ticket.errors_count > 0).length;
        return [
            { label: 'Tickets proposed', value: String(this.tickets.length), status: 'Artifacts', tone: 'success' },
            { label: 'In target range', value: String(validRange), status: 'Strategy', tone: validRange ? 'success' : 'warning' },
            { label: 'Avg confidence', value: this.formatPercent(avgConfidence), status: 'Selection', tone: 'success' },
            { label: 'Best estimated odds', value: this.formatOdds(bestOdds), status: 'Combo', tone: bestOdds ? 'success' : 'default' },
            { label: 'Errors', value: String(withErrors), status: 'Audit', tone: withErrors ? 'danger' : 'success' },
            { label: 'Selected risk', value: this.selectedTicket?.combo_risk_level || '—', status: 'Current', tone: this.riskTone(this.selectedTicket?.combo_risk_level) }
        ];
    }
    get auditEntries() {
        return (this.auditLog?.entries || []).map((entry, index) => ({
            time: String(index + 1).padStart(2, '0'),
            level: this.logLevel(entry.level),
            message: entry.message
        }));
    }
    get selectedPickMatchAnalysis() {
        return this.matchAnalysisForPick(this.selectedPickForModal);
    }
    openPickModal(pick) {
        this.selectedPickForModal = pick;
    }
    closePickModal() {
        this.selectedPickForModal = null;
    }
    toneFor(status) {
        return statusToTone(status || '');
    }
    riskTone(risk) {
        const normalized = String(risk || '').toLowerCase();
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
    formatOdds(value) {
        return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
    }
    formatPercent(value) {
        return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}%` : '—';
    }
    pickOdds(min, max) {
        if (typeof min === 'number' && typeof max === 'number') {
            return `${min.toFixed(2)} - ${max.toFixed(2)}`;
        }
        return this.formatOdds(min || max);
    }
    compactDate(value) {
        if (!value) {
            return 'Kickoff unknown';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
    shortId(value) {
        const text = String(value || '');
        if (text.length <= 28) {
            return text || '—';
        }
        return `${text.slice(0, 14)}…${text.slice(-10)}`;
    }
    targetRangeSummary(ticket) {
        const range = ticket.combo_in_target_range ? 'dans la cible de cote' : 'hors cible de cote';
        return `${ticket.picks_count} picks, ${range}.`;
    }
    competitionSummary(competitions) {
        const items = (competitions || []).filter(Boolean);
        if (!items.length) {
            return 'Ligues non disponibles';
        }
        if (items.length <= 2) {
            return items.join(' · ');
        }
        return `${items.slice(0, 2).join(' · ')} +${items.length - 2}`;
    }
    selectionModeLabel(ticket) {
        return this.metadataLabel(ticket, 'selection_mode');
    }
    comboTargetLabel(ticket) {
        const config = ticket.selection_config || {};
        const min = typeof config['combo_min_odds'] === 'number' ? Number(config['combo_min_odds']).toFixed(2) : '—';
        const max = typeof config['combo_max_odds'] === 'number' ? Number(config['combo_max_odds']).toFixed(2) : '—';
        return `${min} - ${max}`;
    }
    metadataLabel(ticket, key) {
        const value = ticket.metadata?.[key];
        return value === null || value === undefined || value === '' ? '—' : String(value);
    }
    evidenceText(source, key) {
        const value = source?.[key];
        return value === null || value === undefined || value === '' ? '—' : String(value);
    }
    evidenceNumber(source, key) {
        const value = source?.[key];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    sourceLabel(mode) {
        if (mode === 'strategy_application') {
            return 'Application stratégie';
        }
        if (mode === 'run_artifacts') {
            return 'Run principal';
        }
        return mode || 'Source inconnue';
    }
    inputValue(event) {
        return event.target.value;
    }
    isSelectedPredictedMarket(pick, marketCanonicalId, selectionCanonicalId) {
        if (!pick) {
            return false;
        }
        const pickMarket = String(pick.market_canonical_id || '');
        const pickSelection = String(pick.selection_canonical_id || '');
        return Boolean(pickMarket
            && pickSelection
            && pickMarket === marketCanonicalId
            && pickSelection === selectionCanonicalId);
    }
    matchAnalysisForPick(pick) {
        if (!pick) {
            return null;
        }
        const rows = this.matchAnalysisRows();
        const sourceId = pick.source_match_analysis_id || (pick.fixture_id ? `fixture_${pick.fixture_id}` : '');
        const bySource = sourceId ? rows.find((row) => row.sourceId === sourceId) : undefined;
        if (bySource) {
            return bySource;
        }
        const byFixture = pick.fixture_id
            ? rows.find((row) => row.fixtureId === pick.fixture_id)
            : undefined;
        if (byFixture) {
            return byFixture;
        }
        const event = String(pick.event || '').toLowerCase();
        const kickoff = String(pick.kickoff || '');
        return rows.find((row) => row.event.toLowerCase() === event && row.kickoff === kickoff) || null;
    }
    matchAnalysisRows() {
        const artifact = this.selectedTicketRunOutputs?.artifacts?.['match_analysis'];
        if (artifact?.status !== 'available') {
            return [];
        }
        return this.arrayFrom(artifact.data, 'results').map((item, index) => {
            const analysis = this.objectValue(item, 'analysis');
            const fixtureId = this.numberOrNull(this.value(analysis, 'fixture_id'));
            const globalConfidence = this.numberValue(analysis, 'global_confidence');
            const sourceId = fixtureId ? `fixture_${fixtureId}` : String(this.value(analysis, 'id') || index);
            return {
                id: sourceId,
                fixtureId,
                sourceId,
                event: this.text(analysis, 'event'),
                competition: this.text(analysis, 'competition'),
                kickoff: this.text(analysis, 'kickoff'),
                kickoffDisplay: this.formatKickoffLong(this.text(analysis, 'kickoff')),
                summary: this.text(analysis, 'analysis_summary'),
                keyFactors: this.arrayFrom(analysis, 'key_factors').map((factor) => String(factor)),
                risks: this.arrayFrom(analysis, 'risks').map((risk) => String(risk)),
                globalConfidence,
                globalConfidenceLabel: `${this.formatPercent(globalConfidence)} confidence`,
                dataQuality: this.text(analysis, 'data_quality'),
                confidenceTier: this.matchConfidenceTier(globalConfidence),
                predictedMarkets: this.arrayFrom(analysis, 'predicted_markets').map((market) => {
                    const confidence = this.numberValue(market, 'confidence');
                    return {
                        marketCanonicalId: this.text(market, 'market_canonical_id'),
                        selectionCanonicalId: this.text(market, 'selection_canonical_id'),
                        confidence,
                        confidenceLabel: this.formatPercent(confidence),
                        reason: this.text(market, 'reason')
                    };
                })
            };
        });
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
        return this.objectOrEmpty(this.value(source, key));
    }
    objectOrEmpty(source) {
        return source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    }
    value(source, key) {
        return this.objectOrEmpty(source)[key];
    }
    numberValue(source, key) {
        return this.numberOrNull(this.value(source, key)) ?? 0;
    }
    numberOrNull(value) {
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    text(source, key) {
        const value = this.value(source, key);
        return value === null || value === undefined || value === '' ? '—' : String(value);
    }
    formatKickoffLong(value) {
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
    today() {
        return new Date().toISOString().slice(0, 10);
    }
    nowLabel() {
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date());
    }
    average(values) {
        const usable = values.filter((value) => Number.isFinite(value) && value > 0);
        if (!usable.length) {
            return 0;
        }
        return usable.reduce((total, value) => total + value, 0) / usable.length;
    }
    logLevel(level) {
        if (level === 'error' || level === 'danger') {
            return 'danger';
        }
        if (level === 'warning') {
            return 'warning';
        }
        if (level === 'success') {
            return 'success';
        }
        return 'info';
    }
    errorMessage(error) {
        if (error && typeof error === 'object' && 'message' in error) {
            return String(error.message || 'Unexpected ticketing error.');
        }
        return 'Unexpected ticketing error.';
    }
    static { this.ɵfac = function TicketsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketsPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TicketsPage, selectors: [["ba-tickets-page"]], decls: 21, vars: 8, consts: [["eyebrow", "AI Betting Tickets", "title", "Ticket Proposals", "subtitle", "Propositions de tickets g\u00E9n\u00E9r\u00E9es par l\u2019IA selon la strat\u00E9gie active."], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["type", "date", "aria-label", "Target date", 1, "h-10", "w-[9.75rem]", "rounded-card", "border", "border-border", "bg-surface-low", "px-3", "text-sm", "text-text", "outline-none", "transition", "focus:border-accent", "focus:ring-2", "focus:ring-accent/20", 3, "input", "value"], [1, "flex", "flex-col"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", "disabled:cursor-not-allowed", "disabled:border-accent/30", "disabled:bg-accent/20", "disabled:text-accent", 3, "click", "disabled", "title"], [1, "mt-1", "text-[11px]", "text-muted"], ["type", "button", 1, "ba-tool", 3, "click"], [1, "mb-4", "rounded-card", "border", "border-border/60", "bg-surface-low", "p-3"], [1, "ba-label", "mr-2"], [3, "label", "tone", "showPip", "pulse"], [1, "mt-4"], [1, "mt-4", "rounded-card", "border", "border-border", "bg-surface-low", "p-4"], ["role", "dialog", "aria-modal", "true", 1, "fixed", "inset-0", "z-50", "flex", "items-end", "bg-background/80", "p-3", "backdrop-blur-sm", "sm:items-center", "sm:justify-center", "sm:p-6"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [1, "flex", "flex-wrap", "gap-2"], ["tone", "default", 3, "label"], [3, "label", "tone", "pulse", "showPip"], ["label", "polling every 3s", "tone", "live", 3, "pulse", "showPip"], ["routerLink", "/analysis", 1, "ba-tool", "border-accent/50", "text-accent", "hover:bg-accent/10", 3, "queryParams"], [1, "border-b", "border-border/60", "px-4", "py-3"], [1, "flex", "items-center", "gap-3"], [1, "relative", "flex", "h-3", "w-3", "shrink-0"], [1, "absolute", "inline-flex", "h-full", "w-full", "animate-ping", "rounded-full", "bg-accent", "opacity-30"], [1, "relative", "h-3", "w-3", "rounded-full"], [1, "h-2", "flex-1", "overflow-hidden", "rounded-full", "bg-background"], [1, "h-full", "rounded-full"], [1, "ba-data", "text-muted"], [1, "grid", "gap-3", "p-4", "md:grid-cols-3"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "mt-2", "text-sm", "text-text"], [1, "px-4", "pb-4"], ["label", "Generation issue", 3, "message"], ["label", "Run completed but no ticket was generated", "message", "The orchestration finished, but no usable selection artifact appeared for this target.", "tone", "warning", 3, "meta"], ["message", "Loading tickets from strict run artifacts...", "detail", "Reading selection artifacts without latest_* fallback.", 3, "showShimmer"], ["label", "Ticketing API error", 3, "message"], ["label", "No tickets yet", "message", "Aucun selection.json de run ou d'application de strat\u00E9gie n'a \u00E9t\u00E9 trouv\u00E9 sous data/orchestrator_runs."], [1, "mt-4", "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-3"], [1, "min-w-0"], [1, "mt-1", "truncate", "text-sm", "font-semibold", "text-text"], ["label", "persisted", "tone", "success"], [1, "max-h-[28rem]", "space-y-2", "overflow-y-auto", "p-3"], ["type", "button", 1, "w-full", "rounded-card", "border", "px-3", "py-2", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "border-accent", "bg-accent/10", "border-border", "bg-background"], [1, "ba-card-header"], [1, "p-4"], ["message", "Loading selected ticket..."], ["label", "No selected ticket", "message", "Select a ticket from the artifact list."], [1, "ba-card-header", "flex", "flex-col", "gap-1", "sm:flex-row", "sm:items-center", "sm:justify-between"], [1, "grid", "max-h-[24rem]", "gap-2", "overflow-y-auto", "p-3", "sm:grid-cols-2", "xl:grid-cols-3"], ["type", "button", 1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "border-accent", "bg-accent/10"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.1fr_0.9fr]"], [1, "grid", "gap-2", "p-3"], ["type", "button", 1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50"], ["message", "Loading audit log..."], ["label", "Selection audit", 3, "title", "entries", "highlightNewest"], ["type", "button", 1, "w-full", "rounded-card", "border", "px-3", "py-2", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "click"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "ba-data", "truncate", "text-text"], [1, "mt-1", "truncate", "text-xs", "text-muted"], [3, "label", "tone"], [1, "mt-2", "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-xs", "text-muted"], [1, "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "mt-1", "truncate", "text-base", "font-semibold", "text-text"], [1, "mt-1", "text-sm", "text-muted"], [1, "mt-3", "grid", "gap-2", "sm:grid-cols-2", "lg:grid-cols-4"], [1, "mt-1", "text-sm", "text-text"], ["type", "button", 1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3", "text-left", "transition", "hover:border-accent/60", "hover:bg-surface-high/50", 3, "click"], [1, "truncate", "text-sm", "font-semibold", "text-text"], [1, "mt-3", "flex", "flex-wrap", "gap-2", "text-xs", "text-muted"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:items-start", "sm:justify-between"], [1, "flex", "flex-wrap", "gap-2", "sm:justify-end"], ["label", "No selected picks", "message", "The selected ticket contains no pick."], ["role", "dialog", "aria-modal", "true", 1, "fixed", "inset-0", "z-50", "flex", "items-end", "bg-background/80", "p-3", "backdrop-blur-sm", "sm:items-center", "sm:justify-center", "sm:p-6", 3, "click"], [1, "max-h-[92vh]", "w-full", "overflow-y-auto", "rounded-card", "border", "border-border/80", "bg-surface-low", "shadow-glow", "sm:max-w-5xl", 3, "click"], [1, "sticky", "top-0", "z-10", "flex", "items-start", "justify-between", "gap-4", "border-b", "border-border/60", "bg-surface-low", "px-4", "py-3"], ["type", "button", 1, "ba-tool", "shrink-0", 3, "click"], [1, "grid", "gap-3", "p-4"], ["label", "Match analysis unavailable", "tone", "warning", 3, "message"], [1, "mt-1", "text-base", "font-semibold", "text-text"], [1, "grid", "gap-3", "xl:grid-cols-3"], [1, "rounded-card", "border", "border-accent/30", "bg-accent/5", "p-3"], [1, "mt-2", "text-sm", "font-semibold", "text-text"], [1, "mt-2", "text-sm", "leading-6", "text-text"], [1, "flex", "shrink-0", "flex-wrap", "gap-2"], [1, "grid", "gap-3", "xl:grid-cols-2"], [1, "mt-2", "text-sm", "text-muted"], [1, "grid", "gap-3", "sm:grid-cols-2"], [1, "mt-2"], [1, "mt-3", "grid", "gap-3"], [1, "rounded-card", "border", "p-3", 3, "border-accent/60", "bg-accent/5", "border-border/60", "bg-surface-low"], [1, "text-sm", "text-muted"], [1, "mt-2", "grid", "gap-2", "text-sm", "text-muted", "sm:grid-cols-2"], [1, "break-words", "text-text"], [1, "text-text"], [1, "rounded-card", "border", "p-3"], [1, "flex", "flex-col", "gap-2", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "break-words", "text-sm", "font-medium", "text-text"], [1, "mt-1", "break-words", "text-xs", "text-muted"], ["label", "selected", "tone", "live"], [1, "mt-3", "text-sm", "leading-6", "text-text"]], template: function TicketsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "input", 2);
            i0.ɵɵlistener("input", function TicketsPage_Template_input_input_2_listener($event) { return ctx.targetDate = ctx.inputValue($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "div", 3)(4, "button", 4);
            i0.ɵɵlistener("click", function TicketsPage_Template_button_click_4_listener() { return ctx.generateTicket(); });
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(6, TicketsPage_Conditional_6_Template, 2, 1, "span", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "button", 6);
            i0.ɵɵlistener("click", function TicketsPage_Template_button_click_7_listener() { return ctx.refreshTickets(); });
            i0.ɵɵtext(8, " Refresh ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "section", 7)(10, "div", 1)(11, "span", 8);
            i0.ɵɵtext(12, "State vocabulary");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(13, TicketsPage_For_14_Template, 1, 4, "ba-status-badge", 9, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(15, TicketsPage_Conditional_15_Template, 42, 36, "section", 10);
            i0.ɵɵconditionalCreate(16, TicketsPage_Conditional_16_Template, 2, 1, "section", 11)(17, TicketsPage_Conditional_17_Template, 2, 1, "section", 10)(18, TicketsPage_Conditional_18_Template, 2, 0, "section", 10)(19, TicketsPage_Conditional_19_Template, 57, 7);
            i0.ɵɵconditionalCreate(20, TicketsPage_Conditional_20_Template, 15, 6, "div", 12);
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", ctx.targetDate);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.isGeneratingTicket)("title", ctx.isGeneratingTicket ? "Ticket generation is already running for job " + ctx.generatedRunId : "Generate a ticket for the selected date");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.isGeneratingTicket ? "Generation in progress" : "Generate Ticket", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isGeneratingTicket ? 6 : -1);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.stateBadges);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isGeneratingTicket || ctx.generatedRunId || ctx.generationStatus || ctx.generationError ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading ? 16 : ctx.error ? 17 : !ctx.tickets.length ? 18 : 19);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.selectedPickForModal ? 20 : -1);
        } }, dependencies: [EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            RouterLink,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketsPage, [{
        type: Component,
        args: [{
                selector: 'ba-tickets-page',
                standalone: true,
                imports: [
                    EmptyStateComponent,
                    ErrorStateComponent,
                    KpiCardComponent,
                    LoadingStateComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    RouterLink,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-page-header
      eyebrow="AI Betting Tickets"
      title="Ticket Proposals"
      subtitle="Propositions de tickets générées par l’IA selon la stratégie active."
    >
      <div class="flex flex-wrap items-center gap-2">
        <input
          type="date"
          class="h-10 w-[9.75rem] rounded-card border border-border bg-surface-low px-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          [value]="targetDate"
          (input)="targetDate = inputValue($event)"
          aria-label="Target date"
        />
        <div class="flex flex-col">
          <button
            type="button"
            class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:border-accent/30 disabled:bg-accent/20 disabled:text-accent"
            [disabled]="isGeneratingTicket"
            [title]="isGeneratingTicket ? 'Ticket generation is already running for job ' + generatedRunId : 'Generate a ticket for the selected date'"
            (click)="generateTicket()"
          >
            {{ isGeneratingTicket ? 'Generation in progress' : 'Generate Ticket' }}
          </button>
          @if (isGeneratingTicket) {
            <span class="mt-1 text-[11px] text-muted">Disabled while job {{ generatedRunId || 'is starting' }} runs.</span>
          }
        </div>
        <button type="button" class="ba-tool" (click)="refreshTickets()">
          Refresh
        </button>
      </div>
    </ba-page-header>

    <section class="mb-4 rounded-card border border-border/60 bg-surface-low p-3">
      <div class="flex flex-wrap items-center gap-2">
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

    @if (isGeneratingTicket || generatedRunId || generationStatus || generationError) {
      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="ba-label">Ticket generation</p>
              <h3 class="mt-1 text-sm font-semibold text-text">{{ generationMessage }}</h3>
              <p class="mt-1 text-xs text-muted">{{ generationDetail }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              @if (generatedRunId) {
                <ba-status-badge [label]="'job ' + generatedRunId" tone="default"></ba-status-badge>
              }
              @if (generationStatus) {
                <ba-status-badge
                  [label]="generationStatus"
                  [tone]="generationTone"
                  [pulse]="isGenerationLive"
                  [showPip]="true"
                ></ba-status-badge>
              }
              @if (isGenerationPolling) {
                <ba-status-badge label="polling every 3s" tone="live" [pulse]="true" [showPip]="true"></ba-status-badge>
              }
              @if (showViewRunLink) {
                <a
                  class="ba-tool border-accent/50 text-accent hover:bg-accent/10"
                  routerLink="/analysis"
                  [queryParams]="{ run_id: generatedRunId }"
                >
                  View run
                </a>
              }
            </div>
          </div>
          <div
            class="border-b border-border/60 px-4 py-3"
            [class.bg-accent/5]="isGenerationLive"
            [class.bg-success/5]="isGenerationSuccess"
            [class.bg-danger/5]="isGenerationFailed"
            [class.bg-surface]="!isGenerationLive && !isGenerationSuccess && !isGenerationFailed"
          >
            <div class="flex items-center gap-3">
              <span class="relative flex h-3 w-3 shrink-0">
                @if (isGenerationLive) {
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
                }
                <span class="relative h-3 w-3 rounded-full" [class]="generationPipClass"></span>
              </span>
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-background">
                <div
                  class="h-full rounded-full"
                  [class.bg-accent]="isGenerationLive"
                  [class.bg-success]="isGenerationSuccess"
                  [class.bg-danger]="isGenerationFailed"
                  [class.bg-warning]="isGenerationNoTicket"
                  [class.bg-muted]="!isGenerationLive && !isGenerationSuccess && !isGenerationFailed && !isGenerationNoTicket"
                  [class.animate-pulse]="isGenerationLive"
                  [style.width.%]="generationProgress"
                ></div>
              </div>
              <span class="ba-data text-muted">{{ generationProgress }}%</span>
            </div>
          </div>
          <div class="grid gap-3 p-4 md:grid-cols-3">
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Target date</p>
              <p class="mt-2 text-sm text-text">{{ generationTargetDate || targetDate }}</p>
            </div>
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Orchestrator run</p>
              <p class="mt-2 text-sm text-text">{{ generatedOrchestratorRunId || 'Waiting for run artifact' }}</p>
            </div>
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Last updated</p>
              <p class="mt-2 text-sm text-text">{{ ticketGenerationLastUpdatedAt || '—' }}</p>
            </div>
          </div>
          @if (generationError) {
            <div class="px-4 pb-4">
              <ba-error-state label="Generation issue" [message]="generationError"></ba-error-state>
            </div>
          } @else if (isGenerationNoTicket) {
            <div class="px-4 pb-4">
              <ba-empty-state
                label="Run completed but no ticket was generated"
                message="The orchestration finished, but no usable selection artifact appeared for this target."
                [meta]="generatedRunId ? 'job_id ' + generatedRunId : ''"
                tone="warning"
              ></ba-empty-state>
            </div>
          }
        </ba-section-card>
      </section>
    }

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state
          message="Loading tickets from strict run artifacts..."
          detail="Reading selection artifacts without latest_* fallback."
          [showShimmer]="true"
        ></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Ticketing API error" [message]="error"></ba-error-state>
      </section>
    } @else if (!tickets.length) {
      <section class="mt-4">
        <ba-empty-state
          label="No tickets yet"
          message="Aucun selection.json de run ou d'application de stratégie n'a été trouvé sous data/orchestrator_runs."
        ></ba-empty-state>
      </section>
    } @else {
      <section class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        @for (kpi of kpis; track kpi.label) {
          <ba-kpi-card
            [label]="kpi.label"
            [value]="kpi.value"
            [status]="kpi.status"
            [tone]="kpi.tone"
          ></ba-kpi-card>
        }
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="ba-label">Tickets sauvegardés</p>
              <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ tickets.length }} tickets disponibles</h3>
            </div>
            <ba-status-badge label="persisted" tone="success"></ba-status-badge>
          </div>
          <div class="max-h-[28rem] space-y-2 overflow-y-auto p-3">
            @for (ticket of tickets; track ticket.ticket_id) {
              <button
                type="button"
                class="w-full rounded-card border px-3 py-2 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="ticket.ticket_id === selectedTicketId"
                [class.bg-accent/10]="ticket.ticket_id === selectedTicketId"
                [class.border-border]="ticket.ticket_id !== selectedTicketId"
                [class.bg-background]="ticket.ticket_id !== selectedTicketId"
                (click)="selectTicket(ticket.ticket_id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-data truncate text-text">{{ shortId(ticket.ticket_id) }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ ticket.target_date || 'no date' }} · {{ competitionSummary(ticket.competitions) }}</p>
                  </div>
                  <ba-status-badge [label]="ticket.status" [tone]="toneFor(ticket.status)"></ba-status-badge>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span class="text-xs text-muted">{{ ticket.picks_count }} picks</span>
                  <span class="text-xs text-muted">{{ formatOdds(ticket.estimated_combo_odds) }} odds</span>
                  <ba-status-badge
                    [label]="formatPercent(ticket.global_confidence_score)"
                    [tone]="confidenceTone(ticket.global_confidence_score)"
                  ></ba-status-badge>
                </div>
              </button>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Selected ticket</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ selectedTicket?.ticket_id || 'No ticket selected' }}</h3>
          </div>
          <div class="p-4">
            @if (isDetailLoading) {
              <ba-loading-state message="Loading selected ticket..."></ba-loading-state>
            } @else if (selectedTicket) {
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0">
                    <p class="ba-label">{{ selectedTicket.target_date || 'Target date unknown' }}</p>
                    <h4 class="mt-1 truncate text-base font-semibold text-text">{{ shortId(selectedTicket.ticket_id) }}</h4>
                    <p class="mt-1 text-sm text-muted">{{ competitionSummary(selectedTicket.competitions) }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <ba-status-badge [label]="selectedTicket.status" [tone]="toneFor(selectedTicket.status)"></ba-status-badge>
                    <ba-status-badge [label]="formatPercent(selectedTicket.global_confidence_score)" [tone]="confidenceTone(selectedTicket.global_confidence_score)"></ba-status-badge>
                  </div>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p class="ba-label">Picks</p>
                    <p class="mt-1 text-sm text-text">{{ selectedTicket.picks_count }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Odds</p>
                    <p class="mt-1 text-sm text-text">{{ formatOdds(selectedTicket.estimated_combo_odds) }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Risk</p>
                    <p class="mt-1 text-sm text-text">{{ selectedTicket.combo_risk_level || 'unknown' }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Target</p>
                    <p class="mt-1 text-sm text-text">{{ comboTargetLabel(selectedTicket) }}</p>
                  </div>
                </div>
              </div>
            } @else {
              <ba-empty-state label="No selected ticket" message="Select a ticket from the artifact list."></ba-empty-state>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="ba-label">Ticket proposals</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Résumé compact des sélections</h3>
            </div>
            <ba-status-badge [label]="tickets.length + ' proposals'" tone="default"></ba-status-badge>
          </div>
          <div class="grid max-h-[24rem] gap-2 overflow-y-auto p-3 sm:grid-cols-2 xl:grid-cols-3">
            @for (ticket of tickets; track ticket.ticket_id) {
              <button
                type="button"
                class="rounded-card border border-border/60 bg-background/60 p-3 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="ticket.ticket_id === selectedTicketId"
                [class.bg-accent/10]="ticket.ticket_id === selectedTicketId"
                (click)="selectTicket(ticket.ticket_id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text">{{ ticket.target_date || 'No date' }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ competitionSummary(ticket.competitions) }}</p>
                  </div>
                  <ba-status-badge [label]="formatPercent(ticket.global_confidence_score)" [tone]="confidenceTone(ticket.global_confidence_score)"></ba-status-badge>
                </div>
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span>{{ ticket.picks_count }} picks</span>
                  <span>{{ formatOdds(ticket.estimated_combo_odds) }} odds</span>
                  <span>{{ ticket.combo_risk_level || 'risk —' }}</span>
                </div>
              </button>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Selected picks</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Clique un pick pour ouvrir son détail</h3>
          </div>
          <div class="grid gap-2 p-3">
            @for (pick of selectedTicket?.picks || []; track pick.pick_id || $index) {
              <button
                type="button"
                class="rounded-card border border-border/60 bg-background/60 p-3 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                (click)="openPickModal(pick)"
              >
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text">{{ pick.event || 'Event unknown' }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ pick.competition || 'Competition unknown' }} · {{ compactDate(pick.kickoff) }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ pick.market || 'Market unknown' }} · {{ pick.pick || 'Pick unknown' }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2 sm:justify-end">
                    <ba-status-badge [label]="formatPercent(pick.confidence_score)" [tone]="confidenceTone(pick.confidence_score)"></ba-status-badge>
                    <ba-status-badge [label]="pick.risk_level || 'risk —'" [tone]="riskTone(pick.risk_level)"></ba-status-badge>
                  </div>
                </div>
              </button>
            } @empty {
              <div class="p-4">
                <ba-empty-state label="No selected picks" message="The selected ticket contains no pick."></ba-empty-state>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Audit log</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Notes, errors and metadata</h3>
          </div>
          <div class="p-4">
            @if (isAuditLoading) {
              <ba-loading-state message="Loading audit log..."></ba-loading-state>
            } @else {
              <ba-log-console
                label="Selection audit"
                [title]="selectedTicketId || 'No ticket'"
                [entries]="auditEntries"
                [highlightNewest]="isGeneratingTicket"
              ></ba-log-console>
            }
          </div>
        </ba-section-card>
      </section>
    }

    @if (selectedPickForModal) {
      <div
        class="fixed inset-0 z-50 flex items-end bg-background/80 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
        role="dialog"
        aria-modal="true"
        (click)="closePickModal()"
      >
        <section
          class="max-h-[92vh] w-full overflow-y-auto rounded-card border border-border/80 bg-surface-low shadow-glow sm:max-w-5xl"
          (click)="$event.stopPropagation()"
        >
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border/60 bg-surface-low px-4 py-3">
            <div class="min-w-0">
              <p class="ba-label">{{ selectedPickForModal.competition || 'Competition unknown' }} · {{ compactDate(selectedPickForModal.kickoff) }}</p>
              <h3 class="mt-1 truncate text-base font-semibold text-text">{{ selectedPickForModal.event || 'Event unknown' }}</h3>
              <p class="mt-1 text-sm text-muted">{{ selectedPickForModal.market || 'Market unknown' }} · {{ selectedPickForModal.pick || 'Pick unknown' }}</p>
            </div>
            <button type="button" class="ba-tool shrink-0" (click)="closePickModal()">Close</button>
          </div>

          <div class="grid gap-3 p-4">
            @if (selectedPickMatchAnalysis; as matchAnalysis) {
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0">
                  <p class="ba-label">{{ matchAnalysis.competition }}</p>
                  <h4 class="mt-1 text-base font-semibold text-text">{{ matchAnalysis.event }}</h4>
                  <p class="mt-1 text-sm text-muted">{{ matchAnalysis.kickoffDisplay }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <ba-status-badge [label]="matchAnalysis.confidenceTier" [tone]="confidenceTierTone(matchAnalysis.confidenceTier)"></ba-status-badge>
                  <ba-status-badge [label]="matchAnalysis.globalConfidenceLabel" [tone]="confidenceTone(matchAnalysis.globalConfidence)"></ba-status-badge>
                  <ba-status-badge [label]="matchAnalysis.dataQuality" [tone]="qualityTone(matchAnalysis.dataQuality)"></ba-status-badge>
                </div>
              </div>

              <div class="grid gap-3 xl:grid-cols-3">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Event</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.event }}</p>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Competition</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.competition }}</p>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Kickoff</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.kickoffDisplay }}</p>
                </div>
              </div>

              <div class="rounded-card border border-accent/30 bg-accent/5 p-3">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="ba-label">Selected pick</p>
                    <p class="mt-2 text-sm font-semibold text-text">{{ selectedPickForModal.market || 'Market unknown' }} · {{ selectedPickForModal.pick || 'Pick unknown' }}</p>
                    <p class="mt-2 text-sm leading-6 text-text">{{ selectedPickForModal.reason || 'No reason provided in selection.json.' }}</p>
                  </div>
                  <div class="flex shrink-0 flex-wrap gap-2">
                    <ba-status-badge [label]="formatPercent(selectedPickForModal.confidence_score)" [tone]="confidenceTone(selectedPickForModal.confidence_score)"></ba-status-badge>
                    <ba-status-badge [label]="selectedPickForModal.risk_level || 'risk unknown'" [tone]="riskTone(selectedPickForModal.risk_level)"></ba-status-badge>
                    <ba-status-badge [label]="pickOdds(selectedPickForModal.expected_odds_min, selectedPickForModal.expected_odds_max)" tone="default"></ba-status-badge>
                  </div>
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Analysis summary</p>
                <p class="mt-2 text-sm leading-6 text-text">{{ matchAnalysis.summary }}</p>
              </div>

              <div class="grid gap-3 xl:grid-cols-2">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Key factors</p>
                  @for (factor of matchAnalysis.keyFactors; track factor + $index) {
                    <p class="mt-2 text-sm leading-6 text-text">{{ factor }}</p>
                  } @empty {
                    <p class="mt-2 text-sm text-muted">No key factors returned.</p>
                  }
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Risks</p>
                  @for (risk of matchAnalysis.risks; track risk + $index) {
                    <p class="mt-2 text-sm leading-6 text-text">{{ risk }}</p>
                  } @empty {
                    <p class="mt-2 text-sm text-muted">No explicit risks returned.</p>
                  }
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Global confidence</p>
                  <div class="mt-2">
                    <ba-status-badge [label]="matchAnalysis.globalConfidenceLabel" [tone]="confidenceTone(matchAnalysis.globalConfidence)"></ba-status-badge>
                  </div>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Data quality</p>
                  <div class="mt-2">
                    <ba-status-badge [label]="matchAnalysis.dataQuality" [tone]="qualityTone(matchAnalysis.dataQuality)"></ba-status-badge>
                  </div>
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Tous les predicted markets</p>
                <div class="mt-3 grid gap-3">
                  @for (market of matchAnalysis.predictedMarkets; track market.marketCanonicalId + market.selectionCanonicalId + $index) {
                    <article
                      class="rounded-card border p-3"
                      [class.border-accent/60]="isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.bg-accent/5]="isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.border-border/60]="!isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.bg-surface-low]="!isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                    >
                      <div class="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0">
                          <p class="break-words text-sm font-medium text-text">{{ market.marketCanonicalId }}</p>
                          <p class="mt-1 break-words text-xs text-muted">{{ market.selectionCanonicalId }}</p>
                        </div>
                        <div class="flex shrink-0 flex-wrap gap-2">
                          @if (isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)) {
                            <ba-status-badge label="selected" tone="live"></ba-status-badge>
                          }
                          <ba-status-badge [label]="market.confidenceLabel" [tone]="confidenceTone(market.confidence)"></ba-status-badge>
                        </div>
                      </div>
                      <p class="mt-3 text-sm leading-6 text-text">{{ market.reason }}</p>
                    </article>
                  } @empty {
                    <p class="text-sm text-muted">No predicted market returned for this match.</p>
                  }
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Evidence summary</p>
                <div class="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
                  <p>Market IDs: <span class="break-words text-text">{{ selectedPickForModal.market_canonical_id || '—' }} · {{ selectedPickForModal.selection_canonical_id || '—' }}</span></p>
                  <p>Source analysis: <span class="text-text">{{ selectedPickForModal.source_match_analysis_id || matchAnalysis.sourceId || '—' }}</span></p>
                  <p>Evidence confidence: <span class="text-text">{{ formatPercent(evidenceNumber(selectedPickForModal.evidence_summary, 'global_confidence')) }}</span></p>
                  <p>Data quality: <span class="text-text">{{ evidenceText(selectedPickForModal.evidence_summary, 'data_quality') }}</span></p>
                  <p>Odds source: <span class="text-text">{{ evidenceText(selectedPickForModal.evidence_summary, 'odds_source') }}</span></p>
                  <p>Expected odds: <span class="text-text">{{ pickOdds(evidenceNumber(selectedPickForModal.evidence_summary, 'expected_odds_min'), evidenceNumber(selectedPickForModal.evidence_summary, 'expected_odds_max')) }}</span></p>
                </div>
              </div>
            } @else {
              <ba-empty-state
                label="Match analysis unavailable"
                [message]="selectedTicketOutputsError || 'No matching match_analysis entry was found for this pick in the ticket run outputs.'"
                tone="warning"
              ></ba-empty-state>
            }
          </div>
        </section>
      </div>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TicketsPage, { className: "TicketsPage", filePath: "src/app/features/tickets/tickets.page.ts", lineNumber: 574 }); })();
//# sourceMappingURL=tickets.page.js.map