async function testFixedUrl() {
  const url = 'http://127.0.0.1:3000/products/spraycannon-150-%E2%80%93-thiet-bi-phun-suong-dap-bui';
  const r = await fetch(url, { headers: { 'Accept': 'text/html' } });
  const text = await r.text();
  const isStreaming404 = text.includes('"notFound":[') || text.includes('notFound.tsx');
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text);
  const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log('Result for URL:', url);
  console.log('HTTP Status:', r.status);
  console.log('Streaming404:', isStreaming404);
  console.log('Has Noindex:', hasNoindex);
  console.log('H1 Title:', h1Match ? h1Match[1].trim() : 'none');
}

testFixedUrl().catch(console.error);
