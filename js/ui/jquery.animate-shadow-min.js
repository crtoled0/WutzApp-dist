"use strict";jQuery(function(r){function e(e,t,s){var n=[];return r.each(e,function(o){var l=[],a=e[o];if(o=t[o],a.b&&l.push("inset"),void 0!==o.left&&l.push(parseFloat(a.left+s*(o.left-a.left))+"px "+parseFloat(a.top+s*(o.top-a.top))+"px"),void 0!==o.blur&&l.push(parseFloat(a.blur+s*(o.blur-a.blur))+"px"),void 0!==o.a&&l.push(parseFloat(a.a+s*(o.a-a.a))+"px"),void 0!==o.color){var u="rgb"+(r.support.rgba?"a":"")+"("+parseInt(a.color[0]+s*(o.color[0]-a.color[0]),10)+","+parseInt(a.color[1]+s*(o.color[1]-a.color[1]),10)+","+parseInt(a.color[2]+s*(o.color[2]-a.color[2]),10);r.support.rgba&&(u+=","+parseFloat(a.color[3]+s*(o.color[3]-a.color[3]))),l.push(u+")")}n.push(l.join(" "))}),n.join(", ")}function t(e){function t(){var r=/^\s+/.exec(e.substring(o));null!==r&&0<r.length&&(o+=r[0].length)}function s(e){if(r.isPlainObject(e)){var t,s,n=0,o=[];for(r.isArray(e.color)&&(s=e.color,n=s.length),t=0;4>t;t++)t<n?o.push(s[t]):3===t?o.push(1):o.push(0)}return r.extend({left:0,top:0,blur:0,spread:0},e)}for(var n=[],o=0,l=e.length,a=s();o<l;)if(function(){var r=/^inset\b/.exec(e.substring(o));return null!==r&&0<r.length&&(a.b=!0,o+=r[0].length,!0)}())t();else if(function(){var r=/^(-?[0-9\.]+)(?:px)?\s+(-?[0-9\.]+)(?:px)?(?:\s+(-?[0-9\.]+)(?:px)?)?(?:\s+(-?[0-9\.]+)(?:px)?)?/.exec(e.substring(o));return null!==r&&0<r.length&&(a.left=parseInt(r[1],10),a.top=parseInt(r[2],10),a.blur=r[3]?parseInt(r[3],10):0,a.a=r[4]?parseInt(r[4],10):0,o+=r[0].length,!0)}())t();else if(function(){var r=/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(e.substring(o));return null!==r&&0<r.length?(a.color=[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16),1],o+=r[0].length,!0):null!==(r=/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(e.substring(o)))&&0<r.length?(a.color=[17*parseInt(r[1],16),17*parseInt(r[2],16),17*parseInt(r[3],16),1],o+=r[0].length,!0):null!==(r=/^rgb\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(e.substring(o)))&&0<r.length?(a.color=[parseInt(r[1],10),parseInt(r[2],10),parseInt(r[3],10),1],o+=r[0].length,!0):null!==(r=/^rgba\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(e.substring(o)))&&0<r.length&&(a.color=[parseInt(r[1],10),parseInt(r[2],10),parseInt(r[3],10),parseFloat(r[4])],o+=r[0].length,!0)}())t();else{if(!function(){var r=/^\s*,\s*/.exec(e.substring(o));return null!==r&&0<r.length&&(o+=r[0].length,!0)}())break;n.push(s(a)),a={}}return n.push(s(a)),n}r.extend(!0,r,{support:{rgba:function(){var e=r("script:first"),t=e.css("color"),s=!1;if(/^rgba/.test(t))s=!0;else try{s=t!==e.css("color","rgba(0, 0, 0, 0.5)").css("color"),e.css("color",t)}catch(r){}return e.removeAttr("style"),s}()}});var s,n=r("html").prop("style");r.each(["boxShadow","MozBoxShadow","WebkitBoxShadow"],function(r,e){if(void 0!==n[e])return s=e,!1}),s&&(r.Tween.propHooks.boxShadow={get:function(e){return r(e.elem).css(s)},set:function(n){var o,l=n.elem.style,a=t(r(n.elem)[0].style[s]||r(n.elem).css(s)),u=t(n.end),c=Math.max(a.length,u.length);for(o=0;o<c;o++)u[o]=r.extend({},a[o],u[o]),a[o]?"color"in a[o]&&!1!==r.isArray(a[o].color)||(a[o].color=u[o].color||[0,0,0,0]):a[o]=t("0 0 0 0 rgba(0,0,0,0)")[0];n.run=function(r){r=e(a,u,r),l[s]=r}}})});