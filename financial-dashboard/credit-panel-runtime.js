(function activateCreditPanel(){
  'use strict';
  const css=document.createElement('style');
  css.textContent=[
    '.desktop-table tbody td[data-field="creditCardActual"],.desktop-table tbody td[data-field="creditCardYearly"],.desktop-table thead th[data-credit-header]{display:none!important}',
    '.credit-payment-panel{background:#eff7f5!important;border:1px solid #c6dcd9!important;border-radius:12px!important;padding:14px!important;display:flex!important;flex-direction:column!important;gap:10px!important;min-width:0!important}',
    '.credit-payment-panel label{font-weight:800;color:#183942}',
    '.credit-payment-panel select,.credit-payment-panel .credit-paid-value{box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;height:44px!important;border:1px solid #93a9b4!important;border-radius:8px!important;background:#fff!important;color:#173942!important;padding:8px 12px!important;font-size:16px!important;text-align:right!important}',
    '.credit-payment-panel .credit-paid-value{font-size:21px!important;font-weight:650!important}',
    '.credit-payment-panel .credit-total{font-size:13px;border-top:1px solid #c5d9d5;padding-top:10px;display:flex;gap:8px;align-items:center;justify-content:space-between}',
    '.credit-payment-panel .credit-total strong{font-size:20px;color:#163d43}',
    '.credit-payment-panel .credit-help{font-size:12px;line-height:1.5;color:#5b6e75}',
    '.credit-payment-panel .credit-saved{font-size:11px;color:#08756b;min-height:13px}'
  ].join('');
  document.head.appendChild(css);
  let month=null, pending=0, scheduled=0;
  const fmt=x=>Number.isFinite(x)?new Intl.NumberFormat('he-IL',{maximumFractionDigits:2}).format(x):'';
  const number=x=>{const s=String(x??'').replace(/[₪,\s]/g,'').replace(/[−–﹣－]/g,'-');return s===''?null:Number(s)};
  const originals=()=>Array.from(document.querySelectorAll('.desktop-table tbody input.monthly-credit-input[data-month]'));
  function original(m){return originals().find(el=>el.dataset.month===m)}
  function init(){
    const base=document.getElementById('monthly-expenses-base')||document.getElementById('monthly-expenses');
    const parent=base&&base.closest('.field');
    if(!parent||!originals().length)return false;
    let panel=document.getElementById('monthly-credit-panel');
    if(!panel){
      panel=document.createElement('div');
      panel.className='field credit-payment-panel';
      panel.id='monthly-credit-panel';
      panel.innerHTML='<label for="credit-month-selector">אשראי ששולם בפועל בחודש</label>'
        +'<select id="credit-month-selector" aria-label="בחר חודש לתשלום אשראי"></select>'
        +'<input class="credit-paid-value" id="credit-paid-value" inputmode="decimal" autocomplete="off" aria-label="הסכום ששולם בפועל בכרטיס האשראי">'
        +'<div class="credit-help">שדה ריק = ממוצע 6,000. הזנת 0 פירושה שלא שולם אשראי. הסכום מחליף את הממוצע בחודש שנבחר.</div>'
        +'<div class="credit-total"><span>הוצאות החודש</span><strong id="credit-month-expenses"></strong></div>'
        +'<span id="credit-save-status" class="credit-saved"></span>';
      parent.insertAdjacentElement('afterend',panel);
      const sel=panel.querySelector('#credit-month-selector');
      sel.addEventListener('change',()=>{clearTimeout(pending);month=sel.value;refresh();});
      const input=panel.querySelector('#credit-paid-value');
      input.addEventListener('input',()=>{
        const v=number(input.value);
        if(v!==null&&(!Number.isFinite(v)||v<0)){input.setCustomValidity('יש להזין סכום חיובי או 0');return}
        input.setCustomValidity('');
        showTotal();
        document.getElementById('credit-save-status').textContent='שומר...';
        clearTimeout(pending);
        pending=setTimeout(commit,500);
      });
      input.addEventListener('change',()=>{clearTimeout(pending);commit()});
      input.addEventListener('blur',()=>{clearTimeout(pending);commit()});
      sel.innerHTML=originals().map(el=>'<option value="'+el.dataset.month+'">'+
        new Intl.DateTimeFormat('he-IL',{month:'long',year:'numeric'}).format(new Date(el.dataset.month+'-01T12:00:00'))+'</option>').join('');
      const prev=new Date();prev.setDate(1);prev.setMonth(prev.getMonth()-1);
      const key=prev.getFullYear()+'-'+String(prev.getMonth()+1).padStart(2,'0');
      month=original(key)?key:originals()[0].dataset.month;
      sel.value=month;
      const body=document.getElementById('monthly-body');
      if(body){
        new MutationObserver(()=>{clearTimeout(scheduled);scheduled=setTimeout(()=>{if(document.activeElement!==input)refresh();else showTotal()},60)})
          .observe(body,{childList:true});
      }
      document.addEventListener('change',e=>{
        if(e.target.id==='credit-month-selector'||e.target.id==='credit-paid-value')return;
        setTimeout(()=>{if(document.activeElement!==input)refresh();else showTotal()},100);
      },false);
    }
    refresh();
    return true;
  }
  function showTotal(){
    const editor=document.getElementById('credit-paid-value');
    const out=document.getElementById('credit-month-expenses');
    if(!editor||!out)return;
    const n=number(editor.value);
    const base=number((document.getElementById('monthly-expenses-base')||document.getElementById('monthly-expenses'))?.value)??17500;
    const average=number(document.getElementById('credit-card-average')?.value)??6000;
    const pension=month>='2027-01'?(number(document.getElementById('pension-contribution')?.value)??3375):0;
    const effective=n===null?average:Math.max(0,n);
    out.textContent=fmt(base-average+effective+pension);
    out.title=pension?'כולל הפקדות פנסיה וקרן השתלמות בנפרד: '+fmt(pension):'ללא הפקדות פנסיה/קרן השתלמות';
  }
  function refresh(){
    const field=document.getElementById('credit-paid-value');
    if(!field)return;
    const val=original(month);
    if(!val)return;
    field.value=val.value||'';
    const average=number(document.getElementById('credit-card-average')?.value)??6000;
    field.placeholder=fmt(average);
    document.getElementById('credit-save-status').textContent='';
    showTotal();
  }
  function commit(){
    const field=document.getElementById('credit-paid-value'),target=original(month);
    if(!field||!target)return;
    const n=number(field.value);
    if(n!==null&&(!Number.isFinite(n)||n<0))return;
    // Commit to the application's original monthly data input, not a separate store.
    target.value=field.value.trim();
    target.dispatchEvent(new Event('input',{bubbles:true}));
    target.dispatchEvent(new Event('change',{bubbles:true}));
    document.getElementById('credit-save-status').textContent='נשמר';
    showTotal();
  }
  if(!init()){
    let attempts=0;
    const t=setInterval(()=>{if(init()||++attempts>=30)clearInterval(t)},200);
  }
})();