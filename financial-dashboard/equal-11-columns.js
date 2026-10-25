(function equalElevenColumnsRuntime(){
  'use strict';
  const BODY_COLUMNS = [2, 3, 4, 5, 6, 11, 12, 13, 16, 19, 22];
  const MONTH_WIDTH = 68;
  const MIN_COLUMN_WIDTH = 94;
  let observerBound = false;
  let pending = false;

  function sizeColumns(){
    const wrapper = document.querySelector('.table-wrap.desktop-table');
    const table = wrapper && wrapper.querySelector('table');
    if(!table) return;
    const headers = Array.from(table.querySelectorAll('thead tr:first-child th'));
    if(headers.length !== BODY_COLUMNS.length + 1) return;
    const wrapWidth = wrapper.clientWidth || window.innerWidth - 24;
    const each = Math.max(MIN_COLUMN_WIDTH, Math.floor((wrapWidth - MONTH_WIDTH - 2) / BODY_COLUMNS.length));
    const fullWidth = MONTH_WIDTH + each * BODY_COLUMNS.length;
    const applyWidth = (element, width) => {
      if(!element) return;
      const css = element.style;
      const px = width + 'px';
      if(css.getPropertyValue('width') !== px) css.setProperty('width', px, 'important');
      if(css.getPropertyValue('min-width') !== px) css.setProperty('min-width', px, 'important');
      if(css.getPropertyValue('max-width') !== px) css.setProperty('max-width', px, 'important');
      if(css.getPropertyValue('box-sizing') !== 'border-box') css.setProperty('box-sizing', 'border-box', 'important');
    };
    table.style.setProperty('table-layout','fixed','important');
    applyWidth(table,fullWidth);
    let cols = table.querySelector(':scope > colgroup[data-equal-eleven="1"]');
    if(!cols){
      cols=document.createElement('colgroup');
      cols.dataset.equalEleven='1';
      table.insertBefore(cols,table.firstChild);
    }
    if(cols.children.length !== 12){
      cols.replaceChildren();
      for(let k=0;k<12;k++) cols.appendChild(document.createElement('col'));
    }
    Array.from(cols.children).forEach((col,i)=>col.style.setProperty('width',(i===0?MONTH_WIDTH:each)+'px','important'));
    applyWidth(headers[0],MONTH_WIDTH);
    headers.slice(1).forEach(th=>applyWidth(th,each));
    for(const tr of table.querySelectorAll('tbody tr')){
      const tds=tr.children;
      if(tds.length < 22) continue;
      applyWidth(tds[0],MONTH_WIDTH);
      BODY_COLUMNS.forEach(pos=>applyWidth(tds[pos-1],each));
    }
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;sizeColumns()});
  }
  const boot=()=>{
    const tbody=document.getElementById('monthly-body');
    if(!tbody){schedule();return;}
    sizeColumns();
    if(!observerBound){
      observerBound=true;
      new MutationObserver(schedule).observe(tbody,{childList:true});
      window.addEventListener('resize',schedule,{passive:true});
    }
  };
  boot();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  window.addEventListener('load',boot,{once:true});
})();