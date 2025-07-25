import{r as a,j as e}from"./app-jYtbDyJ1.js";import{S as n}from"./index-B5szsp0a.js";import{c}from"./createLucideIcon-BVkEf1E1.js";/* empty css            *//**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 12H8",key:"1fr5h0"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}]],h=c("CircleArrowLeft",d);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m12 16 4-4-4-4",key:"1i9zcv"}]],p=c("CircleArrowRight",u);function g(){const i={dots:!0,infinite:!0,slidesToShow:1,slidesToScroll:1,autoplay:!0,autoplaySpeed:2e3,pauseOnHover:!0},r=a.useRef(null),o=1500,s=600;return e.jsxs("div",{className:`slider-container relative h-[${s}px] hidden lg:block`,children:[e.jsx(n,{ref:r,...i,children:Array(10).fill("").map((t,l)=>e.jsx("div",{className:"bg-red-500",children:e.jsx("img",{loading:"lazy",src:`https://picsum.photos/${o}/${s}?random=${l}`,className:"w-full",alt:`Slide ${l}`})},l))}),e.jsxs("div",{className:"absolute top-1/2 right-0 left-0 z-10 flex -translate-y-1/2 justify-between px-4",children:[e.jsx("button",{onClick:()=>{var t;(t=r.current)==null||t.slickPrev()},className:"rounded-full bg-black/50 p-2 text-white hover:bg-black/70",children:e.jsx(h,{size:24})}),e.jsx("button",{onClick:()=>{var t;(t=r.current)==null||t.slickNext()},className:"rounded-full bg-black/50 p-2 text-white hover:bg-black/70",children:e.jsx(p,{size:24})})]})]})}export{g as default};
