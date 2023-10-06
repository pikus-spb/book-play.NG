export interface CurrencyUI {
  eur: string;
  usd: string;
}

export interface CurrencyRequest {
  rates: {
    EUR: number;
    USD: number;
  };
}
