import{j as e,$ as c}from"./app-jYtbDyJ1.js";import{d as x}from"./index-DWrDE4Q2.js";/* empty css            */const m=({readonly:n,initialValue:r,allowFraction:a,size:s=20,SVGstyle:t,fillColor:o,emptyColor:l,transition:i})=>e.jsx(x.Rating,{readonly:!0,initialValue:r,allowFraction:!0,size:s,SVGstyle:{display:"inline-block"},fillColor:"#c45500",emptyColor:"#e5e7eb",transition:!0}),f=({productData:n})=>e.jsx("section",{"aria-label":"Product list",className:`grid w-full grid-cols-1 gap-x-4 gap-y-6 px-1
                 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
                 sm:px-3 md:px-4`,children:n.map(({id:r,slug:a,image:s,name:t,review:o,review_count:l,description:i,price:d})=>e.jsxs(c,{href:route("product.productShow",{slug:a}),prefetch:!0,className:`group relative flex flex-col overflow-hidden
                       rounded-lg border border-border/40 bg-background
                       shadow-sm transition
                       hover:shadow-md motion-safe:hover:scale-[1.02]
                       focus-visible:ring-2 focus-visible:ring-ring`,children:[e.jsx("img",{src:s,alt:t,loading:"lazy",decoding:"async",className:`h-56 w-full object-contain bg-foreground/5
                         transition-transform duration-300
                         motion-safe:group-hover:scale-105
                         lg:h-72`}),e.jsxs("div",{className:"flex grow flex-col gap-2 p-3 sm:p-4",children:[e.jsx("h2",{className:`line-clamp-2 text-sm font-semibold text-primary
                           md:text-base`,children:t}),e.jsxs("div",{className:`flex items-center gap-1 text-xs text-muted-foreground
                           md:text-sm`,children:[e.jsx("span",{children:o.toFixed(1)}),e.jsx(m,{initialValue:o}),e.jsxs("span",{"aria-label":`${l} reviews`,children:["(",l,")"]})]}),e.jsx("p",{className:"line-clamp-2 text-xs text-muted-foreground",children:i||"No description available."}),e.jsxs("div",{className:"mt-auto flex items-center gap-2",children:[e.jsxs("span",{className:"text-lg font-semibold text-primary",children:["₹",d]}),e.jsxs("span",{className:"text-xs line-through text-muted-foreground",children:["₹",d]})]}),e.jsx("div",{className:`flex items-center justify-center rounded-full
                           border border-border py-1 text-xs
                           transition-colors
                           hover:bg-accent hover:text-accent-foreground
                           md:text-sm`,children:"See options"})]})]},r))});export{f as default};
