import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { CoverageApiService } from '../../core/api/coverage-api.service';
import { StrategyApiService } from '../../core/api/strategy-api.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _c0 = a0 => ({ ticket_id: a0 });
const _forTrack0 = ($index, $item) => $item.strategy_file;
const _forTrack1 = ($index, $item) => $item.id;
const _forTrack2 = ($index, $item) => $item.run_id;
const _forTrack3 = ($index, $item) => $item.label;
function _forTrack4($index, $item) { return this.trackLeague($item); }
function StrategyPage_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-loading-state", 12);
} if (rf & 2) {
    i0.ɵɵproperty("showShimmer", true);
} }
function StrategyPage_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 13);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.strategyError);
} }
function StrategyPage_Conditional_20_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const strategy_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", strategy_r3.strategy_file);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", strategy_r3.active ? "\u25CF " : "", "", strategy_r3.name || strategy_r3.strategy_id || strategy_r3.strategy_file, " ");
} }
function StrategyPage_Conditional_20_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 45)(1, "label", 4)(2, "span", 7);
    i0.ɵɵtext(3, "Cote totale min");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 68);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_47_Template_input_input_4_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.targetOddsMin = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "label", 4)(6, "span", 7);
    i0.ɵɵtext(7, "Cote totale max");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 68);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_47_Template_input_input_8_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.targetOddsMax = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.targetOddsMin);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.targetOddsMax);
} }
function StrategyPage_Conditional_20_Conditional_112_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 54);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("label", ctx_r0.selectedRunId);
} }
function StrategyPage_Conditional_20_Conditional_113_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 55);
    i0.ɵɵelement(1, "ba-loading-state", 69);
    i0.ɵɵelementEnd();
} }
function StrategyPage_Conditional_20_Conditional_114_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 21);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.scoredMarketsError);
} }
function StrategyPage_Conditional_20_Conditional_115_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 56);
    i0.ɵɵtext(1, " Aucun march\u00E9 not\u00E9 trouv\u00E9 dans l\u2019analyse s\u00E9lectionn\u00E9e. ");
    i0.ɵɵelementEnd();
} }
function StrategyPage_Conditional_20_Conditional_116_For_2_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 75);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const market_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(market_r6.examples.join(" \u00B7 "));
} }
function StrategyPage_Conditional_20_Conditional_116_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 71)(1, "input", 72);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Conditional_116_For_2_Template_input_change_1_listener($event) { const market_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleAllowedMarket(market_r6.id, $event.target.checked)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 6)(3, "span", 73);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 74);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(7, StrategyPage_Conditional_20_Conditional_116_For_2_Conditional_7_Template, 2, 1, "span", 75);
    i0.ɵɵelementStart(8, "span", 76);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const market_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border-success/50", ctx_r0.isAllowedMarket(market_r6.id))("bg-success/10", ctx_r0.isAllowedMarket(market_r6.id))("border-border/60", !ctx_r0.isAllowedMarket(market_r6.id))("bg-surface-low", !ctx_r0.isAllowedMarket(market_r6.id));
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r0.isAllowedMarket(market_r6.id));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", market_r6.label);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(market_r6.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3(" ", market_r6.count, " candidat(s) not\u00E9(s) \u00B7 moyenne ", market_r6.averageConfidence, " \u00B7 ", market_r6.withOddsCount, " avec cote ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(market_r6.examples.length ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", market_r6.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(market_r6.id);
} }
function StrategyPage_Conditional_20_Conditional_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 57);
    i0.ɵɵrepeaterCreate(1, StrategyPage_Conditional_20_Conditional_116_For_2_Template, 10, 17, "label", 70, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.scoredMarketOptions);
} }
function StrategyPage_Conditional_20_Conditional_117_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 58)(1, "p", 77);
    i0.ɵɵtext(2, "Configur\u00E9s mais non not\u00E9s dans cette analyse :");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 78);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.configuredMarketsOutsideRun.join(", "));
} }
function StrategyPage_Conditional_20_Conditional_131_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 47)(1, "label", 4)(2, "span", 7);
    i0.ɵɵtext(3, "Staking");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Conditional_131_Template_select_change_4_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.stakingMethod = ctx_r0.stakingValue($event)); });
    i0.ɵɵelementStart(5, "option", 79);
    i0.ɵɵtext(6, "Manual");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 80);
    i0.ɵɵtext(8, "Flat");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "option", 81);
    i0.ɵɵtext(10, "Percentage");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "option", 82);
    i0.ɵɵtext(12, "Kelly fractional");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "option", 83);
    i0.ɵɵtext(14, "Cycle rollover");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "label", 4)(16, "span", 7);
    i0.ɵɵtext(17, "Initial stake");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "input", 84);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_18_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.initialStake = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "label", 4)(20, "span", 7);
    i0.ɵɵtext(21, "Target bankroll");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "input", 84);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_22_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.targetBankroll = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "label", 4)(24, "span", 7);
    i0.ɵɵtext(25, "Max steps");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "input", 42);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_26_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.maxCycleSteps = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "div", 47)(28, "label", 4)(29, "span", 7);
    i0.ɵɵtext(30, "Plafond de mise %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_31_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.maxStakePercentPerTicket = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "label", 4)(33, "span", 7);
    i0.ɵɵtext(34, "Daily loss %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_35_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.dailyLossLimitPercent = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "label", 4)(37, "span", 7);
    i0.ɵɵtext(38, "Weekly loss %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_39_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.weeklyLossLimitPercent = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "label", 4)(41, "span", 7);
    i0.ɵɵtext(42, "Loss rule");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "input", 34);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Conditional_131_Template_input_input_43_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.lossRule = ctx_r0.textValue($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(44, "button", 51);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Conditional_131_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.form.resetOnGoal = !ctx_r0.form.resetOnGoal); });
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.stakingMethod);
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("value", ctx_r0.form.initialStake);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.targetBankroll);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.maxCycleSteps);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r0.form.maxStakePercentPerTicket);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.dailyLossLimitPercent);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.weeklyLossLimitPercent);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.lossRule);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-success", ctx_r0.form.resetOnGoal)("text-success", ctx_r0.form.resetOnGoal);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.resetOnGoal ? "Reset \u00E0 l\u2019objectif" : "Pas de reset automatique", " ");
} }
function StrategyPage_Conditional_20_Conditional_132_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const errorItem_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(errorItem_r8);
} }
function StrategyPage_Conditional_20_Conditional_132_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 64);
    i0.ɵɵrepeaterCreate(1, StrategyPage_Conditional_20_Conditional_132_For_2_Template, 2, 1, "p", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.formErrors);
} }
function StrategyPage_Conditional_20_Conditional_133_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 85);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r0.strategyMessageClass);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.strategyMessage);
} }
function StrategyPage_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "label", 31)(2, "span", 7);
    i0.ɵɵtext(3, "Profil de strat\u00E9gie");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_4_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.selectStrategy(($event.target.value || "").toString())); });
    i0.ɵɵrepeaterCreate(5, StrategyPage_Conditional_20_For_6_Template, 2, 3, "option", 33, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "label", 4)(8, "span", 7);
    i0.ɵɵtext(9, "Nom");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "input", 34);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_10_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.name = ctx_r0.textValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "label", 4)(12, "span", 7);
    i0.ɵɵtext(13, "Activation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 35);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.enabled = !ctx_r0.form.enabled); });
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "label", 31)(17, "span", 7);
    i0.ɵɵtext(18, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "textarea", 36);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_textarea_input_19_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.description = ctx_r0.textValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 37)(21, "div", 38)(22, "label", 4)(23, "span", 7);
    i0.ɵɵtext(24, "Type de ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_25_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.preferredTicketType = ctx_r0.ticketTypeValue($event)); });
    i0.ɵɵelementStart(26, "option", 39);
    i0.ɵɵtext(27, "Simple");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "option", 40);
    i0.ɵɵtext(29, "Combin\u00E9");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "option", 41);
    i0.ɵɵtext(31, "Mixte");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(32, "label", 4)(33, "span", 7);
    i0.ɵɵtext(34, "S\u00E9lections min");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "input", 42);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_35_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.minPicks = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "label", 4)(37, "span", 7);
    i0.ɵɵtext(38, "S\u00E9lections max");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "input", 42);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_39_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.maxPicks = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "div", 43)(41, "button", 44);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.allowSingle = !ctx_r0.form.allowSingle); });
    i0.ɵɵtext(42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 44);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_43_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.allowCombo = !ctx_r0.form.allowCombo); });
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "button", 44);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_45_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.targetOddsEnabled = !ctx_r0.form.targetOddsEnabled); });
    i0.ɵɵtext(46);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(47, StrategyPage_Conditional_20_Conditional_47_Template, 9, 2, "div", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "div", 37)(49, "div", 38)(50, "label", 4)(51, "span", 7);
    i0.ɵɵtext(52, "Confiance match");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_53_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.minMatchConfidence = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(54, "label", 4)(55, "span", 7);
    i0.ɵɵtext(56, "Confiance pari");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_57_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.minPickConfidence = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "label", 4)(59, "span", 7);
    i0.ɵɵtext(60, "Confiance ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "input", 46);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_input_input_61_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.minComboConfidence = ctx_r0.numberValue($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(62, "div", 47)(63, "label", 4)(64, "span", 7);
    i0.ɵɵtext(65, "Tol\u00E9rance au risque");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_66_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.riskAppetite = ctx_r0.riskValue($event)); });
    i0.ɵɵelementStart(67, "option", 48);
    i0.ɵɵtext(68, "Faible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "option", 49);
    i0.ɵɵtext(70, "Moyenne");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(71, "option", 50);
    i0.ɵɵtext(72, "\u00C9lev\u00E9e");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(73, "label", 4)(74, "span", 7);
    i0.ɵɵtext(75, "Risque max par pari");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(76, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_76_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.maxPickRisk = ctx_r0.riskValue($event)); });
    i0.ɵɵelementStart(77, "option", 48);
    i0.ɵɵtext(78, "Faible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "option", 49);
    i0.ɵɵtext(80, "Moyen");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "option", 50);
    i0.ɵɵtext(82, "\u00C9lev\u00E9");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(83, "label", 4)(84, "span", 7);
    i0.ɵɵtext(85, "Risque max du ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_86_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.maxComboRisk = ctx_r0.riskValue($event)); });
    i0.ɵɵelementStart(87, "option", 48);
    i0.ɵɵtext(88, "Faible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "option", 49);
    i0.ɵɵtext(90, "Moyen");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "option", 50);
    i0.ɵɵtext(92, "\u00C9lev\u00E9");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(93, "label", 4)(94, "span", 7);
    i0.ɵɵtext(95, "Qualit\u00E9 data min");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(96, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_20_Template_select_change_96_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.minDataQuality = ctx_r0.dataQualityValue($event)); });
    i0.ɵɵelementStart(97, "option", 48);
    i0.ɵɵtext(98, "Faible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(99, "option", 49);
    i0.ɵɵtext(100, "Moyenne");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(101, "option", 50);
    i0.ɵɵtext(102, "Haute");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(103, "button", 51);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_103_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.requireOddsAvailable = !ctx_r0.form.requireOddsAvailable); });
    i0.ɵɵtext(104);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(105, "div", 37)(106, "div", 52)(107, "div", 6)(108, "p", 7);
    i0.ɵɵtext(109, "March\u00E9s not\u00E9s dans l\u2019analyse s\u00E9lectionn\u00E9e");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(110, "p", 53);
    i0.ɵɵtext(111);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(112, StrategyPage_Conditional_20_Conditional_112_Template, 1, 1, "ba-status-badge", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(113, StrategyPage_Conditional_20_Conditional_113_Template, 2, 0, "div", 55)(114, StrategyPage_Conditional_20_Conditional_114_Template, 2, 1, "p", 21)(115, StrategyPage_Conditional_20_Conditional_115_Template, 2, 0, "p", 56)(116, StrategyPage_Conditional_20_Conditional_116_Template, 3, 0, "div", 57);
    i0.ɵɵconditionalCreate(117, StrategyPage_Conditional_20_Conditional_117_Template, 5, 1, "div", 58);
    i0.ɵɵelementStart(118, "details", 59)(119, "summary", 60);
    i0.ɵɵtext(120, " March\u00E9s exclus avanc\u00E9s ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(121, "textarea", 61);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_20_Template_textarea_input_121_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.excludedMarketsText = ctx_r0.textValue($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(122, "div", 37)(123, "div", 62)(124, "div", 6)(125, "p", 7);
    i0.ɵɵtext(126, "Gestion de bankroll");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(127, "p", 63);
    i0.ɵɵtext(128);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(129, "button", 44);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_129_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.form.bankrollEnabled = !ctx_r0.form.bankrollEnabled); });
    i0.ɵɵtext(130);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(131, StrategyPage_Conditional_20_Conditional_131_Template, 46, 13);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(132, StrategyPage_Conditional_20_Conditional_132_Template, 3, 0, "div", 64);
    i0.ɵɵconditionalCreate(133, StrategyPage_Conditional_20_Conditional_133_Template, 2, 3, "p", 65);
    i0.ɵɵelementStart(134, "div", 66)(135, "button", 2);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_135_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.activateSelected()); });
    i0.ɵɵtext(136);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(137, "button", 67);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_137_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveStrategy(false)); });
    i0.ɵɵtext(138);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(139, "button", 2);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_20_Template_button_click_139_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveStrategy(true)); });
    i0.ɵɵtext(140, " Sauvegarder & activer ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.selectedStrategyFile);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.strategies);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r0.form.name);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("border-success", ctx_r0.form.enabled)("text-success", ctx_r0.form.enabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.enabled ? "Activ\u00E9e" : "D\u00E9sactiv\u00E9e", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.description);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("value", ctx_r0.form.preferredTicketType);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("value", ctx_r0.form.minPicks);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.maxPicks);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("border-success", ctx_r0.form.allowSingle)("text-success", ctx_r0.form.allowSingle);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.allowSingle ? "Tickets simples autoris\u00E9s" : "Tickets simples bloqu\u00E9s", " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-success", ctx_r0.form.allowCombo)("text-success", ctx_r0.form.allowCombo);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.allowCombo ? "Combin\u00E9s autoris\u00E9s" : "Combin\u00E9s bloqu\u00E9s", " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-success", ctx_r0.form.targetOddsEnabled)("text-success", ctx_r0.form.targetOddsEnabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.targetOddsEnabled ? "Cible de cote active" : "Cible de cote inactive", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.form.targetOddsEnabled ? 47 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("value", ctx_r0.form.minMatchConfidence);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.minPickConfidence);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.minComboConfidence);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r0.form.riskAppetite);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("value", ctx_r0.form.maxPickRisk);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("value", ctx_r0.form.maxComboRisk);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("value", ctx_r0.form.minDataQuality);
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("border-success", ctx_r0.form.requireOddsAvailable)("text-success", ctx_r0.form.requireOddsAvailable);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.requireOddsAvailable ? "Cote obligatoire" : "Cote optionnelle", " ");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.scoredMarketsSummary);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.selectedRunId ? 112 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.scoredMarketsLoading ? 113 : ctx_r0.scoredMarketsError ? 114 : !ctx_r0.scoredMarketOptions.length ? 115 : 116);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.configuredMarketsOutsideRun.length ? 117 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r0.form.excludedMarketsText);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.form.bankrollEnabled ? ctx_r0.form.stakingMethod : "D\u00E9sactiv\u00E9e");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-success", ctx_r0.form.bankrollEnabled)("text-success", ctx_r0.form.bankrollEnabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.form.bankrollEnabled ? "Activ\u00E9e" : "D\u00E9sactiv\u00E9e", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.form.bankrollEnabled ? 131 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.formErrors.length ? 132 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.strategyMessage ? 133 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r0.canActivate);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.activating ? "Activation..." : "D\u00E9finir active", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r0.canSave);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.saving ? "Sauvegarde..." : "Sauvegarder", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r0.canSave);
} }
function StrategyPage_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-loading-state", 18);
} }
function StrategyPage_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 19);
} }
function StrategyPage_Conditional_33_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r10 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", run_r10.run_id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3("", ctx_r0.shortId(run_r10.run_id), " \u00B7 ", run_r10.target_date || "no date", " \u00B7 ", run_r10.status);
} }
function StrategyPage_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 4)(1, "span", 7);
    i0.ɵɵtext(2, "Analyse sauvegard\u00E9e");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_33_Template_select_change_3_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.selectAnalysisRun(ctx_r0.textValue($event))); });
    i0.ɵɵrepeaterCreate(4, StrategyPage_Conditional_33_For_5_Template, 2, 4, "option", 33, _forTrack2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "label", 86)(7, "span", 7);
    i0.ɵɵtext(8, "Mode d\u2019application");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "select", 32);
    i0.ɵɵlistener("change", function StrategyPage_Conditional_33_Template_select_change_9_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.selectionMode = ctx_r0.selectionModeValue($event)); });
    i0.ɵɵelementStart(10, "option", 87);
    i0.ɵɵtext(11, "Filtrer puis g\u00E9n\u00E9rer un ticket");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "option", 88);
    i0.ɵɵtext(13, "Filtrer uniquement");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "button", 89);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_33_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.applyStrategyToRun()); });
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r0.selectedRunId);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.analysisRuns);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r0.selectionMode);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", !ctx_r0.canApplyStrategy);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.applyingStrategy ? "Application..." : "Appliquer la strat\u00E9gie \u00E0 cette analyse", " ");
} }
function StrategyPage_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20)(1, "div", 90);
    i0.ɵɵelement(2, "span", 91);
    i0.ɵɵelementStart(3, "div")(4, "p", 92);
    i0.ɵɵtext(5, "Application de la strat\u00E9gie en cours");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 17);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.applyingStatusLabel);
} }
function StrategyPage_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 21);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.applicationError);
} }
function StrategyPage_Conditional_36_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 97);
    i0.ɵɵtext(1, " Voir le ticket ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("queryParams", i0.ɵɵpureFunction1(1, _c0, ctx_r0.applicationTicketId));
} }
function StrategyPage_Conditional_36_Conditional_27_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const error_r11 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(error_r11);
} }
function StrategyPage_Conditional_36_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 101);
    i0.ɵɵrepeaterCreate(1, StrategyPage_Conditional_36_Conditional_27_For_2_Template, 2, 1, "p", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.applicationResult.errors);
} }
function StrategyPage_Conditional_36_Conditional_28_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const note_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(note_r12);
} }
function StrategyPage_Conditional_36_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 102);
    i0.ɵɵrepeaterCreate(1, StrategyPage_Conditional_36_Conditional_28_For_2_Template, 2, 1, "p", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.applicationResult.notes);
} }
function StrategyPage_Conditional_36_For_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 106);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const file_r13 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", file_r13.label, " \u00B7 ", file_r13.path);
} }
function StrategyPage_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93)(1, "div", 94)(2, "div", 6)(3, "p", 7);
    i0.ɵɵtext(4, " Application sauvegard\u00E9e ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 95);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 96);
    i0.ɵɵconditionalCreate(8, StrategyPage_Conditional_36_Conditional_8_Template, 2, 3, "a", 97);
    i0.ɵɵelement(9, "ba-status-badge", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 98)(11, "p", 99);
    i0.ɵɵtext(12, "Agr\u00E9g\u00E9s : ");
    i0.ɵɵelementStart(13, "span", 100);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "p", 99);
    i0.ɵɵtext(16, "Retenus : ");
    i0.ɵɵelementStart(17, "span", 100);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "p", 99);
    i0.ɵɵtext(20, "Rejet\u00E9s : ");
    i0.ɵɵelementStart(21, "span", 100);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "p", 99);
    i0.ɵɵtext(24, "Picks : ");
    i0.ɵɵelementStart(25, "span", 100);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()()();
    i0.ɵɵconditionalCreate(27, StrategyPage_Conditional_36_Conditional_27_Template, 3, 0, "div", 101);
    i0.ɵɵconditionalCreate(28, StrategyPage_Conditional_36_Conditional_28_Template, 3, 0, "div", 102);
    i0.ɵɵelementStart(29, "details", 102)(30, "summary", 103);
    i0.ɵɵtext(31, "D\u00E9tails techniques");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "p", 104);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "p", 105);
    i0.ɵɵtext(35, "Fichiers g\u00E9n\u00E9r\u00E9s");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(36, StrategyPage_Conditional_36_For_37_Template, 2, 2, "p", 106, _forTrack3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r0.applicationPanelClass);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-success", ctx_r0.applicationTone === "success")("text-warning", ctx_r0.applicationTone === "warning")("text-danger", ctx_r0.applicationTone === "danger");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", ctx_r0.applicationResult.application_id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.shortId(ctx_r0.applicationResult.application_id));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.applicationResult.picks_count > 0 ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.applicationResult.selection_status || ctx_r0.applicationResult.status)("tone", ctx_r0.applicationTone);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.applicationResult.aggregation_candidate_count);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.applicationResult.filtered_candidate_count);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.applicationResult.rejected_candidate_count);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.applicationResult.picks_count);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.applicationResult.errors.length ? 27 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.applicationResult.notes.length ? 28 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.applicationResult.application_dir);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.applicationFiles);
} }
function StrategyPage_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 107);
    i0.ɵɵelement(2, "ba-loading-state", 108);
    i0.ɵɵelementEnd()();
} }
function StrategyPage_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 28);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.coverageError);
} }
function StrategyPage_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 29);
} }
function StrategyPage_Conditional_71_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r0.coverageSaveMessageClass);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.coverageSaveMessage);
} }
function StrategyPage_Conditional_71_For_15_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 116);
    i0.ɵɵtext(1, "\u00B7 ID API-Football non verifie");
    i0.ɵɵelementEnd();
} }
function StrategyPage_Conditional_71_For_15_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 114)(1, "div", 6)(2, "h4", 115);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 63);
    i0.ɵɵtext(5);
    i0.ɵɵconditionalCreate(6, StrategyPage_Conditional_71_For_15_Conditional_6_Template, 2, 0, "span", 116);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 117);
    i0.ɵɵlistener("click", function StrategyPage_Conditional_71_For_15_Template_button_click_7_listener() { const league_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.setEnabled(league_r16, !league_r16.enabled)); });
    i0.ɵɵelement(8, "span", 118);
    i0.ɵɵelementStart(9, "span", 119);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const league_r16 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", league_r16.competition_name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(league_r16.competition_name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", league_r16.country, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(league_r16.league_id == null ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(league_r16.enabled ? "border-success/40 bg-success/10 text-success hover:border-success/60 hover:bg-success/15" : "border-danger/40 bg-danger/10 text-danger hover:border-danger/60 hover:bg-danger/15");
    i0.ɵɵproperty("disabled", league_r16.league_id == null || ctx_r0.isPending(league_r16))("title", ctx_r0.statusActionTitle(league_r16));
    i0.ɵɵattribute("aria-pressed", league_r16.enabled);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.isPending(league_r16) ? "animate-pulse opacity-70" : "");
    i0.ɵɵattribute("aria-hidden", true);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(league_r16.enabled ? "\u2713" : "\u2715");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(league_r16.enabled ? "Active" : "Inactive");
} }
function StrategyPage_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ba-section-card", 4)(1, "div", 15)(2, "p", 7);
    i0.ɵɵtext(3, "Comp\u00E9titions");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3", 16);
    i0.ɵɵtext(5, "Liste des ligues suivies");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 109)(7, "label", 4)(8, "span", 7);
    i0.ɵɵtext(9, "Rechercher une ligue");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "input", 110);
    i0.ɵɵlistener("input", function StrategyPage_Conditional_71_Template_input_input_10_listener($event) { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onSearch(ctx_r0.textValue($event))); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "div", 111);
    i0.ɵɵconditionalCreate(12, StrategyPage_Conditional_71_Conditional_12_Template, 2, 3, "p", 112);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 113);
    i0.ɵɵrepeaterCreate(14, StrategyPage_Conditional_71_For_15_Template, 13, 14, "article", 114, _forTrack4, true);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("value", ctx_r0.searchTerm);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.coverageSaveMessage ? 12 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.filteredLeagues);
} }
const MARKET_LABELS_FR = {
    match_winner: 'Résultat du match',
    home_away: 'Domicile ou extérieur, sans nul',
    double_chance: 'Double chance',
    draw_no_bet: 'Remboursé si nul',
    both_teams_to_score: 'Les deux équipes marquent',
    goals_over_under: 'Total de buts',
    goals_over_under_first_half: 'Total de buts en 1re mi-temps',
    goals_over_under_second_half: 'Total de buts en 2e mi-temps',
    first_half_winner: 'Résultat 1re mi-temps',
    second_half_winner: 'Résultat 2e mi-temps',
    double_chance_first_half: 'Double chance 1re mi-temps',
    double_chance_second_half: 'Double chance 2e mi-temps',
    both_teams_score_first_half: 'Les deux équipes marquent en 1re mi-temps',
    both_teams_score_second_half: 'Les deux équipes marquent en 2e mi-temps',
    asian_handicap: 'Handicap asiatique',
    asian_handicap_first_half: 'Handicap asiatique 1re mi-temps',
    handicap_result: 'Résultat avec handicap',
    total_home: 'Total de buts équipe domicile',
    total_away: 'Total de buts équipe extérieur',
    team_to_score_first: 'Première équipe à marquer',
    team_to_score_last: 'Dernière équipe à marquer',
    clean_sheet_home: 'Domicile sans encaisser',
    clean_sheet_away: 'Extérieur sans encaisser',
    win_to_nil: 'Gagner sans encaisser',
    win_to_nil_home: 'Domicile gagne sans encaisser',
    win_to_nil_away: 'Extérieur gagne sans encaisser',
    exact_score: 'Score exact',
    correct_score_first_half: 'Score exact 1re mi-temps',
    exact_goals_number: 'Nombre exact de buts',
    odd_even: 'Total de buts pair / impair',
    odd_even_first_half: 'Pair / impair 1re mi-temps',
    ht_ft_double: 'Mi-temps / fin de match',
    result_total_goals: 'Résultat + total de buts',
    result_both_teams_score: 'Résultat + les deux équipes marquent',
    unknown_market: 'Marché inconnu'
};
export class StrategyPage {
    constructor() {
        this.analysisApi = inject(AnalysisApiService);
        this.coverageApi = inject(CoverageApiService);
        this.strategyApi = inject(StrategyApiService);
        this.strategyLoading = true;
        this.coverageLoading = true;
        this.runsLoading = true;
        this.strategyError = '';
        this.coverageError = '';
        this.strategyCatalog = null;
        this.activeStrategy = null;
        this.selectedStrategy = null;
        this.selectedStrategyFile = '';
        this.form = this.emptyForm();
        this.strategyMessage = '';
        this.strategyMessageTone = 'success';
        this.saving = false;
        this.activating = false;
        this.analysisRuns = [];
        this.selectedRunId = '';
        this.selectionMode = 'filter_and_select';
        this.applyingStrategy = false;
        this.applicationResult = null;
        this.applicationError = '';
        this.scoredMarketsLoading = false;
        this.scoredMarketsError = '';
        this.scoredMarketOptions = [];
        this.registry = null;
        this.searchTerm = '';
        this.coverageSaveMessage = '';
        this.coverageSaveMessageTone = 'success';
        this.pendingLeagueIds = new Set();
    }
    ngOnInit() {
        this.reload();
    }
    get strategies() {
        return this.strategyCatalog?.strategies ?? [];
    }
    get canActivate() {
        return Boolean(this.selectedStrategyFile && this.selectedStrategy?.valid && !this.selectedStrategy.active && !this.activating);
    }
    get canSave() {
        return Boolean(this.selectedStrategyFile && !this.saving && !this.formErrors.length);
    }
    get canApplyStrategy() {
        return Boolean(this.selectedRunId && this.selectedStrategyFile && !this.applyingStrategy);
    }
    get applicationTicketId() {
        if (!this.applicationResult?.application_id || !this.applicationResult?.run_id) {
            return '';
        }
        return `ticket_${this.applicationResult.run_id}__app_${this.applicationResult.application_id}`;
    }
    get strategyMessageClass() {
        return this.strategyMessageTone === 'success' ? 'text-success' : 'text-danger';
    }
    get coverageSaveMessageClass() {
        return this.coverageSaveMessageTone === 'success' ? 'text-success' : 'text-danger';
    }
    get oddsTargetLabel() {
        return this.form.targetOddsEnabled ? `${this.form.targetOddsMin} - ${this.form.targetOddsMax}` : 'Aucune cible';
    }
    get bankrollLabel() {
        return this.form.bankrollEnabled ? `${this.form.stakingMethod} · ${this.form.initialStake || 0} EUR` : 'Désactivée';
    }
    get scoredMarketsSummary() {
        if (!this.selectedRunId) {
            return 'Sélectionne une analyse sauvegardée pour voir uniquement les marchés que le moteur a réellement notés.';
        }
        if (this.scoredMarketsLoading) {
            return 'Chargement des marchés notés...';
        }
        const candidatesCount = this.scoredMarketOptions.reduce((sum, market) => sum + market.count, 0);
        const withOddsCount = this.scoredMarketOptions.reduce((sum, market) => sum + market.withOddsCount, 0);
        return `${this.scoredMarketOptions.length} marché(s) noté(s) · ${candidatesCount} candidat(s) · ${withOddsCount} avec cote`;
    }
    get configuredMarketsOutsideRun() {
        const scored = new Set(this.scoredMarketOptions.map((market) => market.id));
        return this.marketList(this.form.allowedMarketsText)
            .map((market) => this.normalizeMarketId(market))
            .filter((market, index, list) => market && !scored.has(market) && list.indexOf(market) === index)
            .map((market) => `${this.marketLabel(market)} (${market})`);
    }
    get applyingStatusLabel() {
        if (this.selectionMode === 'filter_only') {
            return 'Filtrage des candidats existants et écriture des artefacts de stratégie...';
        }
        return 'Filtrage des candidats existants, puis demande de proposition de ticket au moteur de sélection...';
    }
    get applicationHasErrors() {
        const result = this.applicationResult;
        if (!result) {
            return false;
        }
        const statusText = `${result.status || ''} ${result.selection_status || ''}`.toLowerCase();
        return Boolean(result.errors.length || statusText.includes('error') || statusText.includes('failed'));
    }
    get applicationTone() {
        if (this.applicationHasErrors) {
            return 'danger';
        }
        const statusText = `${this.applicationResult?.status || ''} ${this.applicationResult?.selection_status || ''}`.toLowerCase();
        return statusText.includes('skipped') || statusText.includes('filter_only') ? 'warning' : 'success';
    }
    get applicationPanelClass() {
        if (this.applicationTone === 'danger') {
            return 'border-danger/40 bg-danger/10';
        }
        if (this.applicationTone === 'warning') {
            return 'border-warning/40 bg-warning/10';
        }
        return 'border-success/40 bg-success/10';
    }
    get applicationFiles() {
        const files = this.applicationResult?.files || {};
        const order = [
            'application_summary',
            'strategy_applications_index',
            'selection',
            'filtered_candidates',
            'aggregation_candidates',
            'resolved_strategy'
        ];
        const known = order
            .filter((label) => files[label])
            .map((label) => ({ label, path: files[label] }));
        const extras = Object.entries(files)
            .filter(([label]) => !order.includes(label))
            .map(([label, path]) => ({ label, path }));
        return [...known, ...extras];
    }
    get formErrors() {
        const errors = [];
        if (!this.form.name.trim()) {
            errors.push('Le nom est obligatoire.');
        }
        if (!this.form.allowSingle && !this.form.allowCombo) {
            errors.push('Au moins un type de ticket doit être autorisé.');
        }
        if (this.form.maxPicks < this.form.minPicks) {
            errors.push('Le nombre max de sélections doit être supérieur ou égal au minimum.');
        }
        if (!this.form.allowSingle && this.form.allowCombo && this.form.minPicks < 2) {
            errors.push('Une stratégie combiné uniquement doit demander au moins 2 sélections.');
        }
        if (this.form.targetOddsEnabled && this.form.targetOddsMax <= this.form.targetOddsMin) {
            errors.push('La cote totale max doit être supérieure à la cote totale min.');
        }
        for (const [label, value] of [
            ['Confiance match', this.form.minMatchConfidence],
            ['Confiance pari', this.form.minPickConfidence],
            ['Confiance ticket', this.form.minComboConfidence],
            ['Plafond de mise en %', this.form.maxStakePercentPerTicket],
            ['Limite de perte quotidienne', this.form.dailyLossLimitPercent],
            ['Limite de perte hebdomadaire', this.form.weeklyLossLimitPercent]
        ]) {
            if (value < 0 || value > 100) {
                errors.push(`${label} doit être entre 0 et 100.`);
            }
        }
        if (!this.marketList(this.form.allowedMarketsText).length) {
            errors.push('Au moins un marché autorisé est obligatoire.');
        }
        return errors;
    }
    get filteredLeagues() {
        const leagues = this.registry?.leagues ?? [];
        const search = this.searchTerm.trim().toLowerCase();
        return leagues.filter((league) => {
            if (!search) {
                return true;
            }
            const haystack = [league.competition_name, league.country, league.league_id?.toString() ?? ''].join(' ').toLowerCase();
            return haystack.includes(search);
        });
    }
    reload() {
        this.reloadStrategy();
        this.reloadCoverage();
        this.reloadRuns();
    }
    selectStrategy(strategyFile) {
        if (!strategyFile || strategyFile === this.selectedStrategyFile) {
            return;
        }
        this.selectedStrategyFile = strategyFile;
        this.strategyMessage = '';
        this.applicationResult = null;
        this.strategyLoading = true;
        this.strategyApi.getDetail(strategyFile).subscribe({
            next: (response) => {
                this.setSelectedStrategy(response);
                this.strategyLoading = false;
            },
            error: (err) => {
                this.strategyError = this.errorToMessage(err, 'Impossible de charger le détail de la stratégie.');
                this.strategyLoading = false;
            }
        });
    }
    activateSelected() {
        if (!this.canActivate) {
            return;
        }
        this.activating = true;
        this.strategyMessage = '';
        this.strategyApi.activate({ strategy_file: this.selectedStrategyFile }).subscribe({
            next: (response) => {
                this.activeStrategy = response.active_strategy;
                this.setSelectedStrategy(response.active_strategy);
                this.markActive(response.active_strategy_file);
                this.strategyMessageTone = 'success';
                this.strategyMessage = 'Stratégie active sauvegardée.';
                this.activating = false;
            },
            error: (err) => {
                this.strategyMessageTone = 'danger';
                this.strategyMessage = this.errorToMessage(err, 'Impossible d’activer la stratégie.');
                this.activating = false;
            }
        });
    }
    saveStrategy(activate) {
        if (!this.canSave || !this.selectedStrategy) {
            return;
        }
        const payload = this.payloadFromForm();
        this.saving = true;
        this.strategyMessage = '';
        this.strategyApi.save({ strategy_file: this.selectedStrategyFile, payload, activate }).subscribe({
            next: (response) => {
                this.setSelectedStrategy(response.strategy);
                if (activate) {
                    this.activeStrategy = response.strategy;
                    this.markActive(response.active_strategy_file);
                }
                this.strategyMessageTone = 'success';
                this.strategyMessage = activate ? 'Stratégie sauvegardée et active.' : 'Stratégie sauvegardée.';
                this.saving = false;
            },
            error: (err) => {
                this.strategyMessageTone = 'danger';
                this.strategyMessage = this.errorToMessage(err, 'Impossible de sauvegarder la stratégie.');
                this.saving = false;
            }
        });
    }
    applyStrategyToRun() {
        if (!this.canApplyStrategy) {
            return;
        }
        this.applyingStrategy = true;
        this.applicationError = '';
        this.applicationResult = null;
        this.strategyApi.applyToRun({
            run_id: this.selectedRunId,
            strategy_file: this.selectedStrategyFile,
            selection_mode: this.selectionMode
        }).subscribe({
            next: (response) => {
                this.applicationResult = response;
                this.applyingStrategy = false;
            },
            error: (err) => {
                this.applicationError = this.errorToMessage(err, 'Impossible d’appliquer la stratégie à cette analyse.');
                this.applyingStrategy = false;
            }
        });
    }
    selectAnalysisRun(runId) {
        if (!runId || runId === this.selectedRunId) {
            return;
        }
        this.selectedRunId = runId;
        this.applicationResult = null;
        this.applicationError = '';
        this.loadScoredMarketsForRun(runId);
    }
    isAllowedMarket(marketId) {
        const normalized = this.normalizeMarketId(marketId);
        return this.marketList(this.form.allowedMarketsText)
            .map((market) => this.normalizeMarketId(market))
            .includes(normalized);
    }
    toggleAllowedMarket(marketId, enabled) {
        const normalized = this.normalizeMarketId(marketId);
        const current = this.marketList(this.form.allowedMarketsText).map((market) => this.normalizeMarketId(market));
        const next = enabled
            ? [...current, normalized]
            : current.filter((market) => market !== normalized);
        this.form.allowedMarketsText = Array.from(new Set(next.filter(Boolean))).sort().join('\n');
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
    textValue(event) {
        return ($eventTarget(event).value || '').toString();
    }
    numberValue(event) {
        const value = Number(($eventTarget(event).value || 0));
        return Number.isFinite(value) ? value : 0;
    }
    riskValue(event) {
        const value = this.textValue(event);
        return value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';
    }
    ticketTypeValue(event) {
        const value = this.textValue(event);
        return value === 'single' || value === 'combo' || value === 'mixed' ? value : 'combo';
    }
    dataQualityValue(event) {
        const value = this.textValue(event);
        return value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';
    }
    stakingValue(event) {
        const value = this.textValue(event);
        return value === 'manual' || value === 'flat' || value === 'percentage' || value === 'kelly_fractional' || value === 'cycle_rollover'
            ? value
            : 'manual';
    }
    selectionModeValue(event) {
        return this.textValue(event) === 'filter_only' ? 'filter_only' : 'filter_and_select';
    }
    resolvedValue(key) {
        const value = this.selectedStrategy?.resolved?.[key];
        return value == null || value === '' ? '—' : String(value);
    }
    onSearch(value) {
        this.searchTerm = value;
    }
    statusActionTitle(league) {
        if (league.league_id == null) {
            return 'This league has no verified API-Football ID yet.';
        }
        if (this.isPending(league)) {
            return 'Sauvegarde du statut de couverture...';
        }
        return league.enabled ? 'Cliquer pour désactiver cette ligue.' : 'Cliquer pour activer cette ligue.';
    }
    trackLeague(league) {
        return league.league_id ?? `${league.country}-${league.competition_name}`;
    }
    isPending(league) {
        return league.league_id != null && this.pendingLeagueIds.has(league.league_id);
    }
    setEnabled(league, enabled) {
        if (league.league_id == null || this.pendingLeagueIds.has(league.league_id)) {
            return;
        }
        const leagueId = league.league_id;
        const previousEnabled = league.enabled;
        this.pendingLeagueIds.add(leagueId);
        this.coverageSaveMessage = '';
        this.updateLeagueEnabled(leagueId, enabled);
        this.coverageApi.updateFootballLeague(leagueId, { enabled }).subscribe({
            next: () => {
                this.pendingLeagueIds.delete(leagueId);
            },
            error: (err) => {
                this.updateLeagueEnabled(leagueId, previousEnabled);
                this.coverageSaveMessageTone = 'danger';
                this.coverageSaveMessage = this.errorToMessage(err, 'Impossible de mettre à jour la couverture.');
                this.pendingLeagueIds.delete(leagueId);
            }
        });
    }
    reloadStrategy() {
        this.strategyLoading = true;
        this.strategyError = '';
        this.strategyApi.getCatalog().subscribe({
            next: (response) => {
                this.strategyCatalog = response;
                this.activeStrategy = response.active_strategy || null;
                this.setSelectedStrategy(response.active_strategy || null);
                this.strategyLoading = false;
            },
            error: (err) => {
                this.strategyError = this.errorToMessage(err, 'Impossible de charger le catalogue de stratégies.');
                this.strategyLoading = false;
            }
        });
    }
    reloadRuns() {
        this.runsLoading = true;
        this.analysisApi.getRuns().subscribe({
            next: (runs) => {
                this.analysisRuns = runs.filter((run) => ['completed', 'stopped'].includes(String(run.status || '').toLowerCase()));
                const nextRunId = this.selectedRunId || this.analysisRuns[0]?.run_id || '';
                this.selectedRunId = nextRunId;
                if (nextRunId) {
                    this.loadScoredMarketsForRun(nextRunId);
                }
                this.runsLoading = false;
            },
            error: () => {
                this.analysisRuns = [];
                this.runsLoading = false;
            }
        });
    }
    loadScoredMarketsForRun(runId) {
        this.scoredMarketsLoading = true;
        this.scoredMarketsError = '';
        this.analysisApi.getRunOutputs(runId).subscribe({
            next: (outputs) => {
                this.scoredMarketOptions = this.scoredMarketsFromOutputs(outputs);
                this.scoredMarketsLoading = false;
            },
            error: (err) => {
                this.scoredMarketOptions = [];
                this.scoredMarketsError = this.errorToMessage(err, 'Impossible de charger les marchés notés pour cette analyse.');
                this.scoredMarketsLoading = false;
            }
        });
    }
    scoredMarketsFromOutputs(outputs) {
        const candidates = this.scoredCandidatesFromOutputs(outputs);
        const grouped = new Map();
        for (const candidate of candidates) {
            const marketId = this.normalizeMarketId(textFromUnknown(candidate['market_canonical_id'] || candidate['market'] || 'unknown_market'));
            const confidence = numberFromUnknown(candidate['confidence_score'] ?? candidate['confidence']);
            const hasOdds = candidate['expected_odds_min'] != null || candidate['odds'] != null;
            const event = textFromUnknown(candidate['event']);
            const pick = textFromUnknown(candidate['pick'] || candidate['selection_canonical_id']);
            const entry = grouped.get(marketId) || { count: 0, confidenceTotal: 0, withOddsCount: 0, examples: [] };
            entry.count += 1;
            entry.confidenceTotal += confidence;
            entry.withOddsCount += hasOdds ? 1 : 0;
            if (event && entry.examples.length < 2) {
                entry.examples.push(pick ? `${event} (${pick})` : event);
            }
            grouped.set(marketId, entry);
        }
        return Array.from(grouped.entries())
            .map(([id, entry]) => ({
            id,
            label: this.marketLabel(id),
            count: entry.count,
            averageConfidence: Math.round(entry.confidenceTotal / Math.max(1, entry.count)),
            withOddsCount: entry.withOddsCount,
            examples: entry.examples
        }))
            .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
    }
    scoredCandidatesFromOutputs(outputs) {
        const aggregation = recordFromUnknown(outputs.artifacts['aggregation_candidates']?.data);
        const aggregationCandidates = arrayFromUnknown(aggregation['candidates']).filter(isRecord);
        if (aggregationCandidates.length) {
            return aggregationCandidates;
        }
        const matchAnalysis = recordFromUnknown(outputs.artifacts['match_analysis']?.data);
        const results = arrayFromUnknown(matchAnalysis['results']).filter(isRecord);
        const candidates = [];
        for (const result of results) {
            const analysis = recordFromUnknown(result['analysis']);
            const markets = arrayFromUnknown(analysis['predicted_markets']).filter(isRecord);
            for (const market of markets) {
                candidates.push({
                    ...market,
                    event: analysis['event'],
                    confidence_score: market['confidence']
                });
            }
        }
        return candidates;
    }
    normalizeMarketId(value) {
        const market = String(value || '').trim().toLowerCase();
        if (!market) {
            return 'unknown_market';
        }
        if (['1x2', 'winner', 'match_winner_1x2'].includes(market) || market.startsWith('match_winner')) {
            return 'match_winner';
        }
        if (market === 'btts' || market.includes('both_teams')) {
            return 'both_teams_to_score';
        }
        if (market.includes('over_under') || market.includes('total_goals') || market.startsWith('goals_over_under')) {
            return 'goals_over_under';
        }
        return market;
    }
    marketLabel(marketId) {
        const normalized = this.normalizeMarketId(marketId);
        return MARKET_LABELS_FR[normalized] || normalized.replace(/_/g, ' ');
    }
    reloadCoverage() {
        this.coverageLoading = true;
        this.coverageError = '';
        this.coverageApi.getFootballLeagues().subscribe({
            next: (response) => {
                this.registry = response;
                this.coverageLoading = false;
            },
            error: (err) => {
                this.coverageError = this.errorToMessage(err, 'Impossible de charger le registre de couverture.');
                this.coverageLoading = false;
            }
        });
    }
    setSelectedStrategy(strategy) {
        this.selectedStrategy = strategy;
        this.selectedStrategyFile = strategy?.strategy_file || '';
        this.form = this.formFromPayload(strategy?.payload || {});
    }
    formFromPayload(payload) {
        const ticket = objectAt(payload, 'ticket_policy');
        const targetOdds = objectAt(ticket, 'target_odds');
        const confidence = objectAt(payload, 'confidence_policy');
        const risk = objectAt(payload, 'risk_policy');
        const analysis = objectAt(payload, 'analysis_policy');
        const market = objectAt(payload, 'market_policy');
        const bankroll = objectAt(payload, 'bankroll_policy');
        return {
            name: stringAt(payload, 'name'),
            description: stringAt(payload, 'description'),
            enabled: booleanAt(payload, 'enabled', true),
            preferredTicketType: ticketTypeAt(ticket, 'preferred_ticket_type', 'combo'),
            allowSingle: booleanAt(ticket, 'allow_single', true),
            allowCombo: booleanAt(ticket, 'allow_combo', true),
            minPicks: numberAt(ticket, 'min_picks', 1),
            maxPicks: numberAt(ticket, 'max_picks', 5),
            targetOddsEnabled: booleanAt(targetOdds, 'enabled', true),
            targetOddsMin: numberAt(targetOdds, 'min', 2.8),
            targetOddsMax: numberAt(targetOdds, 'max', 3.5),
            minMatchConfidence: numberAt(confidence, 'min_match_analysis_confidence', 65),
            minPickConfidence: numberAt(confidence, 'min_pick_confidence', 65),
            minComboConfidence: numberAt(confidence, 'min_combo_confidence', 65),
            riskAppetite: riskAt(risk, 'risk_appetite', 'medium'),
            maxPickRisk: riskAt(risk, 'max_pick_risk', 'medium'),
            maxComboRisk: riskAt(risk, 'max_combo_risk', 'medium'),
            minDataQuality: dataQualityAt(analysis, 'min_data_quality', 'medium'),
            requireOddsAvailable: booleanAt(analysis, 'require_odds_available', true),
            allowedMarketsText: listAt(market, 'allowed_markets').join('\n'),
            excludedMarketsText: listAt(market, 'excluded_markets').join('\n'),
            bankrollEnabled: booleanAt(bankroll, 'enabled', false),
            stakingMethod: stakingAt(bankroll, 'staking_method', 'manual'),
            initialStake: numberAt(bankroll, 'initial_stake', 0),
            targetBankroll: numberAt(bankroll, 'target_bankroll', 0),
            resetOnGoal: booleanAt(bankroll, 'reset_on_goal', false),
            lossRule: stringAt(bankroll, 'loss_rule'),
            maxCycleSteps: numberAt(bankroll, 'max_cycle_steps', 1),
            maxStakePercentPerTicket: numberAt(bankroll, 'max_stake_percent_per_ticket', 0),
            dailyLossLimitPercent: numberAt(bankroll, 'daily_loss_limit_percent', 0),
            weeklyLossLimitPercent: numberAt(bankroll, 'weekly_loss_limit_percent', 0)
        };
    }
    payloadFromForm() {
        const payload = deepClone(this.selectedStrategy?.payload || {});
        payload['name'] = this.form.name.trim();
        payload['description'] = this.form.description.trim();
        payload['enabled'] = this.form.enabled;
        const ticket = ensureObject(payload, 'ticket_policy');
        ticket['allow_single'] = this.form.allowSingle;
        ticket['allow_combo'] = this.form.allowCombo;
        ticket['preferred_ticket_type'] = this.form.preferredTicketType;
        ticket['min_picks'] = this.form.minPicks;
        ticket['max_picks'] = this.form.maxPicks;
        const targetOdds = ensureObject(ticket, 'target_odds');
        targetOdds['enabled'] = this.form.targetOddsEnabled;
        targetOdds['min'] = this.form.targetOddsEnabled ? this.form.targetOddsMin : null;
        targetOdds['max'] = this.form.targetOddsEnabled ? this.form.targetOddsMax : null;
        const confidence = ensureObject(payload, 'confidence_policy');
        confidence['min_match_analysis_confidence'] = this.form.minMatchConfidence;
        confidence['min_pick_confidence'] = this.form.minPickConfidence;
        confidence['min_combo_confidence'] = this.form.minComboConfidence;
        const risk = ensureObject(payload, 'risk_policy');
        risk['risk_appetite'] = this.form.riskAppetite;
        risk['max_pick_risk'] = this.form.maxPickRisk;
        risk['max_combo_risk'] = this.form.maxComboRisk;
        const analysis = ensureObject(payload, 'analysis_policy');
        analysis['min_data_quality'] = this.form.minDataQuality;
        analysis['require_odds_available'] = this.form.requireOddsAvailable;
        const market = ensureObject(payload, 'market_policy');
        market['mode'] = 'allowlist';
        market['allowed_markets'] = this.marketList(this.form.allowedMarketsText);
        market['excluded_markets'] = this.marketList(this.form.excludedMarketsText);
        const bankroll = ensureObject(payload, 'bankroll_policy');
        bankroll['enabled'] = this.form.bankrollEnabled;
        bankroll['staking_method'] = this.form.stakingMethod;
        bankroll['initial_stake'] = this.form.bankrollEnabled ? this.form.initialStake : null;
        bankroll['target_bankroll'] = this.form.bankrollEnabled && this.form.targetBankroll > 0 ? this.form.targetBankroll : null;
        bankroll['reset_on_goal'] = this.form.resetOnGoal;
        bankroll['loss_rule'] = this.form.lossRule.trim() || null;
        bankroll['max_cycle_steps'] = this.form.maxCycleSteps || null;
        bankroll['max_stake_percent_per_ticket'] = this.form.maxStakePercentPerTicket || null;
        bankroll['daily_loss_limit_percent'] = this.form.dailyLossLimitPercent || null;
        bankroll['weekly_loss_limit_percent'] = this.form.weeklyLossLimitPercent || null;
        return payload;
    }
    markActive(activeStrategyFile) {
        if (!this.strategyCatalog) {
            return;
        }
        this.strategyCatalog = {
            ...this.strategyCatalog,
            active_strategy_file: activeStrategyFile,
            active_strategy: this.activeStrategy,
            strategies: this.strategyCatalog.strategies.map((strategy) => ({
                ...strategy,
                active: strategy.strategy_file === activeStrategyFile
            }))
        };
    }
    updateLeagueEnabled(leagueId, enabled) {
        if (!this.registry) {
            return;
        }
        const leagues = this.registry.leagues.map((item) => item.league_id === leagueId ? { ...item, enabled } : item);
        this.registry = {
            ...this.registry,
            leagues,
            enabled_count: leagues.reduce((count, item) => count + (item.enabled ? 1 : 0), 0)
        };
    }
    marketList(value) {
        return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
    }
    emptyForm() {
        return {
            name: '',
            description: '',
            enabled: true,
            preferredTicketType: 'combo',
            allowSingle: true,
            allowCombo: true,
            minPicks: 1,
            maxPicks: 5,
            targetOddsEnabled: true,
            targetOddsMin: 2.8,
            targetOddsMax: 3.5,
            minMatchConfidence: 65,
            minPickConfidence: 65,
            minComboConfidence: 65,
            riskAppetite: 'medium',
            maxPickRisk: 'medium',
            maxComboRisk: 'medium',
            minDataQuality: 'medium',
            requireOddsAvailable: true,
            allowedMarketsText: '',
            excludedMarketsText: '',
            bankrollEnabled: false,
            stakingMethod: 'manual',
            initialStake: 0,
            targetBankroll: 0,
            resetOnGoal: false,
            lossRule: '',
            maxCycleSteps: 1,
            maxStakePercentPerTicket: 0,
            dailyLossLimitPercent: 0,
            weeklyLossLimitPercent: 0
        };
    }
    errorToMessage(err, fallback) {
        const maybeError = err;
        return maybeError?.error?.detail || maybeError?.message || fallback;
    }
    static { this.ɵfac = function StrategyPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StrategyPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StrategyPage, selectors: [["ba-strategy-page"]], decls: 72, vars: 20, consts: [["eyebrow", "Admin strat\u00E9gie", "title", "Strat\u00E9gie & couverture", "subtitle", "Configure une strat\u00E9gie avec des champs born\u00E9s, puis applique-la \u00E0 une analyse d\u00E9j\u00E0 sauvegard\u00E9e."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", 3, "click", "disabled"], [1, "grid", "min-w-0", "gap-4", "xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]"], [1, "block"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "min-w-0"], [1, "ba-label"], [1, "mt-1", "truncate", "text-sm", "font-semibold", "text-text"], [1, "mt-1", "truncate", "text-xs", "text-muted"], [3, "label", "tone"], [1, "border-t", "border-border/60", "p-4"], ["message", "Chargement des strat\u00E9gies...", 3, "showShimmer"], ["label", "Erreur API strat\u00E9gie", 3, "message"], [1, "min-w-0", "space-y-4"], [1, "ba-card-header"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "mt-1", "text-xs", "text-muted"], ["message", "Chargement des analyses sauvegard\u00E9es..."], ["label", "Aucune analyse sauvegard\u00E9e", "message", "Lance d\u2019abord une analyse, puis applique une strat\u00E9gie ici."], [1, "mt-4", "rounded-card", "border", "border-accent/50", "bg-accent/10", "p-3"], [1, "mt-3", "text-sm", "text-danger"], [1, "mt-4", "rounded-card", "border", "p-3", 3, "class"], [1, "grid", "gap-3", "sm:grid-cols-2"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "ba-data", "mt-2", "text-text"], [1, "mt-2", "truncate", "text-xs", "text-muted"], [1, "mt-4"], ["label", "Erreur API couverture", 3, "message"], ["label", "Aucun registre de comp\u00E9titions", "message", "Aucune couverture football n\u2019est disponible."], [1, "grid", "gap-4", "lg:grid-cols-2"], [1, "block", "lg:col-span-2"], [1, "ba-tool", "mt-2", "w-full", "bg-background", 3, "change", "value"], [3, "value"], ["type", "text", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], ["type", "button", 1, "ba-tool", "mt-2", "w-full", "justify-center", 3, "click"], [1, "mt-2", "min-h-20", "w-full", "rounded-card", "border", "border-border/70", "bg-background", "p-3", "text-sm", "text-text", "outline-none", "focus:border-accent", 3, "input", "value"], [1, "rounded-card", "border", "border-border/60", "bg-background/50", "p-3", "lg:col-span-2"], [1, "grid", "gap-3", "md:grid-cols-3"], ["value", "single"], ["value", "combo"], ["value", "mixed"], ["type", "number", "min", "1", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], [1, "mt-3", "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", 3, "click"], [1, "mt-3", "grid", "gap-3", "md:grid-cols-2"], ["type", "number", "min", "0", "max", "100", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], [1, "mt-3", "grid", "gap-3", "md:grid-cols-4"], ["value", "low"], ["value", "medium"], ["value", "high"], ["type", "button", 1, "ba-tool", "mt-3", 3, "click"], [1, "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-start", "lg:justify-between"], [1, "mt-1", "text-sm", "text-muted"], ["tone", "default", 3, "label"], [1, "mt-3"], [1, "mt-3", "rounded-card", "border", "border-warning/40", "bg-warning/10", "p-3", "text-sm", "text-warning"], [1, "mt-3", "grid", "max-h-[22rem]", "gap-2", "overflow-y-auto", "pr-1", "xl:grid-cols-2"], [1, "mt-3", "rounded-card", "border", "border-warning/40", "bg-warning/10", "p-3", "text-xs", "text-warning"], [1, "mt-3", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "cursor-pointer", "text-xs", "font-medium", "uppercase", "tracking-wide", "text-muted"], [1, "mt-3", "min-h-20", "w-full", "rounded-card", "border", "border-border/70", "bg-background", "p-3", "font-mono", "text-xs", "text-text", "outline-none", "focus:border-accent", 3, "input", "value"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "mt-1", "truncate", "text-sm", "text-muted"], [1, "mt-4", "rounded-card", "border", "border-danger/40", "bg-danger/10", "p-3", "text-sm", "text-danger"], [1, "mt-3", "text-sm", 3, "class"], [1, "mt-4", "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", 3, "click", "disabled"], ["type", "number", "min", "1.01", "step", "0.01", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], ["message", "Lecture des march\u00E9s not\u00E9s..."], [1, "flex", "cursor-pointer", "items-start", "gap-3", "rounded-card", "border", "p-3", "transition", 3, "border-success/50", "bg-success/10", "border-border/60", "bg-surface-low"], [1, "flex", "cursor-pointer", "items-start", "gap-3", "rounded-card", "border", "p-3", "transition"], ["type", "checkbox", 1, "mt-1", "accent-current", 3, "change", "checked"], [1, "block", "truncate", "text-sm", "font-semibold", "text-text", 3, "title"], [1, "mt-1", "block", "text-xs", "text-muted"], [1, "mt-1", "block", "truncate", "text-xs", "text-muted"], [1, "mt-1", "block", "truncate", "font-mono", "text-[11px]", "text-muted", 3, "title"], [1, "font-medium"], [1, "mt-1"], ["value", "manual"], ["value", "flat"], ["value", "percentage"], ["value", "kelly_fractional"], ["value", "cycle_rollover"], ["type", "number", "min", "0", "step", "0.01", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], [1, "mt-3", "text-sm"], [1, "mt-3", "block"], ["value", "filter_and_select"], ["value", "filter_only"], ["type", "button", 1, "ba-tool", "mt-4", "w-full", "justify-center", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", 3, "click", "disabled"], [1, "flex", "items-center", "gap-3"], [1, "h-2.5", "w-2.5", "animate-pulse", "rounded-full", "bg-accent"], [1, "text-sm", "font-semibold", "text-text"], [1, "mt-4", "rounded-card", "border", "p-3"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-2"], [1, "mt-1", "truncate", "text-sm", "font-semibold", "text-text", 3, "title"], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["routerLink", "/tickets", 1, "ba-tool", "border-accent/50", "bg-background/70", "text-accent", "hover:bg-accent/10", 3, "queryParams"], [1, "mt-3", "grid", "gap-2", "sm:grid-cols-2"], [1, "text-sm", "text-muted"], [1, "text-text"], [1, "mt-3", "rounded-card", "border", "border-danger/40", "bg-danger/10", "p-2", "text-xs", "text-danger"], [1, "mt-3", "rounded-card", "border", "border-border/60", "bg-background/60", "p-2", "text-xs", "text-muted"], [1, "cursor-pointer", "select-none", "text-text"], [1, "mt-2", "truncate"], [1, "ba-label", "mt-3"], [1, "mt-1", "truncate"], [1, "p-4"], ["message", "Chargement de la couverture des comp\u00E9titions..."], [1, "border-b", "border-border/60", "p-4"], ["type", "text", "placeholder", "Ligue ou pays...", 1, "ba-tool", "mt-2", "w-full", 3, "input", "value"], [1, "min-h-10", "border-b", "border-border/60", "px-4", "py-3", "text-sm"], [3, "class"], [1, "max-h-[34rem]", "divide-y", "divide-border/60", "overflow-y-auto"], [1, "grid", "gap-3", "p-3", "md:grid-cols-[minmax(0,1fr)_auto]", "md:items-center"], [1, "truncate", "text-sm", "font-semibold", "text-text", 3, "title"], [1, "text-warning"], ["type", "button", 1, "inline-flex", "w-full", "items-center", "justify-center", "gap-2", "rounded-card", "border", "px-3", "py-2", "text-sm", "font-medium", "transition", "disabled:cursor-not-allowed", "disabled:opacity-60", "md:w-auto", "md:min-w-[8rem]", 3, "click", "disabled", "title"], [1, "inline-block", "h-2.5", "w-2.5", "rounded-full", "border", "border-current"], ["aria-hidden", "true"]], template: function StrategyPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function StrategyPage_Template_button_click_2_listener() { return ctx.reload(); });
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(4, "div", 3)(5, "ba-section-card", 4)(6, "div", 5)(7, "div", 6)(8, "p", 7);
            i0.ɵɵtext(9, "Formulaire strat\u00E9gie");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "h3", 8);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "p", 9);
            i0.ɵɵtext(13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 1);
            i0.ɵɵelement(15, "ba-status-badge", 10)(16, "ba-status-badge", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 11);
            i0.ɵɵconditionalCreate(18, StrategyPage_Conditional_18_Template, 1, 1, "ba-loading-state", 12)(19, StrategyPage_Conditional_19_Template, 1, 1, "ba-error-state", 13)(20, StrategyPage_Conditional_20_Template, 141, 58);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "div", 14)(22, "ba-section-card", 4)(23, "div", 15)(24, "p", 7);
            i0.ɵɵtext(25, "Utiliser la strat\u00E9gie");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "h3", 16);
            i0.ɵɵtext(27, "Appliquer \u00E0 une analyse sauvegard\u00E9e");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "p", 17);
            i0.ɵɵtext(29, "Relance seulement le filtrage et la s\u00E9lection sur les artefacts existants.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "div", 11);
            i0.ɵɵconditionalCreate(31, StrategyPage_Conditional_31_Template, 1, 0, "ba-loading-state", 18)(32, StrategyPage_Conditional_32_Template, 1, 0, "ba-empty-state", 19)(33, StrategyPage_Conditional_33_Template, 16, 4);
            i0.ɵɵconditionalCreate(34, StrategyPage_Conditional_34_Template, 8, 1, "div", 20);
            i0.ɵɵconditionalCreate(35, StrategyPage_Conditional_35_Template, 2, 1, "p", 21);
            i0.ɵɵconditionalCreate(36, StrategyPage_Conditional_36_Template, 38, 20, "div", 22);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "ba-section-card", 4)(38, "div", 15)(39, "p", 7);
            i0.ɵɵtext(40, "Strat\u00E9gie active");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "h3", 16);
            i0.ɵɵtext(42);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "p", 9);
            i0.ɵɵtext(44);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 11)(46, "div", 23)(47, "div", 24)(48, "p", 7);
            i0.ɵɵtext(49, "Ticket");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "p", 25);
            i0.ɵɵtext(51);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "div", 24)(53, "p", 7);
            i0.ɵɵtext(54, "Cible de cote");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "p", 25);
            i0.ɵɵtext(56);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(57, "div", 24)(58, "p", 7);
            i0.ɵɵtext(59, "Mise");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "p", 25);
            i0.ɵɵtext(61);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(62, "div", 24)(63, "p", 7);
            i0.ɵɵtext(64, "Fichier d\u2019\u00E9tat");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "p", 26);
            i0.ɵɵtext(66);
            i0.ɵɵelementEnd()()()()()()();
            i0.ɵɵelementStart(67, "div", 27);
            i0.ɵɵconditionalCreate(68, StrategyPage_Conditional_68_Template, 3, 0, "ba-section-card")(69, StrategyPage_Conditional_69_Template, 1, 1, "ba-error-state", 28)(70, StrategyPage_Conditional_70_Template, 1, 0, "ba-empty-state", 29)(71, StrategyPage_Conditional_71_Template, 16, 2, "ba-section-card", 4);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.strategyLoading || ctx.coverageLoading);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.strategyLoading || ctx.coverageLoading ? "Actualisation..." : "Actualiser", " ");
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate((ctx.selectedStrategy == null ? null : ctx.selectedStrategy.name) || "Aucune strat\u00E9gie charg\u00E9e");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.selectedStrategyFile || "config/strategies/default.json");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("label", (ctx.selectedStrategy == null ? null : ctx.selectedStrategy.active) ? "active" : "brouillon")("tone", (ctx.selectedStrategy == null ? null : ctx.selectedStrategy.active) ? "success" : "default");
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", (ctx.selectedStrategy == null ? null : ctx.selectedStrategy.valid) ? "valide" : "invalide")("tone", (ctx.selectedStrategy == null ? null : ctx.selectedStrategy.valid) ? "success" : "danger");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.strategyLoading ? 18 : ctx.strategyError ? 19 : 20);
            i0.ɵɵadvance(13);
            i0.ɵɵconditional(ctx.runsLoading ? 31 : !ctx.analysisRuns.length ? 32 : 33);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.applyingStrategy ? 34 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.applicationError ? 35 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.applicationResult ? 36 : -1);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate((ctx.activeStrategy == null ? null : ctx.activeStrategy.name) || "Aucune strat\u00E9gie active");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate((ctx.strategyCatalog == null ? null : ctx.strategyCatalog.active_strategy_file) || "\u2014");
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.resolvedValue("preferred_ticket_type"));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.oddsTargetLabel);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.bankrollLabel);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate((ctx.strategyCatalog == null ? null : ctx.strategyCatalog.state_file) || "\u2014");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.coverageLoading ? 68 : ctx.coverageError ? 69 : !ctx.registry || !ctx.registry.leagues.length ? 70 : 71);
        } }, dependencies: [EmptyStateComponent,
            ErrorStateComponent,
            LoadingStateComponent,
            PageHeaderComponent,
            RouterLink,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StrategyPage, [{
        type: Component,
        args: [{
                selector: 'ba-strategy-page',
                standalone: true,
                imports: [
                    EmptyStateComponent,
                    ErrorStateComponent,
                    LoadingStateComponent,
                    PageHeaderComponent,
                    RouterLink,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-page-header
      eyebrow="Admin stratégie"
      title="Stratégie & couverture"
      subtitle="Configure une stratégie avec des champs bornés, puis applique-la à une analyse déjà sauvegardée."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool" (click)="reload()" [disabled]="strategyLoading || coverageLoading">
          {{ strategyLoading || coverageLoading ? 'Actualisation...' : 'Actualiser' }}
        </button>
      </div>
    </ba-page-header>

    <div class="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
      <ba-section-card class="block">
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <p class="ba-label">Formulaire stratégie</p>
            <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ selectedStrategy?.name || 'Aucune stratégie chargée' }}</h3>
            <p class="mt-1 truncate text-xs text-muted">{{ selectedStrategyFile || 'config/strategies/default.json' }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge [label]="selectedStrategy?.active ? 'active' : 'brouillon'" [tone]="selectedStrategy?.active ? 'success' : 'default'"></ba-status-badge>
            <ba-status-badge [label]="selectedStrategy?.valid ? 'valide' : 'invalide'" [tone]="selectedStrategy?.valid ? 'success' : 'danger'"></ba-status-badge>
          </div>
        </div>

        <div class="border-t border-border/60 p-4">
          @if (strategyLoading) {
            <ba-loading-state message="Chargement des stratégies..." [showShimmer]="true"></ba-loading-state>
          } @else if (strategyError) {
            <ba-error-state label="Erreur API stratégie" [message]="strategyError"></ba-error-state>
          } @else {
            <div class="grid gap-4 lg:grid-cols-2">
              <label class="block lg:col-span-2">
                <span class="ba-label">Profil de stratégie</span>
                <select
                  class="ba-tool mt-2 w-full bg-background"
                  [value]="selectedStrategyFile"
                  (change)="selectStrategy(($any($event.target).value || '').toString())"
                >
                  @for (strategy of strategies; track strategy.strategy_file) {
                    <option [value]="strategy.strategy_file">
                      {{ strategy.active ? '● ' : '' }}{{ strategy.name || strategy.strategy_id || strategy.strategy_file }}
                    </option>
                  }
                </select>
              </label>

              <label class="block">
                <span class="ba-label">Nom</span>
                <input class="ba-tool mt-2 w-full" type="text" [value]="form.name" (input)="form.name = textValue($event)" />
              </label>

              <label class="block">
                <span class="ba-label">Activation</span>
                <button
                  type="button"
                  class="ba-tool mt-2 w-full justify-center"
                  [class.border-success]="form.enabled"
                  [class.text-success]="form.enabled"
                  (click)="form.enabled = !form.enabled"
                >
                  {{ form.enabled ? 'Activée' : 'Désactivée' }}
                </button>
              </label>

              <label class="block lg:col-span-2">
                <span class="ba-label">Description</span>
                <textarea
                  class="mt-2 min-h-20 w-full rounded-card border border-border/70 bg-background p-3 text-sm text-text outline-none focus:border-accent"
                  [value]="form.description"
                  (input)="form.description = textValue($event)"
                ></textarea>
              </label>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="grid gap-3 md:grid-cols-3">
                  <label class="block">
                    <span class="ba-label">Type de ticket</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.preferredTicketType" (change)="form.preferredTicketType = ticketTypeValue($event)">
                      <option value="single">Simple</option>
                      <option value="combo">Combiné</option>
                      <option value="mixed">Mixte</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Sélections min</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.minPicks" (input)="form.minPicks = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Sélections max</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.maxPicks" (input)="form.maxPicks = numberValue($event)" />
                  </label>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" class="ba-tool" [class.border-success]="form.allowSingle" [class.text-success]="form.allowSingle" (click)="form.allowSingle = !form.allowSingle">
                    {{ form.allowSingle ? 'Tickets simples autorisés' : 'Tickets simples bloqués' }}
                  </button>
                  <button type="button" class="ba-tool" [class.border-success]="form.allowCombo" [class.text-success]="form.allowCombo" (click)="form.allowCombo = !form.allowCombo">
                    {{ form.allowCombo ? 'Combinés autorisés' : 'Combinés bloqués' }}
                  </button>
                  <button type="button" class="ba-tool" [class.border-success]="form.targetOddsEnabled" [class.text-success]="form.targetOddsEnabled" (click)="form.targetOddsEnabled = !form.targetOddsEnabled">
                    {{ form.targetOddsEnabled ? 'Cible de cote active' : 'Cible de cote inactive' }}
                  </button>
                </div>
                @if (form.targetOddsEnabled) {
                  <div class="mt-3 grid gap-3 md:grid-cols-2">
                    <label class="block">
                      <span class="ba-label">Cote totale min</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1.01" step="0.01" [value]="form.targetOddsMin" (input)="form.targetOddsMin = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Cote totale max</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1.01" step="0.01" [value]="form.targetOddsMax" (input)="form.targetOddsMax = numberValue($event)" />
                    </label>
                  </div>
                }
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="grid gap-3 md:grid-cols-3">
                  <label class="block">
                    <span class="ba-label">Confiance match</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minMatchConfidence" (input)="form.minMatchConfidence = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Confiance pari</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minPickConfidence" (input)="form.minPickConfidence = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Confiance ticket</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minComboConfidence" (input)="form.minComboConfidence = numberValue($event)" />
                  </label>
                </div>
                <div class="mt-3 grid gap-3 md:grid-cols-4">
                  <label class="block">
                    <span class="ba-label">Tolérance au risque</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.riskAppetite" (change)="form.riskAppetite = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Risque max par pari</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.maxPickRisk" (change)="form.maxPickRisk = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Risque max du ticket</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.maxComboRisk" (change)="form.maxComboRisk = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Qualité data min</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.minDataQuality" (change)="form.minDataQuality = dataQualityValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </label>
                </div>
                <button type="button" class="ba-tool mt-3" [class.border-success]="form.requireOddsAvailable" [class.text-success]="form.requireOddsAvailable" (click)="form.requireOddsAvailable = !form.requireOddsAvailable">
                  {{ form.requireOddsAvailable ? 'Cote obligatoire' : 'Cote optionnelle' }}
                </button>
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0">
                    <p class="ba-label">Marchés notés dans l’analyse sélectionnée</p>
                    <p class="mt-1 text-sm text-muted">{{ scoredMarketsSummary }}</p>
                  </div>
                  @if (selectedRunId) {
                    <ba-status-badge [label]="selectedRunId" tone="default"></ba-status-badge>
                  }
                </div>

                @if (scoredMarketsLoading) {
                  <div class="mt-3">
                    <ba-loading-state message="Lecture des marchés notés..."></ba-loading-state>
                  </div>
                } @else if (scoredMarketsError) {
                  <p class="mt-3 text-sm text-danger">{{ scoredMarketsError }}</p>
                } @else if (!scoredMarketOptions.length) {
                  <p class="mt-3 rounded-card border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
                    Aucun marché noté trouvé dans l’analyse sélectionnée.
                  </p>
                } @else {
                  <div class="mt-3 grid max-h-[22rem] gap-2 overflow-y-auto pr-1 xl:grid-cols-2">
                    @for (market of scoredMarketOptions; track market.id) {
                      <label
                        class="flex cursor-pointer items-start gap-3 rounded-card border p-3 transition"
                        [class.border-success/50]="isAllowedMarket(market.id)"
                        [class.bg-success/10]="isAllowedMarket(market.id)"
                        [class.border-border/60]="!isAllowedMarket(market.id)"
                        [class.bg-surface-low]="!isAllowedMarket(market.id)"
                      >
                        <input
                          class="mt-1 accent-current"
                          type="checkbox"
                          [checked]="isAllowedMarket(market.id)"
                          (change)="toggleAllowedMarket(market.id, $any($event.target).checked)"
                        />
                        <span class="min-w-0">
                          <span class="block truncate text-sm font-semibold text-text" [title]="market.label">{{ market.label }}</span>
                          <span class="mt-1 block text-xs text-muted">
                            {{ market.count }} candidat(s) noté(s) · moyenne {{ market.averageConfidence }} · {{ market.withOddsCount }} avec cote
                          </span>
                          @if (market.examples.length) {
                            <span class="mt-1 block truncate text-xs text-muted">{{ market.examples.join(' · ') }}</span>
                          }
                          <span class="mt-1 block truncate font-mono text-[11px] text-muted" [title]="market.id">{{ market.id }}</span>
                        </span>
                      </label>
                    }
                  </div>
                }

                @if (configuredMarketsOutsideRun.length) {
                  <div class="mt-3 rounded-card border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                    <p class="font-medium">Configurés mais non notés dans cette analyse :</p>
                    <p class="mt-1">{{ configuredMarketsOutsideRun.join(', ') }}</p>
                  </div>
                }

                <details class="mt-3 rounded-card border border-border/60 bg-background/60 p-3">
                  <summary class="cursor-pointer text-xs font-medium uppercase tracking-wide text-muted">
                    Marchés exclus avancés
                  </summary>
                  <textarea
                    class="mt-3 min-h-20 w-full rounded-card border border-border/70 bg-background p-3 font-mono text-xs text-text outline-none focus:border-accent"
                    [value]="form.excludedMarketsText"
                    (input)="form.excludedMarketsText = textValue($event)"
                  ></textarea>
                </details>
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-label">Gestion de bankroll</p>
                    <p class="mt-1 truncate text-sm text-muted">{{ form.bankrollEnabled ? form.stakingMethod : 'Désactivée' }}</p>
                  </div>
                  <button type="button" class="ba-tool" [class.border-success]="form.bankrollEnabled" [class.text-success]="form.bankrollEnabled" (click)="form.bankrollEnabled = !form.bankrollEnabled">
                    {{ form.bankrollEnabled ? 'Activée' : 'Désactivée' }}
                  </button>
                </div>
                @if (form.bankrollEnabled) {
                  <div class="mt-3 grid gap-3 md:grid-cols-4">
                    <label class="block">
                      <span class="ba-label">Staking</span>
                      <select class="ba-tool mt-2 w-full bg-background" [value]="form.stakingMethod" (change)="form.stakingMethod = stakingValue($event)">
                        <option value="manual">Manual</option>
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                        <option value="kelly_fractional">Kelly fractional</option>
                        <option value="cycle_rollover">Cycle rollover</option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="ba-label">Initial stake</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" step="0.01" [value]="form.initialStake" (input)="form.initialStake = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Target bankroll</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" step="0.01" [value]="form.targetBankroll" (input)="form.targetBankroll = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Max steps</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.maxCycleSteps" (input)="form.maxCycleSteps = numberValue($event)" />
                    </label>
                  </div>
                  <div class="mt-3 grid gap-3 md:grid-cols-4">
                    <label class="block">
                      <span class="ba-label">Plafond de mise %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.maxStakePercentPerTicket" (input)="form.maxStakePercentPerTicket = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Daily loss %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.dailyLossLimitPercent" (input)="form.dailyLossLimitPercent = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Weekly loss %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.weeklyLossLimitPercent" (input)="form.weeklyLossLimitPercent = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Loss rule</span>
                      <input class="ba-tool mt-2 w-full" type="text" [value]="form.lossRule" (input)="form.lossRule = textValue($event)" />
                    </label>
                  </div>
                  <button type="button" class="ba-tool mt-3" [class.border-success]="form.resetOnGoal" [class.text-success]="form.resetOnGoal" (click)="form.resetOnGoal = !form.resetOnGoal">
                    {{ form.resetOnGoal ? 'Reset à l’objectif' : 'Pas de reset automatique' }}
                  </button>
                }
              </div>
            </div>

            @if (formErrors.length) {
              <div class="mt-4 rounded-card border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                @for (errorItem of formErrors; track errorItem) {
                  <p>{{ errorItem }}</p>
                }
              </div>
            }
            @if (strategyMessage) {
              <p class="mt-3 text-sm" [class]="strategyMessageClass">{{ strategyMessage }}</p>
            }

            <div class="mt-4 flex flex-wrap gap-2">
              <button type="button" class="ba-tool" (click)="activateSelected()" [disabled]="!canActivate">
                {{ activating ? 'Activation...' : 'Définir active' }}
              </button>
              <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong" (click)="saveStrategy(false)" [disabled]="!canSave">
                {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
              <button type="button" class="ba-tool" (click)="saveStrategy(true)" [disabled]="!canSave">
                Sauvegarder & activer
              </button>
            </div>
          }
        </div>
      </ba-section-card>

      <div class="min-w-0 space-y-4">
        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Utiliser la stratégie</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Appliquer à une analyse sauvegardée</h3>
            <p class="mt-1 text-xs text-muted">Relance seulement le filtrage et la sélection sur les artefacts existants.</p>
          </div>
          <div class="border-t border-border/60 p-4">
            @if (runsLoading) {
              <ba-loading-state message="Chargement des analyses sauvegardées..."></ba-loading-state>
            } @else if (!analysisRuns.length) {
              <ba-empty-state label="Aucune analyse sauvegardée" message="Lance d’abord une analyse, puis applique une stratégie ici."></ba-empty-state>
            } @else {
              <label class="block">
                <span class="ba-label">Analyse sauvegardée</span>
                <select class="ba-tool mt-2 w-full bg-background" [value]="selectedRunId" (change)="selectAnalysisRun(textValue($event))">
                  @for (run of analysisRuns; track run.run_id) {
                    <option [value]="run.run_id">{{ shortId(run.run_id) }} · {{ run.target_date || 'no date' }} · {{ run.status }}</option>
                  }
                </select>
              </label>
              <label class="mt-3 block">
                <span class="ba-label">Mode d’application</span>
                <select class="ba-tool mt-2 w-full bg-background" [value]="selectionMode" (change)="selectionMode = selectionModeValue($event)">
                  <option value="filter_and_select">Filtrer puis générer un ticket</option>
                  <option value="filter_only">Filtrer uniquement</option>
                </select>
              </label>
              <button
                type="button"
                class="ba-tool mt-4 w-full justify-center border-accent/60 bg-accent text-background hover:bg-accent-strong"
                [disabled]="!canApplyStrategy"
                (click)="applyStrategyToRun()"
              >
                {{ applyingStrategy ? 'Application...' : 'Appliquer la stratégie à cette analyse' }}
              </button>
            }

            @if (applyingStrategy) {
              <div class="mt-4 rounded-card border border-accent/50 bg-accent/10 p-3">
                <div class="flex items-center gap-3">
                  <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-accent"></span>
                  <div>
                    <p class="text-sm font-semibold text-text">Application de la stratégie en cours</p>
                    <p class="mt-1 text-xs text-muted">{{ applyingStatusLabel }}</p>
                  </div>
                </div>
              </div>
            }
            @if (applicationError) {
              <p class="mt-3 text-sm text-danger">{{ applicationError }}</p>
            }
            @if (applicationResult) {
              <div
                class="mt-4 rounded-card border p-3"
                [class]="applicationPanelClass"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="min-w-0">
                    <p
                      class="ba-label"
                      [class.text-success]="applicationTone === 'success'"
                      [class.text-warning]="applicationTone === 'warning'"
                      [class.text-danger]="applicationTone === 'danger'"
                    >
                      Application sauvegardée
                    </p>
                    <p class="mt-1 truncate text-sm font-semibold text-text" [title]="applicationResult.application_id">{{ shortId(applicationResult.application_id) }}</p>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    @if (applicationResult.picks_count > 0) {
                      <a
                        class="ba-tool border-accent/50 bg-background/70 text-accent hover:bg-accent/10"
                        routerLink="/tickets"
                        [queryParams]="{ ticket_id: applicationTicketId }"
                      >
                        Voir le ticket
                      </a>
                    }
                    <ba-status-badge [label]="applicationResult.selection_status || applicationResult.status" [tone]="applicationTone"></ba-status-badge>
                  </div>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-2">
                  <p class="text-sm text-muted">Agrégés : <span class="text-text">{{ applicationResult.aggregation_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Retenus : <span class="text-text">{{ applicationResult.filtered_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Rejetés : <span class="text-text">{{ applicationResult.rejected_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Picks : <span class="text-text">{{ applicationResult.picks_count }}</span></p>
                </div>
                @if (applicationResult.errors.length) {
                  <div class="mt-3 rounded-card border border-danger/40 bg-danger/10 p-2 text-xs text-danger">
                    @for (error of applicationResult.errors; track error) {
                      <p>{{ error }}</p>
                    }
                  </div>
                }
                @if (applicationResult.notes.length) {
                  <div class="mt-3 rounded-card border border-border/60 bg-background/60 p-2 text-xs text-muted">
                    @for (note of applicationResult.notes; track note) {
                      <p>{{ note }}</p>
                    }
                  </div>
                }
                <details class="mt-3 rounded-card border border-border/60 bg-background/60 p-2 text-xs text-muted">
                  <summary class="cursor-pointer select-none text-text">Détails techniques</summary>
                  <p class="mt-2 truncate">{{ applicationResult.application_dir }}</p>
                  <p class="ba-label mt-3">Fichiers générés</p>
                  @for (file of applicationFiles; track file.label) {
                    <p class="mt-1 truncate">{{ file.label }} · {{ file.path }}</p>
                  }
                </details>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Stratégie active</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ activeStrategy?.name || 'Aucune stratégie active' }}</h3>
            <p class="mt-1 truncate text-xs text-muted">{{ strategyCatalog?.active_strategy_file || '—' }}</p>
          </div>
          <div class="border-t border-border/60 p-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Ticket</p>
                <p class="ba-data mt-2 text-text">{{ resolvedValue('preferred_ticket_type') }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Cible de cote</p>
                <p class="ba-data mt-2 text-text">{{ oddsTargetLabel }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Mise</p>
                <p class="ba-data mt-2 text-text">{{ bankrollLabel }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Fichier d’état</p>
                <p class="mt-2 truncate text-xs text-muted">{{ strategyCatalog?.state_file || '—' }}</p>
              </div>
            </div>
          </div>
        </ba-section-card>
      </div>
    </div>

    <div class="mt-4">
      @if (coverageLoading) {
        <ba-section-card>
          <div class="p-4">
            <ba-loading-state message="Chargement de la couverture des compétitions..."></ba-loading-state>
          </div>
        </ba-section-card>
      } @else if (coverageError) {
        <ba-error-state label="Erreur API couverture" [message]="coverageError"></ba-error-state>
      } @else if (!registry || !registry.leagues.length) {
        <ba-empty-state label="Aucun registre de compétitions" message="Aucune couverture football n’est disponible."></ba-empty-state>
      } @else {
        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Compétitions</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Liste des ligues suivies</h3>
          </div>
          <div class="border-b border-border/60 p-4">
            <label class="block">
              <span class="ba-label">Rechercher une ligue</span>
              <input class="ba-tool mt-2 w-full" type="text" [value]="searchTerm" (input)="onSearch(textValue($event))" placeholder="Ligue ou pays..." />
            </label>
          </div>

          <div class="min-h-10 border-b border-border/60 px-4 py-3 text-sm">
            @if (coverageSaveMessage) {
              <p [class]="coverageSaveMessageClass">{{ coverageSaveMessage }}</p>
            }
          </div>

          <div class="max-h-[34rem] divide-y divide-border/60 overflow-y-auto">
            @for (league of filteredLeagues; track trackLeague(league)) {
              <article class="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-semibold text-text" [title]="league.competition_name">{{ league.competition_name }}</h4>
                  <p class="mt-1 truncate text-sm text-muted">
                    {{ league.country }} @if (league.league_id == null) {
                      <span class="text-warning">· ID API-Football non verifie</span>
                    }
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-card border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[8rem]"
                  [class]="league.enabled
                    ? 'border-success/40 bg-success/10 text-success hover:border-success/60 hover:bg-success/15'
                    : 'border-danger/40 bg-danger/10 text-danger hover:border-danger/60 hover:bg-danger/15'"
                  (click)="setEnabled(league, !league.enabled)"
                  [disabled]="league.league_id == null || isPending(league)"
                  [title]="statusActionTitle(league)"
                  [attr.aria-pressed]="league.enabled"
                >
                  <span class="inline-block h-2.5 w-2.5 rounded-full border border-current" [class]="isPending(league) ? 'animate-pulse opacity-70' : ''" [attr.aria-hidden]="true"></span>
                  <span aria-hidden="true">{{ league.enabled ? '✓' : '✕' }}</span>
                  <span>{{ league.enabled ? 'Active' : 'Inactive' }}</span>
                </button>
              </article>
            }
          </div>
        </ba-section-card>
      }
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StrategyPage, { className: "StrategyPage", filePath: "src/app/features/strategy/strategy.page.ts", lineNumber: 662 }); })();
function $eventTarget(event) {
    return event.target;
}
function isRecord(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
function recordFromUnknown(value) {
    return isRecord(value) ? value : {};
}
function arrayFromUnknown(value) {
    return Array.isArray(value) ? value : [];
}
function textFromUnknown(value) {
    return value == null ? '' : String(value);
}
function numberFromUnknown(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}
function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}
function ensureObject(source, key) {
    if (!source[key] || typeof source[key] !== 'object' || Array.isArray(source[key])) {
        source[key] = {};
    }
    return source[key];
}
function objectAt(source, key) {
    const value = source[key];
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function stringAt(source, key) {
    const value = source[key];
    return value == null ? '' : String(value);
}
function numberAt(source, key, fallback) {
    const value = Number(source[key]);
    return Number.isFinite(value) ? value : fallback;
}
function booleanAt(source, key, fallback) {
    const value = source[key];
    return typeof value === 'boolean' ? value : fallback;
}
function listAt(source, key) {
    const value = source[key];
    return Array.isArray(value) ? value.map((item) => String(item)) : [];
}
function riskAt(source, key, fallback) {
    const value = stringAt(source, key);
    return value === 'low' || value === 'medium' || value === 'high' ? value : fallback;
}
function ticketTypeAt(source, key, fallback) {
    const value = stringAt(source, key);
    return value === 'single' || value === 'combo' || value === 'mixed' ? value : fallback;
}
function dataQualityAt(source, key, fallback) {
    const value = stringAt(source, key);
    return value === 'low' || value === 'medium' || value === 'high' ? value : fallback;
}
function stakingAt(source, key, fallback) {
    const value = stringAt(source, key);
    return value === 'manual' || value === 'flat' || value === 'percentage' || value === 'kelly_fractional' || value === 'cycle_rollover'
        ? value
        : fallback;
}
//# sourceMappingURL=strategy.page.js.map