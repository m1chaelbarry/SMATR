/** Nadaje identyfikatorom każdej drukowanej lekcji własny prefiks już w HTML. */
export function namespaceIds(html:string,prefix:string):string{
  const ids=new Map<string,string>();
  html=html.replace(/(\s)id=(["'])(.*?)\2/g,(_,space,quote,id)=>{
    const scoped=`${prefix}-${id}`;ids.set(id,scoped);return `${space}id=${quote}${scoped}${quote}`;
  });
  html=html.replace(/(\s)(href|xlink:href|for|aria-labelledby|aria-describedby|aria-controls|headers)=(["'])(.*?)\3/g,(_,space,attr,quote,value)=>{
    const ref=attr==='href'||attr==='xlink:href';
    const scoped=ref?(value.startsWith('#')&&ids.has(value.slice(1))?`#${ids.get(value.slice(1))}`:value):value.split(/\s+/).map((id:string)=>ids.get(id)??id).join(' ');
    return `${space}${attr}=${quote}${scoped}${quote}`;
  });
  return html.replace(/url\(#([^)]+)\)/g,(value,id)=>ids.has(id)?`url(#${ids.get(id)})`:value);
}
