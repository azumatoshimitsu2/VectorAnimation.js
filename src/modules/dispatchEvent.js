export default function(el, event){
  if (document.createEvent) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true );
    return el.dispatchEvent(evt);
  } else {
    var evt = document.createEventObject();
    return el.fireEvent("on" + event, evt)
  }
};
