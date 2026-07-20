import { demoLegalDocuments, demoProducts } from "./data";
import type { DemoAppointment, DemoConversation, DemoFeedback, DemoLead, DemoProduct, DemoQuotation, LegalDocument } from "./types";

const keys = { products:"demo_products", documents:"demo_legal_documents", conversations:"demo_conversations", leads:"demo_leads", quotations:"demo_quotations", appointments:"demo_appointments", feedback:"demo_feedback" } as const;
const read = <T>(key: string, fallback: T): T => { if (typeof window === "undefined") return fallback; try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } };
const write = <T>(key: string, value: T) => { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("demo-storage")); };

export const demoStore = {
  seed() { if (!localStorage.getItem(keys.products)) write(keys.products, demoProducts); if (!localStorage.getItem(keys.documents)) write(keys.documents, demoLegalDocuments); },
  products: () => read<DemoProduct[]>(keys.products, demoProducts),
  documents: () => read<LegalDocument[]>(keys.documents, demoLegalDocuments),
  conversations: () => read<DemoConversation[]>(keys.conversations, []),
  leads: () => read<DemoLead[]>(keys.leads, []),
  quotations: () => read<DemoQuotation[]>(keys.quotations, []),
  appointments: () => read<DemoAppointment[]>(keys.appointments, []),
  feedback: () => read<DemoFeedback[]>(keys.feedback, []),
  saveConversation(value: DemoConversation) { const all=this.conversations(); const index=all.findIndex(x=>x.id===value.id); if(index>=0) all[index]=value; else all.unshift(value); write(keys.conversations, all); },
  addLead(value: DemoLead) { write(keys.leads, [value, ...this.leads()]); },
  addQuotation(value: DemoQuotation) { write(keys.quotations, [value, ...this.quotations()]); },
  addAppointment(value: DemoAppointment) { write(keys.appointments, [value, ...this.appointments()]); },
  addFeedback(value: DemoFeedback) { write(keys.feedback, [value, ...this.feedback()]); },
  reset() { Object.values(keys).forEach(key=>localStorage.removeItem(key)); this.seed(); window.dispatchEvent(new Event("demo-storage")); },
};
