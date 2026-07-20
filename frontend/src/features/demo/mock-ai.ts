import type { DemoIntent, DemoMessage, DemoProduct, IntentResult, LegalDocument } from "./types";

const normalize = (value: string) => value.toLocaleLowerCase("vi-VN");
export function classifyIntent(query: string): IntentResult {
  const q=normalize(query); let intent: DemoIntent="out_of_scope"; const confidence=.82;
  if(/xin chào|chào bạn|hello/.test(q)) intent="small_talk";
  if(/pháp lý|nghị định|luật|điều kiện cấp phép|văn bản|hiệu lực/.test(q)) intent="legal_lookup";
  else if(/so sánh/.test(q)) intent="product_comparison";
  else if(/còn hàng|tồn kho|hết hàng/.test(q)) intent="product_availability";
  else if(/báo giá/.test(q)) intent="quotation_request";
  else if(/lịch|gọi lại|hẹn/.test(q)) intent="appointment_booking";
  else if(/nhân viên|tư vấn viên|gặp người/.test(q)) intent="human_handoff";
  else if(/máy|thiết bị|bảo hộ|dụng cụ|sản phẩm|khoan|cắt|đo khoảng cách/.test(q)) intent="product_consulting";
  const priceMatch=q.match(/(?:dưới|tối đa|khoảng)\s*([\d,.]+)\s*(triệu|tr)?/); let maxPrice: number|undefined;
  if(priceMatch){ const value=Number(priceMatch[1].replace(/[,.]/g,"")); maxPrice=priceMatch[2] ? value*1_000_000 : value; }
  const category=q.includes("khoan")?"Máy khoan":q.includes("cắt")?"Máy cắt":q.includes("đo khoảng cách")?"Máy đo khoảng cách":q.includes("bảo hộ")?"Thiết bị bảo hộ":undefined;
  return { intent, confidence, requiresHuman: confidence<.6 || intent==="out_of_scope", maxPrice, category };
}
export function searchProducts(products: DemoProduct[], result: IntentResult) { return products.filter(p=>(!result.category||p.category===result.category)&&(!result.maxPrice||p.price<=result.maxPrice)).sort((a,b)=>(b.stock>0?1:0)-(a.stock>0?1:0)||a.price-b.price).slice(0,3); }
export function legalSearch(documents: LegalDocument[], query: string) { const q=normalize(query); if(/cấp phép|giấy phép/.test(q)) return documents.filter(d=>/cấp phép|giấy phép/.test(normalize(d.text))).slice(0,3); return documents.filter(d=>q.includes("hiệu lực")||normalize(`${d.title} ${d.documentNumber} ${d.text}`).split(" ").some(word=>word.length>5&&q.includes(word))).slice(0,3); }
export function latestProducts(messages: DemoMessage[]) { return [...messages].reverse().find(m=>m.products?.length)?.products ?? []; }
export function stockLabel(stock:number){ return stock===0?"Hết hàng":stock<=5?"Sắp hết":"Còn hàng"; }
export function normalizePhone(value:string){ const digits=value.replace(/[^\d+]/g,"").replace(/^\+/,""); const local=digits.startsWith("84")?`0${digits.slice(2)}`:digits; return /^(03|05|07|08|09)\d{8}$/.test(local)?`+84${local.slice(1)}`:null; }
export function validName(value:string){ const v=value.trim(); return v.length>=2 && /[A-Za-zÀ-ỹ]/.test(v) && !/^(abc|test|không biết)$/i.test(v) && !/[<>]/.test(v); }
