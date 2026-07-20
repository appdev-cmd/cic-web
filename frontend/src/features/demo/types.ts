export type DemoIntent = "product_consulting" | "product_comparison" | "product_availability" | "quotation_request" | "legal_lookup" | "lead_collection" | "appointment_booking" | "human_handoff" | "customer_feedback" | "small_talk" | "out_of_scope";

export interface DemoProduct { id: string; productCode: string; productName: string; category: string; brand: string; description: string; useCase: string; power: string; weight: string; price: number; unit: string; stock: number; warranty: string; standards: string; }
export interface LegalDocument { id: string; title: string; documentNumber: string; documentType: string; article: string; clause: string; text: string; status: "effective" | "expired" | "pending"; replacement?: string; }
export interface DemoMessage { id: string; role: "user" | "assistant"; content: string; intent?: DemoIntent; products?: DemoProduct[]; sources?: LegalDocument[]; createdAt: string; }
export interface DemoLead { id: string; name: string; phone: string; need: string; product?: string; status: "new" | "assigned" | "contacted" | "completed"; createdAt: string; }
export interface DemoQuotation { id: string; product: string; quantity: number; customerName: string; phone: string; total: number; status: "submitted"; createdAt: string; }
export interface DemoAppointment { id: string; customerName: string; phone: string; date: string; time: string; channel: string; status: "scheduled"; createdAt: string; }
export interface DemoFeedback { id: string; messageId: string; helpful: boolean; reason?: string; createdAt: string; }
export interface DemoConversation { id: string; messages: DemoMessage[]; primaryIntent?: DemoIntent; handoff: boolean; createdAt: string; updatedAt: string; }
export interface IntentResult { intent: DemoIntent; confidence: number; requiresHuman: boolean; maxPrice?: number; category?: string; }
