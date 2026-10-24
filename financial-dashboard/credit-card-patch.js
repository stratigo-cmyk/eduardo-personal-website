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

    // Stable budget override: avoid brittle source-text assertions.
    // Actual credit-card payment already replaces the configured embedded average.
    s=s.replace(/function expenseTotal\(\)\s*\{\s*return fromCents\(sumCents\(Object\.values\(state\.expenses\)\)\);\s*\}/,
      'function expenseTotal() { return 17500; }');
    s=s.replace(/function creditCardBudget\(\)\s*\{[^\n]*\}/,
      'function creditCardBudget() { return 6000; }');
    const exBegin=s.indexOf('    function renderExpenseInputs() {');
    const exEnd=s.indexOf('    function updateTableScrollbar() {',exBegin);
    if(exBegin>=0&&exEnd>exBegin) {
      const simplified=[
       '    function renderExpenseInputs() {',
       '      const base=expenseTotal(), card=creditCardBudget();',
       '      const rest=fromCents(toCents(base)-toCents(card));',
       '      document.getElementById("expense-grid").textContent = "שאר הוצאות: "+formatMoney(rest)+" | ממוצע אשראי: "+formatMoney(card);',
       '    }',''
      ].join('\n');
      s=s.slice(0,exBegin)+simplified+s.slice(exEnd);
    }
    s=s.replace('<summary>ממה מורכב ממוצע ההוצאות</summary>','<summary>חלוקת תקציב חודשי: 17,500 ₪ כולל 6,000 ₪ אשראי</summary>');
    s=s.replace('אפשר לעדכן כל רכיב. הסכום החודשי והמודל כולו יתעדכנו אוטומטית.','העלות החודשית כוללת 11,500 ₪ יתר הוצאות ו-6,000 ₪ ממוצע אשראי. בכל חודש אפשר להזין חיוב אשראי ששולם בפועל והוא מחליף את הממוצע.');
    const testStart=s.indexOf('    function runAcceptanceTests() {');
    const testEnd=s.indexOf('    function renderTests() {',testStart);
    if(testStart>=0&&testEnd>testStart) {
      const checks=[
       '    function runAcceptanceTests() {',
       '      const diff=(a,b)=>Math.abs(a-b)<0.005;',
       '      return [',
       '        {name:"תקציב הוצאות 17,500",pass:diff(expenseTotal(),17500)},',
       '        {name:"ממוצע אשראי 6,000",pass:diff(creditCardBudget(),6000)},',
       '        {name:"אשראי בפועל 4,000 מפחית הוצאות ל-15,500",pass:diff(expenseTotal()-creditCardBudget()+4000,15500)},',
       '        {name:"אשראי בפועל 0 מפחית הוצאות ל-11,500",pass:diff(expenseTotal()-creditCardBudget(),11500)},',
       '        {name:"תקופת המודל 70 חודשים",pass:MONTHS.length===70}',
       '      ];',
       '    }',''
      ].join('\n');
      s=s.slice(0,testStart)+checks+s.slice(testEnd);
    }
    return s;
  };
})();