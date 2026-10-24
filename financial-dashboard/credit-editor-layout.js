(function installRelocatedCreditEditor(){
  "use strict";
  window.relocateCreditCardEditor=function(html){
    let s=html;
    function need(v,label){if(!s.includes(v))throw new Error("Credit editor: missing "+label)}
    const base=s.includes('<label for="monthly-expenses-base">')?'monthly-expenses-base':'monthly-expenses';
    const pos=s.indexOf('<label for="'+base+'">');
    if(pos<0)throw new Error("Credit editor: expense field absent");
    const close=s.indexOf('</div>',pos);
    if(close<0)throw new Error("Credit editor: malformed expense field");
    const panel=`<div class="field credit-payment-panel">
       <label for="credit-card-month-select">אשראי ששולם בפועל בחודש</label>
       <select id="credit-card-month-select" class="credit-month-selector" aria-label="בחירת חודש לחיוב אשראי"></select>
       <input id="credit-card-paid-2026-09" class="money-input monthly-credit-input" inputmode="decimal" autocomplete="off" data-month="2026-09" placeholder="6,000" aria-label="חיוב אשראי ששולם בפועל">
       <span class="small muted">שדה ריק = 6,000 ממוצע; 0 = לא שולם. תשלום בפועל מחליף את הממוצע, לא מתווסף אליו.</span>
       <div class="credit-expense-result">הוצאות בחודש שנבחר: <strong class="num" id="selected-credit-expense"></strong></div>
      </div>`;
    s=s.slice(0,close+6)+panel+s.slice(close+6);
    const rowCell='${creditCardCell(row.month, row)}';
    need(rowCell,"monthly column");
    s=s.replace(rowCell,'');
    const sumCell='<td class="num" data-field="creditCardYearly">${formatPlain(summary.creditCardEffective)}</td>';
    need(sumCell,"annual column");
    s=s.replace(sumCell,'');
    const mobile=/<div class="mobile-metric"><span>אשראי ששולם בחודש \(ריק = ממוצע[\s\S]*?<\/div>/;
    if(mobile.test(s))s=s.replace(mobile,'<div class="mobile-metric"><span>אשראי ששולם / ממוצע</span><strong class="num">${formatMoney(row.creditCardEffective)}</strong></div>');
    const code=`    let selectedCreditMonth = (() => {
       const d=new Date();d.setMonth(d.getMonth()-1);
       const last=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
       return MONTHS.includes(last)?last:MONTHS[0];
      })();
      function renderSelectedCreditEditor() {
        const selector=document.getElementById('credit-card-month-select');
        const input=document.querySelector('.credit-payment-panel .monthly-credit-input');
        const total=document.getElementById('selected-credit-expense');
        if(!selector||!input||!total)return;
        if(!selector.options.length)selector.innerHTML=MONTHS.map(m=>\`<option value="\${m}">\${escapeHtml(monthLabel(m))}</option>\`).join('');
        selector.value=selectedCreditMonth;
        const actual=state.monthlyCreditCard[selectedCreditMonth]??null;
        input.id='credit-card-paid-'+selectedCreditMonth;
        input.dataset.month=selectedCreditMonth;
        input.value=actual===null?'':formatPlain(actual);
        input.placeholder=formatPlain(creditCardBudget());
        const effective=actual===null?creditCardBudget():actual;
        const pension=selectedCreditMonth>=FUND_START_MONTH?state.settings.pensionContribution:0;
        const monthCost=fromCents(toCents(expenseTotal())-toCents(creditCardBudget())+toCents(effective)+toCents(pension));
        total.textContent=formatMoney(monthCost);
        total.title=pension?'כולל פנסיה/קה"ש: '+formatMoney(pension):'לא כולל תוספת פנסיה/קה"ש';
      }
`;
    need('    function renderAll() {',"render function");
    s=s.replace('    function renderAll() {',code+'    function renderAll() {');
    const hook='      renderSettings();\n      renderExpenseInputs();';
    need(hook,"render hook");
    s=s.replace(hook,'      renderSettings();\n      renderSelectedCreditEditor();\n      renderExpenseInputs();');
    const onChange='    document.addEventListener("change", event => {\n      const target = event.target;';
    need(onChange,"events");
    s=s.replace(onChange,onChange+"\n      if(target.id === 'credit-card-month-select'){selectedCreditMonth=target.value;renderSelectedCreditEditor();return;}");
    const css='<style id="relocated-credit-style">.credit-payment-panel{background:#eff8f6!important;border:1px solid #b6d3ce!important}.credit-month-selector{width:100%;min-width:0;border:1px solid #8fa8b3;border-radius:7px;background:white;color:#17343b;padding:10px;font:inherit;font-size:15px}.credit-payment-panel input.monthly-credit-input{width:100%!important;min-width:0!important;box-sizing:border-box!important;font-size:20px!important;font-weight:700!important;padding:11px!important;text-align:right!important}.credit-expense-result{display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid #c3d8d4;margin-top:3px;padding-top:12px;font-size:13px}.credit-expense-result strong{font-size:19px;color:#173b45}.credit-payment-panel .muted{line-height:1.5}</style>';
    need('</head>',"head");
    s=s.replace('</head>',css+'</head>');
    return s;
  };
})();