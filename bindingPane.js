// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
  var oBindings = {
      oData : {},
      id: ""
  };
  var counter = 0;
  if ($0.id && sap){
      var domEl = sap.ui.getCore().byId($0.id);
  }
  if (domEl && domEl.mBindingInfos){
      oBindings.id = domEl.sId;
        jQuery.each(domEl.mBindingInfos, function(k,v){
            //console.log(v);
            counter++;
            oBindings.oData[k] = [];
            if(v.parts && v.parts.length) {
                 for (var i = 0; i < v.parts.length; i++){




                      oBindings.oData[k].push((v.parts[i].model ? v.parts[i].model : "Default Model") + ">" + v.parts[i].path);
                     //console.log(v.parts[i].model + ">" +v.parts[i].path);
                    // jQuery(el).append( '<span style="color:red" title="'+ modelStr  +'">' + modelStr  + '</span>' );
                 }
            }else if(v.model || v.path){
                oBindings.oData[k].push((v.model ? v.model + ">" : "") + v.path);
            }
        });
    }
  // Make a shallow copy with a null prototype, so that sidebar does not
  // expose prototype.
  if(!counter){
      oBindings = null;
  }
  return oBindings;
};
function toggleControls(){

    var _toggle = function(){

        function addCSSRule(sheet, selector, rules, index) {
            if("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else if("addRule" in sheet) {
                sheet.addRule(selector, rules, index);
            }
        }


        var style = document.getElementById("SAPUI5ControlsHighlightStyle");
        if (!style){
            var style = document.createElement("style");
            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")

            // WebKit hack :(
            style.appendChild(document.createTextNode(""));
            style.id = "SAPUI5ControlsHighlightStyle";
            // Add the <style> element to the page
            document.head.appendChild(style);
            addCSSRule(style.sheet, ".SAPUI5ControlsHighlight", "border:1px solid blue");

        }


        var nods = jQuery('.sapUiBody *');
        nods.each(function(i,el){
            var domEl = sap.ui.getCore().byId(el.id);
            if (domEl && domEl.mBindingInfos && Object.keys(domEl.mBindingInfos).length !== 0){
                 //console.log(domEl);
                 if(jQuery(el).hasClass("SAPUI5ControlsHighlight")){
                     jQuery(el).removeClass("SAPUI5ControlsHighlight");
                 }else{
                     jQuery(el).addClass("SAPUI5ControlsHighlight");
                 }

            }

        });
    };

    chrome.devtools.inspectedWindow.eval("(" + _toggle.toString() + ")()", function(){

    });

}
function updateElementProperties() {
    var results = document.getElementById("results");
    var noresult =document.getElementById("no-result");
    var btitle = document.getElementById("btitle");
    var controlId = document.getElementById("controlId");

    btitle.style.display = "block";
    var oElBindings = chrome.devtools.inspectedWindow.eval("(" + page_getProperties.toString() + ")()", function(data){
        //{"value":["Default Model>/firstName"],"enabled":["Default Model>/enabled"]}
        results.innerHTML = "";
        if(data){
            noresult.style.display = "none";
            controlId.innerHTML = data.id;
            for (k in data.oData) {
                var dt = document.createElement('dt');
                var dd = document.createElement('dd');
                dt.innerHTML = k + ": ";
                dd.innerHTML = data.oData[k].join(" , ");
                results.appendChild(dt);
                results.appendChild(dd);
            }
        }else{
            noresult.style.display = "block";
            controlId.innerHTML = "";
        }

    //sidebar.setObject( data, "Bindings" );
    });
}
updateElementProperties();
chrome.devtools.panels.elements.onSelectionChanged.addListener( updateElementProperties );
document.getElementById("tgbutton").addEventListener('click',function(){
    toggleControls();
});
