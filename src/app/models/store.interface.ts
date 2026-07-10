export interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  whatsapp_number: string | null;
  telegram_chat_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreRequest {
  name: string;
  slug: string;
  whatsapp_number: string | null;
  telegram_chat_id: string | null;
}

export interface StoreResponse {
  store: Store;
}

export interface updateStoreResponse{
    message: string;
    store: Store;
}