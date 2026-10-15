var Je=Object.defineProperty;var Ze=Object.getOwnPropertyDescriptor;var _=(r,t,e,i)=>{for(var n=i>1?void 0:i?Ze(t,e):t,s=r.length-1,o;s>=0;s--)(o=r[s])&&(n=(i?o(t,e,n):o(n))||n);return i&&n&&Je(t,e,n),n};var B=globalThis,K=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),ye=new WeakMap,z=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(K&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ye.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ye.set(e,t))}return t}toString(){return this.cssText}},$e=r=>new z(typeof r=="string"?r:r+"",void 0,te),ie=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,n,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+r[s+1],r[0]);return new z(e,r,te)},xe=(r,t)=>{if(K)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),n=B.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,r.appendChild(i)}},ne=K?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return $e(e)})(r):r;var{is:Qe,defineProperty:Xe,getOwnPropertyDescriptor:et,getOwnPropertyNames:tt,getOwnPropertySymbols:it,getPrototypeOf:nt}=Object,G=globalThis,ke=G.trustedTypes,rt=ke?ke.emptyScript:"",st=G.reactiveElementPolyfillSupport,N=(r,t)=>r,L={toAttribute(r,t){switch(t){case Boolean:r=r?rt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},V=(r,t)=>!Qe(r,t),we={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),G.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=we){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(t,i,e);n!==void 0&&Xe(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){let{get:n,set:s}=et(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let a=n?.call(this);s?.call(this,o),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??we}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let e=this.properties,i=[...tt(e),...it(e)];for(let n of i)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,n]of e)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let n=this._$Eu(e,i);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let n of i)e.unshift(ne(n))}else t!==void 0&&e.push(ne(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:L).toAttribute(e,i.type);this._$Em=t,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){let i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let s=i.getPropertyOptions(n),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:L;this._$Em=n;let a=o.fromAttribute(e,s.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(t!==void 0){let o=this.constructor;if(n===!1&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??V)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),s!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,s]of i){let{wrapped:o}=s,a=this[n];o!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,s,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[N("elementProperties")]=new Map,x[N("finalized")]=new Map,st?.({ReactiveElement:x}),(G.reactiveElementVersions??=[]).push("2.1.2");var de=globalThis,Se=r=>r,Y=de.trustedTypes,Ae=Y?Y.createPolicy("lit-html",{createHTML:r=>r}):void 0,Re="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,He="?"+k,ot=`<${He}>`,M=document,I=()=>M.createComment(""),j=r=>r===null||typeof r!="object"&&typeof r!="function",ue=Array.isArray,at=r=>ue(r)||typeof r?.[Symbol.iterator]=="function",re=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ee=/-->/g,Me=/>/g,A=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ce=/'/g,Te=/"/g,Ue=/^(?:script|style|textarea|title)$/i,he=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),h=he(1),pe=he(2),kt=he(3),C=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Pe=new WeakMap,E=M.createTreeWalker(M,129);function Oe(r,t){if(!ue(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ae!==void 0?Ae.createHTML(t):t}var ct=(r,t)=>{let e=r.length-1,i=[],n,s=t===2?"<svg>":t===3?"<math>":"",o=F;for(let a=0;a<e;a++){let c=r[a],u,d,l=-1,m=0;for(;m<c.length&&(o.lastIndex=m,d=o.exec(c),d!==null);)m=o.lastIndex,o===F?d[1]==="!--"?o=Ee:d[1]!==void 0?o=Me:d[2]!==void 0?(Ue.test(d[2])&&(n=RegExp("</"+d[2],"g")),o=A):d[3]!==void 0&&(o=A):o===A?d[0]===">"?(o=n??F,l=-1):d[1]===void 0?l=-2:(l=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?A:d[3]==='"'?Te:Ce):o===Te||o===Ce?o=A:o===Ee||o===Me?o=F:(o=A,n=void 0);let f=o===A&&r[a+1].startsWith("/>")?" ":"";s+=o===F?c+ot:l>=0?(i.push(u),c.slice(0,l)+Re+c.slice(l)+k+f):c+k+(l===-2?a:f)}return[Oe(r,s+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},q=class r{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0,a=t.length-1,c=this.parts,[u,d]=ct(t,e);if(this.el=r.createElement(u,i),E.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(n=E.nextNode())!==null&&c.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let l of n.getAttributeNames())if(l.endsWith(Re)){let m=d[o++],f=n.getAttribute(l).split(k),g=/([.?@])?(.*)/.exec(m);c.push({type:1,index:s,name:g[2],strings:f,ctor:g[1]==="."?oe:g[1]==="?"?ae:g[1]==="@"?ce:P}),n.removeAttribute(l)}else l.startsWith(k)&&(c.push({type:6,index:s}),n.removeAttribute(l));if(Ue.test(n.tagName)){let l=n.textContent.split(k),m=l.length-1;if(m>0){n.textContent=Y?Y.emptyScript:"";for(let f=0;f<m;f++)n.append(l[f],I()),E.nextNode(),c.push({type:2,index:++s});n.append(l[m],I())}}}else if(n.nodeType===8)if(n.data===He)c.push({type:2,index:s});else{let l=-1;for(;(l=n.data.indexOf(k,l+1))!==-1;)c.push({type:7,index:s}),l+=k.length-1}s++}}static createElement(t,e){let i=M.createElement("template");return i.innerHTML=t,i}};function T(r,t,e=r,i){if(t===C)return t;let n=i!==void 0?e._$Co?.[i]:e._$Cl,s=j(t)?void 0:t._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),s===void 0?n=void 0:(n=new s(r),n._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=n:e._$Cl=n),n!==void 0&&(t=T(r,n._$AS(r,t.values),n,i)),t}var se=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??M).importNode(e,!0);E.currentNode=n;let s=E.nextNode(),o=0,a=0,c=i[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new W(s,s.nextSibling,this,t):c.type===1?u=new c.ctor(s,c.name,c.strings,this,t):c.type===6&&(u=new le(s,this,t)),this._$AV.push(u),c=i[++a]}o!==c?.index&&(s=E.nextNode(),o++)}return E.currentNode=M,n}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},W=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),j(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):at(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=q.createElement(Oe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{let s=new se(n,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(t){let e=Pe.get(t.strings);return e===void 0&&Pe.set(t.strings,e=new q(t)),e}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,n=0;for(let s of t)n===e.length?e.push(i=new r(this.O(I()),this.O(I()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=Se(t).nextSibling;Se(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(t,e=this,i,n){let s=this.strings,o=!1;if(s===void 0)t=T(this,t,e,0),o=!j(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{let a=t,c,u;for(t=s[0],c=0;c<s.length-1;c++)u=T(this,a[i+c],e,c),u===C&&(u=this._$AH[c]),o||=!j(u)||u!==this._$AH[c],u===p?t=p:t!==p&&(t+=(u??"")+s[c+1]),this._$AH[c]=u}o&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},oe=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},ae=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},ce=class extends P{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??p)===C)return;let i=this._$AH,n=t===p&&i!==p||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==p&&(i===p||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},le=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var lt=de.litHtmlPolyfillSupport;lt?.(q,W),(de.litHtmlVersions??=[]).push("3.3.3");var De=(r,t,e)=>{let i=e?.renderBefore??t,n=i._$litPart$;if(n===void 0){let s=e?.renderBefore??null;i._$litPart$=n=new W(t.insertBefore(I(),s),s,void 0,e??{})}return n._$AI(r),n};var me=globalThis,$=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=De(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};$._$litElement$=!0,$.finalized=!0,me.litElementHydrateSupport?.({LitElement:$});var dt=me.litElementPolyfillSupport;dt?.({LitElement:$});(me.litElementVersions??=[]).push("4.2.2");var J=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var ut={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:V},ht=(r=ut,t,e)=>{let{kind:i,metadata:n}=e,s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),s.set(e.name,r),i==="accessor"){let{name:o}=e;return{set(a){let c=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,c,r,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,r,a),a}}}if(i==="setter"){let{name:o}=e;return function(a){let c=this[o];t.call(this,a),this.requestUpdate(o,c,r,!0,a)}}throw Error("Unsupported decorator location: "+i)};function R(r){return(t,e)=>typeof e=="object"?ht(r,t,e):((i,n,s)=>{let o=n.hasOwnProperty(s);return n.constructor.createProperty(s,i),o?Object.getOwnPropertyDescriptor(n,s):void 0})(r,t,e)}function y(r){return R({...r,state:!0,attribute:!1})}var fe=["header","vitals","history","system","actions"];var v=r=>({domain:"sensor",uniquePrefix:"",slug:r}),w=r=>({domain:"button",uniquePrefix:"btn_",slug:r}),ze=r=>({domain:"number",uniquePrefix:"num_",slug:r}),Ne={cpu_temp:v("cpu_temperature"),gpu_temp:v("gpu_temperature"),nvme_temp:v("nvme_temperature"),gpu_clock:v("gpu_clock"),pump_rpm:v("pump_speed"),ram_used:v("ram_used"),swap_used:v("swap_used"),disk_used:v("home_disk_used"),uptime:v("uptime"),gpu_load:v("gpu_load"),current_game:v("current_steam_game"),cu_active:v("active_cus_config"),cfg_voltage:v("config_voltage_at_max_clock"),throttle_temp:v("gpu_throttle_temperature"),logi_battery:v("logitech_battery"),sleep:w("sleep"),reboot:w("reboot"),shutdown:w("shut_down"),close_game:w("close_current_game"),restart_steam:w("restart_steam"),to_desktop:w("switch_to_desktop_mode"),to_gamemode:w("switch_to_game_mode"),gpu_reset:w("advanced_reset_gpu_clock_range"),gpu_max_clock:ze("advanced_gpu_max_clock"),gpu_min_clock:ze("advanced_gpu_min_clock")};function _e(r,t){let e=r.filter(n=>n.device_id===t),i={};for(let n of Object.keys(Ne)){let s=Ne[n],o=`${s.uniquePrefix}${n}`,a=e.filter(d=>d.entity_id.startsWith(`${s.domain}.`)),c=a.find(d=>d.unique_id!==void 0&&(d.unique_id===o||d.unique_id.endsWith(`_${o}`)));if(c){i[n]=c.entity_id;continue}let u=a.find(d=>pt(d.entity_id,s.slug));u&&(i[n]=u.entity_id)}return i}function pt(r,t){let e=r.slice(r.indexOf(".")+1);return e===t||e.endsWith(`_${t}`)||new RegExp(`_${t}_\\d+$`).test(e)}function Le(r){return r.some(t=>t.startsWith("button.")&&t.endsWith("_close_current_game"))}function Fe(r){if(r===void 0||r==="unknown"||r==="unavailable"||r==="")return;let t=Number(r);return Number.isFinite(t)?t:void 0}function H(r,t,e){return r===void 0?"ok":r>=e?"crit":r>=t?"warn":"ok"}function mt(r,t,e){return Math.min(e,Math.max(t,r))}function Ie(r,t,e){return r===void 0||e<=t?0:mt((r-t)/(e-t),0,1)}function je(r){if(r===void 0)return"\u2013";let t=Math.floor(r),e=Math.floor(t/86400),i=Math.floor(t%86400/3600),n=Math.floor(t%3600/60);return e>0?`${e}d ${i}h`:i>0?`${i}h ${n}m`:`${n}m`}function Q(r,t=0){return r===void 0?"\u2013":r.toFixed(t)}function qe(r,t){let e=Math.round(r/t.step)*t.step;return Math.min(t.max,Math.max(t.min,e))}function ge(r,t,e,i,n){return Number.isFinite(t)?t<e.min||t>e.max?{ok:!1,reason:"range"}:t%e.step!==0?{ok:!1,reason:"step"}:r==="Max"&&i!==void 0&&t<i?{ok:!1,reason:"order"}:r==="Min"&&n!==void 0&&t>n?{ok:!1,reason:"order"}:{ok:!0,value:t}:{ok:!1,reason:"nan"}}function We(r){if(!Array.isArray(r))return[];let t=[];for(let e of r){let i=e.s??e.state,n=Number(i);if(i===void 0||i==="unknown"||i==="unavailable"||!Number.isFinite(n))continue;let s;typeof e.lu=="number"?s=e.lu*1e3:typeof e.lc=="number"?s=e.lc*1e3:typeof e.last_updated=="string"&&(s=Date.parse(e.last_updated)),!(s===void 0||!Number.isFinite(s))&&t.push({t:s,v:n})}return t}function Be(r,t){if(r.length<=t)return r;let e=r.length/t,i=[];for(let n=0;n<t;n++){let s=r.slice(Math.floor(n*e),Math.floor((n+1)*e));if(!s.length)continue;let o=s.reduce((a,c)=>c.v>a.v?c:a);i.push({t:s[Math.floor(s.length/2)].t,v:o.v})}return i}function Ke(r,t){if(r.length<2)return"";let e=t.tMax-t.tMin||1,i=t.vMax-t.vMin||1;return r.map((n,s)=>{let o=(n.t-t.tMin)/e*t.width,a=t.height-(n.v-t.vMin)/i*t.height;return`${s===0?"M":"L"}${o.toFixed(1)},${a.toFixed(1)}`}).join("")}var X={en:{online:"Online",offline:"Asleep / off",off_title:"The machine is off or asleep",off_hint:"Controls are locked. Use Wake up to turn it on.",now_playing:"Now playing",idle:"Idle",uptime:"Uptime",cpu:"CPU",gpu:"GPU",gpu_load:"GPU load",nvme:"NVMe",clock:"Clock",load:"Load",temperatures:"Temperatures",clock_and_load:"GPU clock & load",system:"System",pump:"Pump",ram:"RAM",swap:"Swap",disk:"Disk",cus:"CUs",throttle:"Throttle at",battery:"Controller",actions:"Power & session",wake:"Wake up",sleep:"Sleep",reboot:"Reboot",shutdown:"Shut down",game_mode:"Game mode",desktop:"Desktop",restart_steam:"Restart Steam",close_game:"Close game",confirm:"Confirm",cancel:"Cancel",sent:"Sent",failed:"Failed",no_wol:"Set wol_entity to enable Wake",confirm_sleep:"Put Bazzite to sleep?",confirm_reboot:"Reboot Bazzite now? Running games will be lost.",confirm_shutdown:"Shut down Bazzite? Wake up works over the network.",confirm_game_mode:"Switch to Game mode? This ends the current session.",confirm_desktop:"Switch to Desktop mode? This ends the current session.",confirm_restart_steam:"Restart Steam? The running game will close.",confirm_close_game:"Close the running game? Unsaved progress will be lost.",confirm_gpu_reset:"Reset the GPU clock range to the governor defaults?",advanced:"Advanced",advanced_title:"GPU clock range",advanced_warning:"Danger zone. These change the GPU governor's range at runtime. Limits are enforced on the machine. Changes are not saved: a reboot or governor restart resets them. Watch temperatures when raising the max.",max_clock:"Max clock",min_clock:"Min clock",apply:"Apply",reset:"Reset range",readonly_values:"Read-only tuning values",readonly_note:"Voltage and CU count cannot be changed from here by design: a bad value can hang the machine.",voltage:"Config voltage at max clock",active_cus:"Active CUs (config)",err_range:"Outside the allowed range",err_step:"Must be a multiple of the step",err_order:"Max must not be below Min",err_nan:"Enter a number",not_configured:"Select a BC-250 device in the card configuration.",not_found:"Device not found or has no BC-250 entities.",unavailable:"unavailable"},de:{online:"Online",offline:"Standby / aus",off_title:"Der Rechner ist aus oder im Standby",off_hint:"Steuerung gesperrt. Mit Aufwecken einschalten.",now_playing:"L\xE4uft gerade",idle:"Leerlauf",uptime:"Laufzeit",cpu:"CPU",gpu:"GPU",gpu_load:"GPU-Last",nvme:"NVMe",clock:"Takt",load:"Last",temperatures:"Temperaturen",clock_and_load:"GPU-Takt & Last",system:"System",pump:"Pumpe",ram:"RAM",swap:"Swap",disk:"Disk",cus:"CUs",throttle:"Drosselung ab",battery:"Controller",actions:"Energie & Sitzung",wake:"Aufwecken",sleep:"Standby",reboot:"Neustart",shutdown:"Herunterfahren",game_mode:"Spielmodus",desktop:"Desktop",restart_steam:"Steam neu starten",close_game:"Spiel schlie\xDFen",confirm:"Best\xE4tigen",cancel:"Abbrechen",sent:"Gesendet",failed:"Fehlgeschlagen",no_wol:"wol_entity setzen, um Aufwecken zu aktivieren",confirm_sleep:"Bazzite in Standby versetzen?",confirm_reboot:"Bazzite jetzt neu starten? Laufende Spiele gehen verloren.",confirm_shutdown:"Bazzite herunterfahren? Aufwecken geht \xFCber das Netzwerk.",confirm_game_mode:"In den Spielmodus wechseln? Die aktuelle Sitzung wird beendet.",confirm_desktop:"In den Desktop-Modus wechseln? Die aktuelle Sitzung wird beendet.",confirm_restart_steam:"Steam neu starten? Das laufende Spiel wird geschlossen.",confirm_close_game:"Laufendes Spiel schlie\xDFen? Nicht gespeicherter Fortschritt geht verloren.",confirm_gpu_reset:"GPU-Taktbereich auf die Standardwerte zur\xFCcksetzen?",advanced:"Erweitert",advanced_title:"GPU-Taktbereich",advanced_warning:"Gefahrenbereich. Dies \xE4ndert den Bereich des GPU-Governors zur Laufzeit. Grenzen werden auf dem Rechner erzwungen. \xC4nderungen werden nicht gespeichert: Neustart oder Governor-Neustart setzt sie zur\xFCck. Temperaturen beobachten, wenn das Maximum erh\xF6ht wird.",max_clock:"Max. Takt",min_clock:"Min. Takt",apply:"\xDCbernehmen",reset:"Bereich zur\xFCcksetzen",readonly_values:"Schreibgesch\xFCtzte Tuning-Werte",readonly_note:"Spannung und CU-Anzahl lassen sich hier bewusst nicht \xE4ndern: ein falscher Wert kann den Rechner h\xE4ngen lassen.",voltage:"Konfigurierte Spannung bei max. Takt",active_cus:"Aktive CUs (Konfig)",err_range:"Au\xDFerhalb des erlaubten Bereichs",err_step:"Muss ein Vielfaches der Schrittweite sein",err_order:"Max darf nicht unter Min liegen",err_nan:"Zahl eingeben",not_configured:"W\xE4hle in der Kartenkonfiguration ein BC-250-Ger\xE4t aus.",not_found:"Ger\xE4t nicht gefunden oder ohne BC-250-Entit\xE4ten.",unavailable:"nicht verf\xFCgbar"}};function ee(r){let t=(r??"en").slice(0,2).toLowerCase(),e=X[t]??X.en;return i=>e[i]??X.en[i]??i}var Ge=ie`
  :host {
    --bc-accent: var(--bc250-accent, var(--primary-color, #03a9f4));
    --bc-ok: #43a047;
    --bc-warn: #fb8c00;
    --bc-crit: #e53935;
    --bc-text: var(--primary-text-color, #e5e5e5);
    --bc-dim: var(--secondary-text-color, #9e9e9e);
    --bc-tile: var(--bc250-tile, rgba(127, 127, 127, 0.12));
    display: block;
  }
  ha-card {
    padding: 16px;
    background: var(--bc250-bg, var(--ha-card-background, var(--card-background-color)));
    overflow: hidden;
  }
  ha-card.glass {
    background: rgba(40, 40, 46, 0.45);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  section + section {
    margin-top: 18px;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--bc-dim);
  }

  /* header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .header .title {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--bc-text);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    background: var(--bc-tile);
    color: var(--bc-dim);
  }
  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bc-dim);
  }
  .badge.on .dot {
    background: var(--bc-ok);
    box-shadow: 0 0 6px var(--bc-ok);
  }
  .spacer {
    flex: 1;
  }
  .meta {
    font-size: 0.85rem;
    color: var(--bc-dim);
  }
  .now {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--bc-tile);
    color: var(--bc-text);
  }
  .now ha-icon {
    color: var(--bc-accent);
  }
  .now .label {
    font-size: 0.75rem;
    color: var(--bc-dim);
  }

  /* vitals */
  .vitals {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 10px;
  }
  .gauge {
    position: relative;
    padding: 8px 4px 10px;
    text-align: center;
    border-radius: 14px;
    background: var(--bc-tile);
  }
  .gauge svg {
    width: 100%;
    max-width: 110px;
    transform: rotate(135deg);
  }
  .gauge .track {
    stroke: rgba(127, 127, 127, 0.25);
  }
  .gauge .arc {
    transition: stroke-dasharray 0.6s ease, stroke 0.3s;
    stroke-linecap: round;
  }
  .gauge .arc.ok {
    stroke: var(--bc-ok);
  }
  .gauge .arc.warn {
    stroke: var(--bc-warn);
  }
  .gauge .arc.crit {
    stroke: var(--bc-crit);
  }
  .gauge .value {
    position: absolute;
    left: 0;
    right: 0;
    top: 34%;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--bc-text);
  }
  .gauge .value small {
    font-size: 0.7rem;
    color: var(--bc-dim);
  }
  .gauge .name {
    font-size: 0.78rem;
    color: var(--bc-dim);
  }

  /* history */
  .charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 10px;
  }
  .chart {
    padding: 10px 12px;
    border-radius: 14px;
    background: var(--bc-tile);
  }
  .chart .ctitle {
    font-size: 0.8rem;
    color: var(--bc-dim);
    margin-bottom: 4px;
  }
  .chart svg {
    width: 100%;
    height: 70px;
    display: block;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
    font-size: 0.72rem;
    color: var(--bc-dim);
  }
  .legend i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
  }

  /* system tiles */
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 8px;
  }
  .tile {
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--bc-tile);
  }
  .tile .tname {
    font-size: 0.72rem;
    color: var(--bc-dim);
  }
  .tile .tval {
    font-size: 1rem;
    color: var(--bc-text);
  }
  .bar {
    height: 4px;
    margin-top: 6px;
    border-radius: 2px;
    background: rgba(127, 127, 127, 0.25);
    overflow: hidden;
  }
  .bar > div {
    height: 100%;
    background: var(--bc-accent);
    transition: width 0.6s ease;
  }
  .bar.warn > div {
    background: var(--bc-warn);
  }
  .bar.crit > div {
    background: var(--bc-crit);
  }

  /* actions */
  .actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 8px;
  }
  button.act {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border: none;
    border-radius: 12px;
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    color: var(--bc-text);
    background: var(--bc-tile);
    transition: background 0.2s, transform 0.1s;
  }
  button.act:hover:not([disabled]) {
    background: color-mix(in srgb, var(--c, var(--bc-accent)) 25%, transparent);
  }
  button.act:active:not([disabled]) {
    transform: scale(0.97);
  }
  button.act ha-icon {
    color: var(--c, var(--bc-accent));
  }
  button.act[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  button.act.sent {
    outline: 2px solid var(--bc-ok);
  }
  button.act.failed {
    outline: 2px solid var(--bc-crit);
  }

  /* off state: data is stale and locked, only Wake stays live */
  section.dim {
    opacity: 0.4;
    filter: grayscale(0.8);
    pointer-events: none;
    user-select: none;
    transition: opacity 0.3s, filter 0.3s;
  }
  .now.off-banner {
    border: 1px dashed var(--bc-dim);
  }
  .now.off-banner ha-icon {
    color: var(--bc-dim);
  }
  button.act.pulse {
    outline: 2px solid var(--c);
    animation: bc-pulse 1.8s ease-in-out infinite;
  }
  @keyframes bc-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 55%, transparent);
    }
    50% {
      box-shadow: 0 0 0 8px transparent;
    }
  }
  .adv-toggle[disabled] {
    cursor: not-allowed;
  }

  /* advanced */
  .adv-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    color: var(--bc-warn);
  }
  .adv {
    margin-top: 10px;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--bc-crit) 50%, transparent);
    background: color-mix(in srgb, var(--bc-crit) 8%, transparent);
  }
  .adv p {
    margin: 0 0 10px;
    font-size: 0.8rem;
    color: var(--bc-dim);
  }
  .clock-row {
    display: grid;
    grid-template-columns: 90px 1fr auto;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
    font-size: 0.85rem;
    color: var(--bc-text);
  }
  .clock-row input[type="number"] {
    width: 84px;
    padding: 4px 6px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--bc-text);
    font: inherit;
  }
  .clock-row input[type="range"] {
    width: 100%;
    accent-color: var(--bc-warn);
  }
  .err {
    color: var(--bc-crit);
    font-size: 0.75rem;
  }
  .row-btns {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  button.pill {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--bc-text);
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
  }
  button.pill.primary {
    background: var(--bc-warn);
    border-color: var(--bc-warn);
    color: #111;
  }
  button.pill[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* confirm + messages */
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    z-index: 5;
    padding: 16px;
  }
  .dialog {
    max-width: 320px;
    padding: 16px;
    border-radius: 16px;
    background: var(--card-background-color, #222);
    color: var(--bc-text);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  }
  .dialog p {
    margin: 0 0 14px;
  }
  .message {
    padding: 16px;
    color: var(--bc-dim);
    text-align: center;
  }
  ha-card {
    position: relative;
  }
`;var U=class extends ${constructor(){super(...arguments);this._label=e=>{let i=ee(this.hass?.language);return{device_id:"Device",name:"Name (optional)",wol_entity:"Wake-on-LAN button (optional)",show_history:"Show history graphs",history_hours:"History hours",show_advanced:`${i("advanced")}: ${i("advanced_title")}`,confirm_actions:"Confirm destructive actions",glass:"Frosted-glass look"}[e.name]??e.name}}setConfig(e){this._config=e}_schema(){return[{name:"device_id",required:!0,selector:{device:{filter:[{integration:"mqtt"}]}}},{name:"name",selector:{text:{}}},{name:"wol_entity",selector:{entity:{domain:"button"}}},{name:"show_history",selector:{boolean:{}}},{name:"history_hours",selector:{number:{min:1,max:48,mode:"box"}}},{name:"show_advanced",selector:{boolean:{}}},{name:"confirm_actions",selector:{boolean:{}}},{name:"glass",selector:{boolean:{}}}]}_changed(e){let i={...this._config,...e.detail.value};this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?h``:h`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this._schema()}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};_([R({attribute:!1})],U.prototype,"hass",2),_([y()],U.prototype,"_config",2),U=_([J("bc250-card-editor")],U);var ft="0.1.0",Ve=300*1e3,_t=2500,ve=2*Math.PI*40,Ye=ve*.75,gt=[{key:"wake",icon:"mdi:alarm-light",color:"#43a047",label:"wake"},{key:"sleep",icon:"mdi:sleep",color:"#42a5f5",label:"sleep",confirm:"confirm_sleep"},{key:"reboot",icon:"mdi:restart",color:"#fb8c00",label:"reboot",confirm:"confirm_reboot"},{key:"shutdown",icon:"mdi:power",color:"#e53935",label:"shutdown",confirm:"confirm_shutdown"},{key:"to_gamemode",icon:"mdi:controller",color:"#ab47bc",label:"game_mode",confirm:"confirm_game_mode"},{key:"to_desktop",icon:"mdi:desktop-tower-monitor",color:"#26a69a",label:"desktop",confirm:"confirm_desktop"},{key:"restart_steam",icon:"mdi:steam",color:"#5c6bc0",label:"restart_steam",confirm:"confirm_restart_steam"},{key:"close_game",icon:"mdi:close-circle",color:"#e53935",label:"close_game",confirm:"confirm_close_game"}],b=class extends ${constructor(){super(...arguments);this._map={};this._history={};this._feedback={};this._advOpen=!1;this._lastHistoryFetch=0}static getConfigElement(){return document.createElement("bc250-card-editor")}static getStubConfig(e){let i=new Map;for(let n of Object.values(e?.entities??{}))n.device_id&&i.set(n.device_id,[...i.get(n.device_id)??[],n.entity_id]);for(let[n,s]of i)if(Le(s))return{device_id:n};return{device_id:""}}setConfig(e){if(!e||typeof e!="object")throw new Error("Invalid configuration");this._config={show_advanced:!1,show_history:!0,history_hours:6,confirm_actions:!0,glass:!1,sections:fe,...e},this._discoveredFor=void 0,this._lastHistoryFetch=0}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._historyTimer=window.setInterval(()=>void this._loadHistory(),Ve)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._historyTimer)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;let i=e.get("hass");return!i||!this.hass?!0:this._trackedIds().some(n=>i.states[n]!==this.hass.states[n])}willUpdate(e){if(!(!this.hass||!this._config?.device_id)){if(this._discoveredFor!==this._config.device_id){this._discoveredFor=this._config.device_id;let i=Object.values(this.hass.entities??{});this._map=_e(i,this._config.device_id),this._discoverWithRegistry(this._config.device_id)}this._isOnline()||(this._confirm&&(this._confirm=void 0),this._draftMax!==void 0&&(this._draftMax=void 0),this._draftMin!==void 0&&(this._draftMin=void 0)),e.has("hass")&&this._config.show_history&&Date.now()-this._lastHistoryFetch>Ve&&this._loadHistory()}}async _discoverWithRegistry(e){try{let i=await this.hass.callWS({type:"config/entity_registry/list"});if(this._config?.device_id!==e)return;this._map=_e(i,e),this._loadHistory()}catch{}}_trackedIds(){let e=Object.values(this._map).filter(i=>!!i);return this._config?.wol_entity&&e.push(this._config.wol_entity),e}_st(e){let i=this._map[e];return i?this.hass?.states[i]:void 0}_num(e){return Fe(this._st(e)?.state)}_isOnline(){let e=this._st("cpu_temp")??this._st("uptime")??this._st("gpu_clock");return!!e&&e.state!=="unavailable"}async _loadHistory(){if(!this.hass||!this._config?.show_history)return;let e=["cpu_temp","gpu_temp","nvme_temp","gpu_clock","gpu_load"],i=e.map(s=>this._map[s]).filter(s=>!!s);if(!i.length)return;this._lastHistoryFetch=Date.now();let n=Math.max(1,Math.min(48,this._config.history_hours??6));try{let s=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(Date.now()-n*36e5).toISOString(),end_time:new Date().toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),o={};for(let a of e){let c=this._map[a];c&&s[c]&&(o[a]=Be(We(s[c]),150))}this._history=o}catch{this._lastHistoryFetch=0}}_entityFor(e){return e.key==="wake"?this._config?.wol_entity:this._map[e.key]}_onAction(e,i){let n=this._entityFor(e);if(!n)return;let s=()=>void this._press(n,e.key);e.confirm&&this._config?.confirm_actions!==!1?this._confirm={text:i(e.confirm),run:s}:s()}async _press(e,i){if(!(i!=="wake"&&!this._isOnline()))try{await this.hass.callService("button","press",{},{entity_id:e}),this._flash(i,"sent")}catch{this._flash(i,"failed")}}_flash(e,i){this._feedback={...this._feedback,[e]:i},window.setTimeout(()=>{let{[e]:n,...s}=this._feedback;this._feedback=s},_t)}_limits(){let e=(this._st("gpu_max_clock")??this._st("gpu_min_clock"))?.attributes;return{min:Number(e?.min??1e3),max:Number(e?.max??2200),step:Number(e?.step??50)}}_applyClock(e){if(!this._isOnline())return;let i=this._limits(),n=this._num("gpu_min_clock"),s=this._num("gpu_max_clock"),o=this._draftMax??s,a=this._draftMin??n;if(o===void 0||a===void 0||n===void 0||s===void 0)return;let c=g=>`err_${g.reason}`,u=ge("Max",o,i,a,void 0),d=ge("Min",a,i,void 0,o),l=u.ok?d.ok?void 0:d:u;if(l&&!l.ok){this._advError=e(c(l));return}this._advError=void 0;let m=()=>this._setNumber("gpu_max_clock",o),f=()=>this._setNumber("gpu_min_clock",a);(async()=>{let g=o>=s?[m,f]:[f,m];for(let S of g)await S();this._draftMax=void 0,this._draftMin=void 0})()}async _setNumber(e,i){let n=this._map[e];if(!(!n||!this._isOnline()||i===this._num(e)))try{await this.hass.callService("number","set_value",{value:i},{entity_id:n}),this._flash(e,"sent")}catch{this._flash(e,"failed")}}render(){let e=ee(this.hass?.language);if(!this._config?.device_id)return h`<ha-card><div class="message">${e("not_configured")}</div></ha-card>`;if(this.hass&&!Object.keys(this._map).length)return h`<ha-card><div class="message">${e("not_found")}</div></ha-card>`;let i=[this._config.accent_color?`--bc250-accent:${this._config.accent_color}`:"",this._config.background_color?`--bc250-bg:${this._config.background_color}`:""].join(";"),n=this._config.sections??fe;return h`
      <ha-card class=${this._config.glass?"glass":""} style=${i}>
        ${n.map(s=>this._section(s,e))}
        ${this._config.show_advanced?h`<section class=${this._isOnline()?"":"dim"}>${this._renderAdvanced(e)}</section>`:p}
        ${this._confirm?h`<div class="overlay" @click=${()=>this._confirm=void 0}>
              <div class="dialog" @click=${s=>s.stopPropagation()}>
                <p>${this._confirm.text}</p>
                <div class="row-btns">
                  <button class="pill" @click=${()=>this._confirm=void 0}>${e("cancel")}</button>
                  <button
                    class="pill primary"
                    @click=${()=>{let s=this._confirm.run;this._confirm=void 0,s()}}
                  >
                    ${e("confirm")}
                  </button>
                </div>
              </div>
            </div>`:p}
      </ha-card>
    `}_section(e,i){let n=this._isOnline()?"":"dim";switch(e){case"header":return h`<section>${this._renderHeader(i)}</section>`;case"vitals":return h`<section class=${n}>${this._renderVitals(i)}</section>`;case"history":return this._config?.show_history?h`<section class=${n}>${this._renderHistory(i)}</section>`:p;case"system":return h`<section class=${n}>${this._renderSystem(i)}</section>`;case"actions":return h`<section>${this._renderActions(i)}</section>`;default:return p}}_renderHeader(e){let i=this.hass?.devices?.[this._config.device_id],n=this._config.name??i?.name_by_user??i?.name??"BC-250",s=this._isOnline(),o=this._st("current_game")?.state,a=s&&o&&o!=="none"&&o!=="unknown"?o:void 0;return h`
      <div class="header">
        <span class="title">${n}</span>
        <span class="badge ${s?"on":""}"><span class="dot"></span>${e(s?"online":"offline")}</span>
        <span class="spacer"></span>
        <span class="meta">${e("uptime")}: ${s?je(this._num("uptime")):"\u2013"}</span>
      </div>
      ${s?h`<div class="now">
            <ha-icon icon="mdi:gamepad-variant"></ha-icon>
            <div>
              <div class="label">${e("now_playing")}</div>
              <div>${a??e("idle")}</div>
            </div>
          </div>`:h`<div class="now off-banner">
            <ha-icon icon="mdi:power-sleep"></ha-icon>
            <div>
              <div>${e("off_title")}</div>
              <div class="label">${this._config.wol_entity?e("off_hint"):e("no_wol")}</div>
            </div>
          </div>`}
    `}_renderVitals(e){let i=this._num("throttle_temp")??85;return h`<div class="vitals">
      ${this._gauge(e("cpu"),this._num("cpu_temp"),"\xB0C",20,100,H(this._num("cpu_temp"),i-15,i))}
      ${this._gauge(e("gpu"),this._num("gpu_temp"),"\xB0C",20,100,H(this._num("gpu_temp"),i-15,i))}
      ${this._gauge(e("gpu_load"),this._num("gpu_load"),"%",0,100,H(this._num("gpu_load"),85,98))}
      ${this._clockGauge(e("clock"))}
    </div>`}_gauge(e,i,n,s,o,a){let c=Ie(i,s,o);return h`<div class="gauge">
      <svg viewBox="0 0 100 100">
        ${pe`<circle class="track" cx="50" cy="50" r="40" fill="none" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${Ye} ${ve}" />
        <circle class="arc ${a}" cx="50" cy="50" r="40" fill="none" stroke-width="8"
          stroke-dasharray="${c*Ye} ${ve}" />`}
      </svg>
      <div class="value">${Q(i,n==="\xB0C"?1:0)}<small>${n}</small></div>
      <div class="name">${e}</div>
    </div>`}_clockGauge(e){let i=this._limits(),n=this._num("gpu_clock"),s=n!==void 0&&n>=i.max?"crit":n!==void 0&&n>=i.max-200?"warn":"ok";return this._gauge(e,n,"MHz",500,i.max+200,s)}_renderHistory(e){let i=[{key:"cpu_temp",label:"cpu",color:"#42a5f5"},{key:"gpu_temp",label:"gpu",color:"#ffa726"},{key:"nvme_temp",label:"nvme",color:"#ef5350"}],n=[{key:"gpu_clock",label:"clock",color:"#42a5f5"},{key:"gpu_load",label:"load",color:"#ab47bc",vMin:0,vMax:100}];return h`<h3>${e("temperatures")} · ${e("clock_and_load")}</h3>
      <div class="charts">${this._chart(e("temperatures"),i,e)} ${this._chart(e("clock_and_load"),n,e)}</div>`}_chart(e,i,n){let a=i.flatMap(l=>this._history[l.key]??[]),c=Date.now(),u=c-(this._config?.history_hours??6)*36e5,d=a.length?[Math.min(...a.map(l=>l.v)),Math.max(...a.map(l=>l.v))]:[0,1];return h`<div class="chart">
      <div class="ctitle">${e}</div>
      <svg viewBox="0 0 ${300} ${70}" preserveAspectRatio="none">
        ${i.map(l=>{let m=this._history[l.key]??[],f=l.vMin,g=l.vMax;if(f===void 0||g===void 0){let O=m.length?[Math.min(...m.map(D=>D.v)),Math.max(...m.map(D=>D.v))]:d,be=i.every(D=>D.vMin===void 0)&&i[0].key.endsWith("_temp")?d:O;f=be[0]-1,g=be[1]+1}let S=Ke(m,{width:300,height:70,tMin:u,tMax:c,vMin:f,vMax:g});return S?pe`<path d=${S} fill="none" stroke=${l.color} stroke-width="1.6" vector-effect="non-scaling-stroke" />`:p})}
      </svg>
      <div class="legend">
        ${i.map(l=>{let m=this._num(l.key);return h`<span><i style="background:${l.color}"></i>${n(l.label)} ${Q(m,m!==void 0&&m%1?1:0)}</span>`})}
      </div>
    </div>`}_renderSystem(e){let i=(u,d)=>h`<div class="tile">
      <div class="tname">${u}</div>
      <div class="tval">${Q(d,1)} %</div>
      <div class="bar ${H(d,80,95)==="ok"?"":H(d,80,95)}"><div style="width:${d??0}%"></div></div>
    </div>`,n=(u,d)=>h`<div class="tile"><div class="tname">${u}</div><div class="tval">${d}</div></div>`,s=this._num("logi_battery"),o=this._num("pump_rpm"),a=this._num("cu_active"),c=this._num("throttle_temp");return h`<h3>${e("system")}</h3>
      <div class="tiles">
        ${n(e("pump"),o===void 0?"\u2013":`${Math.round(o)} RPM`)} ${i(e("ram"),this._num("ram_used"))}
        ${i(e("swap"),this._num("swap_used"))} ${i(e("disk"),this._num("disk_used"))}
        ${n(e("cus"),a===void 0?"\u2013":`${a} CU`)} ${n(e("throttle"),c===void 0?"\u2013":`${c} \xB0C`)}
        ${s!==void 0?n(e("battery"),`${Math.round(s)} %`):p}
      </div>`}_renderActions(e){let i=this._isOnline();return h`<h3>${e("actions")}</h3>
      <div class="actions">
        ${gt.map(n=>{let s=this._entityFor(n),o=!s||n.key!=="wake"&&!i,a=this._feedback[n.key],c=n.key==="wake"&&!s?e("no_wol"):"",u=n.key==="wake"&&!i&&!o?"pulse":"";return h`<button
            class="act ${a??""} ${u}"
            style="--c:${n.color}"
            title=${c}
            ?disabled=${o}
            @click=${()=>this._onAction(n,e)}
          >
            <ha-icon icon=${n.icon}></ha-icon>
            <span>${e(a||n.label)}</span>
          </button>`})}
      </div>`}_renderAdvanced(e){let i=this._isOnline(),n=this._advOpen&&i;return h`<button class="adv-toggle" ?disabled=${!i} @click=${()=>this._advOpen=!n}>
        <ha-icon icon=${n?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
        <ha-icon icon="mdi:alert"></ha-icon>
        <h3 style="margin:0;color:inherit">${e("advanced")} · ${e("advanced_title")}</h3>
      </button>
      ${n?this._advancedBody(e):p}`}_advancedBody(e){let i=this._limits(),n=this._isOnline(),s=this._num("gpu_max_clock"),o=this._num("gpu_min_clock"),a=this._draftMax??s??i.max,c=this._draftMin??o??i.min,u=this._draftMax!==void 0&&this._draftMax!==s||this._draftMin!==void 0&&this._draftMin!==o,d=(f,g,S)=>h`<div class="clock-row">
      <span>${f}</span>
      <input
        type="range"
        .min=${String(i.min)}
        .max=${String(i.max)}
        .step=${String(i.step)}
        .value=${String(g)}
        ?disabled=${!n}
        @input=${O=>S(qe(Number(O.target.value),i))}
      />
      <span
        ><input
          type="number"
          .min=${String(i.min)}
          .max=${String(i.max)}
          .step=${String(i.step)}
          .value=${String(g)}
          ?disabled=${!n}
          @change=${O=>S(Number(O.target.value))}
        />
        MHz</span
      >
    </div>`,l=this._num("cfg_voltage"),m=this._num("cu_active");return h`<div class="adv">
      <p>${e("advanced_warning")}</p>
      ${d(e("max_clock"),a,f=>(this._draftMax=f,this._advError=void 0))}
      ${d(e("min_clock"),c,f=>(this._draftMin=f,this._advError=void 0))}
      ${this._advError?h`<div class="err">${this._advError}</div>`:p}
      <div class="row-btns">
        <button class="pill primary" ?disabled=${!n||!u} @click=${()=>this._applyClock(e)}>${e("apply")}</button>
        <button
          class="pill"
          ?disabled=${!n||!this._map.gpu_reset}
          @click=${()=>{let f=this._map.gpu_reset;f&&(this._confirm={text:e("confirm_gpu_reset"),run:()=>void this._press(f,"gpu_reset")})}}
        >
          ${e("reset")}
        </button>
      </div>
      <h3 style="margin-top:14px">${e("readonly_values")}</h3>
      <p>${e("readonly_note")}</p>
      <div class="tiles">
        <div class="tile"><div class="tname">${e("voltage")}</div><div class="tval">${l===void 0?"\u2013":`${l} mV`}</div></div>
        <div class="tile"><div class="tname">${e("active_cus")}</div><div class="tval">${m===void 0?"\u2013":`${m} CU`}</div></div>
      </div>
    </div>`}};b.styles=Ge,_([R({attribute:!1})],b.prototype,"hass",2),_([y()],b.prototype,"_config",2),_([y()],b.prototype,"_map",2),_([y()],b.prototype,"_history",2),_([y()],b.prototype,"_feedback",2),_([y()],b.prototype,"_confirm",2),_([y()],b.prototype,"_advOpen",2),_([y()],b.prototype,"_draftMax",2),_([y()],b.prototype,"_draftMin",2),_([y()],b.prototype,"_advError",2),b=_([J("bc250-card")],b);window.customCards=window.customCards??[];window.customCards.push({type:"bc250-card",name:"BC-250 Card",description:"Dashboard and controls for the bc250-ha-bridge device",preview:!1,documentationURL:"https://github.com/phiiaz/bc250-ha-bridge"});console.info(`%c BC250-CARD %c v${ft} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{b as Bc250Card};
