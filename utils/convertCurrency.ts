export const convertCurrency = (amount: string | number) => {
	return new Intl.NumberFormat('fr-Fr', {
		style: 'currency',
		currency: 'EUR',
	}).format(+amount)
}
