(function openUniversityPatch(){
  "use strict";
  window.applyOpenUniversityPatch=function(html){
    const needle='{ key: "ariel", label: "אוניברסיטת אריאל" }\n    ];';
    if(!html.includes(needle))throw new Error("Cannot locate academy list for Open University");
    const replacement='{ key: "ariel", label: "אוניברסיטת אריאל" },\n      { key: "openUniversity", label: "האוניברסיטה הפתוחה" }\n    ];';
    return html.replace(needle,replacement);
  };
})();