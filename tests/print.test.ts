import {it,expect} from 'vitest';
import {namespaceIds} from '../src/lib/print';
it('wydruk rozdziela nagłówki i odwołania SVG każdej lekcji bez JavaScript',()=>{
  const html='<h2 id="blad">Błąd</h2><a href="#blad">link</a><svg aria-labelledby="label"><title id="label">Cykl</title><marker id="arrow"/><path marker-end="url(#arrow)"/></svg>';
  const a=namespaceIds(html,'cykl'),b=namespaceIds(html,'ttl');
  expect(a).toContain('id="cykl-blad"');expect(b).toContain('id="ttl-blad"');
  expect(a).toContain('href="#cykl-blad"');expect(a).toContain('aria-labelledby="cykl-label"');
  expect(a).toContain('url(#cykl-arrow)');
});
it('nie zmienia zewnętrznych adresów ani data-id',()=>{
  expect(namespaceIds('<div data-id="x" id="x"><a href="/ttl/#x">x</a></div>','print')).toBe('<div data-id="x" id="print-x"><a href="/ttl/#x">x</a></div>');
});
