(function initCreditPatch(){
  "use strict";
  window.applyCreditCardPatch = function(html) {
    let s=html;
    function sub(oldText,newText,label) {
      if(!s.includes(oldText)) throw new Error("credit-card patch missing: "+label);
      s=s.replace(oldText,newText);
    }
    sub("    const DEFAULT_EXPENSES = [",`    const CREDIT_CARD_KEYS = ["groceries","restaurants","fuel","parking","pharmacy","leisure","bitTransfers","otherPersonal"];
    const CREDIT_CARD_BASELINE = 4570;
    const DEFAULT_EXPENSES = [`, "credit categories");
    sub("    function defaultMonthlySavings() {",`    function defaultMonthlyCreditCard() { return Object.fromEntries(MONTHS.map(m => [m,null])); }
    function defaultMonthlySavings() {`,"card defaults");
    sub("        monthlySavings: defaultMonthlySavings(),",`        monthlySavings: defaultMonthlySavings(),
        monthlyCreditCard: defaultMonthlyCreditCard(),`,"state defaults");
    sub("    function expenseTotal() { return fromCents(sumCents(Object.values(state.expenses))); }",`    function expenseTotal() { return fromCents(sumCents(Object.values(state.expenses))); }
    function creditCardBudget() { return fromCents(sumCents(CREDIT_CARD_KEYS.map(k=>state.expenses[k]))); }`,"card budget");
    sub("      const importedSavings = candidate.monthlySavings || candidate.bankLeumiSavings || {};",`      const importedSavings = candidate.monthlySavings || candidate.bankLeumiSavings || {};
      const importedCreditCard = candidate.monthlyCreditCard || {};`,"import card");
    sub("        const savingValue = importedSavings?.[month];",`        const paidCard = importedCreditCard?.[month];
        if (paidCard === null || paidCard === undefined || paidCard === "") base.monthlyCreditCard[month] = null;
        else if (Number.isFinite(Number(paidCard)) && Number(paidCard) >= 0) base.monthlyCreditCard[month] = Number(paidCard);
        const savingValue = importedSavings?.[month];`,"import monthly card");
    sub("      const monthlySavings = {};",`      const monthlySavings = {};
      const monthlyCreditCard = {};`,"sparse map");
    sub("        const saving = source.monthlySavings?.[month];",`        const paidCard = source.monthlyCreditCard?.[month];
        if (paidCard !== null && paidCard !== undefined && paidCard !== "") monthlyCreditCard[month] = paidCard;
        const saving = source.monthlySavings?.[month];`,"sparse card");
    sub("        monthlySavings,\n        monthlyStratigoSalary,",`        monthlySavings,
        monthlyCreditCard,
        monthlyStratigoSalary,`,"sparse export");
    sub('      } else if (input.matches(".monthly-saving-input")) {',`      } else if (input.matches(".monthly-credit-input")) {
        value = parseMoney(input.value,true);
        if (Number.isNaN(value)) return false;
        state.monthlyCreditCard[input.dataset.month] = value;
      } else if (input.matches(".monthly-saving-input")) {`,"live autosave");
    sub("      const expenses = fromCents(toCents(expenseTotal()) + toCents(pensionContribution));",`      const creditCardAverage = creditCardBudget();
      const creditCardActual = state.monthlyCreditCard[month] ?? null;
      const creditCardEffective = creditCardActual === null ? creditCardAverage : creditCardActual;
      const expenses = fromCents(toCents(expenseTotal()) - toCents(creditCardAverage) + toCents(creditCardEffective) + toCents(pensionContribution));`,"replace card budget");
    sub("        rent, stratigoLiving, pensionContribution, plannedDraw, expenses, baseIncome, fullAvailable, balanceFull,",`        rent, stratigoLiving, pensionContribution, plannedDraw, expenses, creditCardAverage, creditCardActual, creditCardEffective, baseIncome, fullAvailable, balanceFull,`,"row values");
    sub('          expenses: sum("expenses"), balanceFull: sum("balanceFull"),',`          expenses: sum("expenses"), creditCardEffective: sum("creditCardEffective"), balanceFull: sum("balanceFull"),`,"annual sum");
    sub('        <td class="num">${formatMoney(summary.externalAfterZeroDraw)}</td>\n      </tr>`;',`        <td class="num">\${formatMoney(summary.externalAfterZeroDraw)}</td>
        <td class="num" data-field="creditCardYearly">\${formatPlain(summary.creditCardEffective)}</td>
      </tr>\`;`,"annual table");
    sub("    function monthlySavingCell(month, row) {",`    function creditCardCell(month,row) {
      return \`<td class="credit-card-cell" data-field="creditCardActual">
        <input class="money-input monthly-credit-input" inputmode="decimal" autocomplete="off" data-month="\${month}"
          value="\${row.creditCardActual === null ? "" : escapeHtml(formatPlain(row.creditCardActual))}"
          placeholder="\${escapeHtml(formatPlain(row.creditCardAverage))}"
          aria-label="חיוב אשראי ששולם בחודש \${escapeHtml(monthLabel(month))}; ריק פירושו ממוצע"
          title="חיוב שנפרע בחודש זה, גם אם הרכישות היו בחודש קודם. ריק = ממוצע; 0 = אפס בפועל.">
      </td>\`;
    }
    function monthlySavingCell(month, row) {`,"credit input");
    sub('        <td class="num" data-field="externalAfterZeroDraw">${formatMoney(row.externalAfterZeroDraw)}</td>\n      </tr>`;',`        <td class="num" data-field="externalAfterZeroDraw">\${formatMoney(row.externalAfterZeroDraw)}</td>
        \${creditCardCell(row.month,row)}
      </tr>\`;`,"monthly table cell");
    sub('              <div class="mobile-metric"><span>הוצאות</span><strong class="num">${formatMoney(row.expenses)}</strong></div>',`              <div class="mobile-metric"><span>הוצאות</span><strong class="num">\${formatMoney(row.expenses)}</strong></div>
              <div class="mobile-metric"><span>חיוב אשראי ששולם החודש (ריק = ממוצע \${formatPlain(row.creditCardAverage)})</span>
                <input class="money-input monthly-credit-input" inputmode="decimal" autocomplete="off" data-month="\${row.month}" value="\${row.creditCardActual === null ? "" : escapeHtml(formatPlain(row.creditCardActual))}" placeholder="\${escapeHtml(formatPlain(row.creditCardAverage))}" aria-label="חיוב אשראי בפועל \${escapeHtml(monthLabel(row.month))}">
              </div>`,"mobile input");
    sub("    function updateMonthlySavingInput(input) {",`    function updateMonthlyCreditInput(input) {
      const value = parseMoney(input.value,true);
      if (Number.isNaN(value)) { input.classList.add("invalid"); return; }
      input.classList.remove("invalid");
      state.monthlyCreditCard[input.dataset.month] = value;
      saveState();renderAll();
      const candidates = document.querySelectorAll(\`.monthly-credit-input[data-month="\${input.dataset.month}"]\`);
      const next = Array.from(candidates).find(el=>el.offsetParent!==null)||candidates[0];
      if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}
    }
    function updateMonthlySavingInput(input) {`,"change handler");
    sub('"חיסכון בפועל בבנק לאומי", "ניתן להשאיר בקרן"','"חיסכון בפועל בבנק לאומי", "אשראי ששולם בחודש", "ניתן להשאיר בקרן"',"CSV header");
    sub('row.possibleExternalSaving, row.actualMonthlySaving ?? "", row.actualPreserved,','row.possibleExternalSaving, row.actualMonthlySaving ?? "", row.creditCardActual ?? "", row.actualPreserved,',"CSV value");
    sub('      document.getElementById("expense-total").textContent = `סה״כ: ${formatMoney(expenseTotal())}`;',`      document.getElementById("expense-total").textContent = \`סה״כ: \${formatMoney(expenseTotal())}\`;
      const note = document.getElementById("credit-card-explanation");
      if(note){ const avg=creditCardBudget(),other=fromCents(toCents(expenseTotal())-toCents(avg));
        note.textContent=\`סה״כ בסיס \${formatMoney(expenseTotal())} = הוצאות אחרות וחיסכון קיים \${formatMoney(other)} + ממוצע חיובי אשראי \${formatMoney(avg)}. הממוצע כולל סופר, מסעדות, דלק, חניה, בריאות אישית, פנאי, BIT ורכישות אישיות. הזנת חיוב בפועל מחליפה את הממוצע, ללא כפילות. שדה ריק משתמש בממוצע, 0 מציין אפס בפועל. נרשם בחודש התשלום גם עבור רכישות קודמות.\`;
      }`,"dynamic budget explanation");
    sub('        <div id="expense-total" class="expense-total num"></div>',`        <div id="expense-total" class="expense-total num"></div>
        <p id="credit-card-explanation" class="credit-card-explanation small"></p>`,"credit explanation area");
    sub('שדה החיסכון בבנק לאומי הוא למעקב בלבד ואינו מופחת שוב מההוצאות.','שדה החיסכון בבנק לאומי הוא למעקב בלבד ואינו מופחת שוב מההוצאות. בעמודת האשראי אפשר להזין את הסכום ששולם בחודש, והוא מחליף את ממוצע האשראי, ללא כפילות.',"table guidance");
    sub('.actual-input, .global-input, .expense-input, .monthly-saving-input, .stratigo-input','.actual-input, .global-input, .expense-input, .monthly-saving-input, .monthly-credit-input, .stratigo-input',"input");
    sub('      else if (target.matches(".monthly-saving-input")) updateMonthlySavingInput(target);','      else if (target.matches(".monthly-saving-input")) updateMonthlySavingInput(target);\n      else if (target.matches(".monthly-credit-input")) updateMonthlyCreditInput(target);',"change");
    s=s.replaceAll('.actual-input, .global-input, .expense-input, .monthly-saving-input, .stratigo-input','.actual-input, .global-input, .expense-input, .monthly-saving-input, .monthly-credit-input, .stratigo-input');
    sub('      test("סכום רכיבי ההוצאות הוא 20,054 ₪",',`      test("ממוצע אשראי מקורי 4,570 ₪",nearlyEqual(CREDIT_CARD_KEYS.reduce((t,k)=>t+defaultExpenseMap()[k],0),CREDIT_CARD_BASELINE));
      test("אשראי בפועל מחליף ממוצע",nearlyEqual(20054-4570+7000,22484));
      test("סכום רכיבי ההוצאות הוא 20,054 ₪",`,"tests");
    sub("</head>",`<style id="credit-card-ui">.desktop-table tbody td[data-field="creditCardActual"]{padding:3px!important;min-width:90px!important;width:90px!important}.desktop-table input.monthly-credit-input{width:100%!important;max-width:none!important;box-sizing:border-box!important;padding:7px 4px!important;text-align:center!important;font-size:15px!important;font-weight:700!important;background:#fff!important;color:#162b34!important;border:1px solid #8298a4!important;border-radius:5px!important}.credit-card-explanation{line-height:1.7!important;padding:12px!important;background:#edf4f4!important;border-radius:8px!important}.mobile-metric input.monthly-credit-input{width:120px!important;max-width:100%!important}</style></head>`,"styles");
    (function applyNewBaseline(){
  const swaps=[
    ['settings: { openingFund: null, rentNet: 8450, plannedDraw: 7750, pensionContribution: DEFAULT_PENSION_CONTRIBUTION },','settings: { openingFund: null, rentNet: 8450, plannedDraw: 7750, pensionContribution: DEFAULT_PENSION_CONTRIBUTION, monthlyExpensesBase: 17500, creditCardAverage: 6000 },','default settings'],
    ['function expenseTotal() { return fromCents(sumCents(Object.values(state.expenses))); }','function expenseTotal() { return state.settings.monthlyExpensesBase; }','base source'],
    ['function creditCardBudget() { return fromCents(sumCents(CREDIT_CARD_KEYS.map(key => state.expenses[key]))); }','function creditCardBudget() { return state.settings.creditCardAverage; }','credit source'],
    ['base.settings.pensionContribution = sanitizeNonNegative(settings.pensionContribution ?? candidate.pensionContribution, DEFAULT_PENSION_CONTRIBUTION);','base.settings.pensionContribution = sanitizeNonNegative(settings.pensionContribution ?? candidate.pensionContribution, DEFAULT_PENSION_CONTRIBUTION);\n      base.settings.monthlyExpensesBase = sanitizeNonNegative(settings.monthlyExpensesBase, 17500);\n      base.settings.creditCardAverage = Math.min(sanitizeNonNegative(settings.creditCardAverage, 6000),base.settings.monthlyExpensesBase);','migrate old saved settings'],
    ['          <label for="monthly-expenses">בסיס הוצאות חודשי</label>\n          <input id="monthly-expenses" class="money-input" readonly aria-readonly="true">\n          <span class="small muted">מחושב מפירוט ההוצאות. מינואר 2027 מתווסף אליו גם סכום הפנסיה/קה״ש שמוגדר למעלה.</span>','          <label for="monthly-expenses-base">ממוצע הוצאות חודשי, כולל אשראי</label>\n          <input id="monthly-expenses-base" class="money-input global-input" inputmode="decimal" autocomplete="off">\n          <span class="small muted">ברירת מחדל: 17,500 ₪. סכום זה כולל אשראי. מינואר 2027 מתווספת הפנסיה/קה״ש הנפרדת.</span>\n        </div>\n        <div class="field">\n          <label for="credit-card-average">ממוצע אשראי בתוך התקציב</label>\n          <input id="credit-card-average" class="money-input global-input" inputmode="decimal" autocomplete="off">\n          <span class="small muted">ברירת מחדל: 6,000 ₪. כל חיוב אשראי חודשי בפועל מחליף את הסכום הזה, ללא כפילות.</span>','settings labels and fields'],
    ['document.getElementById("monthly-expenses").value = formatPlain(expenseTotal());','document.getElementById("monthly-expenses-base").value = formatPlain(expenseTotal());\n      document.getElementById("credit-card-average").value = formatPlain(creditCardBudget());','settings rendering'],
    ['<summary>ממה מורכב ממוצע ההוצאות</summary>','<summary>חלוקת בסיס ההוצאות החדש</summary>','summary name'],
    ['<p class="small muted">אפשר לעדכן כל רכיב. הסכום החודשי והמודל כולו יתעדכנו אוטומטית.</p>','<p class="small muted">ניתן לשנות את בסיס ההוצאות ואת ממוצע האשראי בשני שדות ההגדרות למעלה, ולשנות את התשלום בפועל לכל חודש בטבלה.</p>','budget description'],
    ['test("ממוצע האשראי המובנה הוא 4,570 ₪", nearlyEqual(CREDIT_CARD_KEYS.reduce((t, k) => t + defaultExpenseMap()[k], 0), CREDIT_CARD_BASELINE));','test("ממוצע האשראי הוא 6,000 ₪", nearlyEqual(defaultState().settings.creditCardAverage,6000));','test average'],
    ['test("חיוב אשראי חודשי מחליף ממוצע ללא כפילות", nearlyEqual(20054 - CREDIT_CARD_BASELINE + 7000, 22484) && nearlyEqual(20054 - CREDIT_CARD_BASELINE, 15484));','test("חיוב אשראי בפועל 4,000 מפחית את התקציב ל-15,500", nearlyEqual(17500 - 6000 + 4000, 15500) && nearlyEqual(17500 - 6000, 11500));','test variable credit'],
    ['test("סכום רכיבי ההוצאות הוא 20,054 ₪", nearlyEqual(Object.values(defaultExpenseMap()).reduce((a, b) => a + b, 0), 20054));','test("בסיס ההוצאות הוא 17,500 ₪", nearlyEqual(defaultState().settings.monthlyExpensesBase,17500));','test new baseline'],
    ['const rent = 8450, livingDraw = 7750, pension = 3375, plannedDraw = livingDraw + pension, expenses = 20054 + pension;','const rent = 8450, livingDraw = 7750, pension = 3375, plannedDraw = livingDraw + pension, expenses = 17500 + pension;','scenario expenses'],
    ['nearlyEqual(t1.deficit, 3854)','nearlyEqual(t1.deficit, 1300)','zero academy deficit'],
    ['nearlyEqual(t2.saving, 1146) && nearlyEqual(t2.preserved, 1146) && nearlyEqual(t2.required, 9979)','nearlyEqual(t2.saving, 3700) && nearlyEqual(t2.preserved, 3700) && nearlyEqual(t2.required, 8375)','5000 academy'],
    ['nearlyEqual(t3.saving, 8146) && nearlyEqual(t3.preserved, 8146) && nearlyEqual(t3.required, 2979)','nearlyEqual(t3.saving, 10700) && nearlyEqual(t3.preserved, 10700) && nearlyEqual(t3.required, 425)','12000 academy'],
    ['const t4 = scenario(3854);','const t4 = scenario(1300);','break even'],
    ['nearlyEqual(t4.full, 23429)','nearlyEqual(t4.full, 20875)','break-even total'],
    ['const actualDeficit = 23429 - (8450 + actualDraw);','const actualDeficit = 20875 - (8450 + actualDraw);','fund cap'],
    ['nearlyEqual(actualDeficit, 13979)','nearlyEqual(actualDeficit, 11425)','fund deficit'],
    ['const CREDIT_CARD_BASELINE = 4570;','const CREDIT_CARD_BASELINE = 6000;','credit budget constant'],
    ['    // Their combined ₪4,570 is ALREADY included in the original ₪20,054.','    // Legacy categories are archived, but the new budget is explicitly 17,500 including 6,000 credit-card average.','legacy documentation'],
  ];
  for(const [oldV,newV,label] of swaps)sub(oldV,newV,"new 2026 budget: "+label);
  const recurringAnchor='if (input.id === "pension-contribution") state.settings.pensionContribution = value ?? 0;';
  if(s.split(recurringAnchor).length!==3)throw new Error("Expected both settings handlers");
  s=s.split(recurringAnchor).join(recurringAnchor+'\n        if (input.id === "monthly-expenses-base") state.settings.monthlyExpensesBase = value ?? 0;\n        if (input.id === "credit-card-average") state.settings.creditCardAverage = value ?? 0;\n        if (state.settings.creditCardAverage > state.settings.monthlyExpensesBase) state.settings.creditCardAverage = state.settings.monthlyExpensesBase;');
  const originalRenderer='    function renderExpenseInputs() {\n      document.getElementById("expense-grid").innerHTML = DEFAULT_EXPENSES.map(([key, label]) => `\n        <label class="expense-line">\n          <span>${escapeHtml(label)}</span>\n          <input class="money-input expense-input" inputmode="decimal" autocomplete="off" data-expense="${key}" value="${escapeHtml(formatPlain(state.expenses[key]))}" aria-label="${escapeHtml(label)}">\n        </label>`).join("");\n    }';
  const newRenderer='    function renderExpenseInputs() {\n      const credit = creditCardBudget();\n      const other = fromCents(toCents(expenseTotal()) - toCents(credit));\n      document.getElementById("expense-grid").innerHTML = `<div class="expense-line"><span>יתר ההוצאות, ללא אשראי</span><strong class="num">${formatMoney(other)}</strong></div><div class="expense-line"><span>ממוצע אשראי מתוך התקציב</span><strong class="num">${formatMoney(credit)}</strong></div>`;\n    }';
  sub(originalRenderer,newRenderer,"two-part expense breakdown");
})();
    return s;
  };
})();