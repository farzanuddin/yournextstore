type MoneyInput = { amount: string | bigint | number; currency: string; locale: string };

export function formatMoney({ amount, currency, locale }: MoneyInput) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	}).format(Number(amount) / 100);
}
