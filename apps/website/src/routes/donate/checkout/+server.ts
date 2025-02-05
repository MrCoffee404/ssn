import { Preference } from 'mercadopago';
import { error, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { mercadoPago } from '$lib/api/mercado-pago';
import type { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes.js';

export const GET = async ({ url }) => {
	const amount = parseInt(url.searchParams.get('amount') || '0');
	const username = url.searchParams.get('username');

	if (amount < 10 || amount > 500) throw error(400, 'Valor deve ser entre R$ 10 e R$ 500');
	if (!username) throw error(400, 'Usuário não informado');
	if (!validateUsername(username)) throw error(400, 'Usuário inválido');

	const days = amount >= 10 ? Math.floor((Math.floor(amount) * 30) / 20) : 0;

	const preference = new Preference(mercadoPago);
	let checkout: PreferenceResponse;
	try {
		checkout = await preference.create({
			body: {
				items: [
					{
						id: `donate:${username}:${days}d`,
						title: `Doação de ${username} (${days} dias)`,
						quantity: 1,
						currency_id: 'BRL',
						unit_price: dev || username === 'DoceAzedo' ? 1 : amount
					}
				]
			}
		});
	} catch (e) {
		throw error(500, 'Não foi possível gerar checkout');
	}

	if (!checkout.init_point) throw error(500, 'Não foi possível gerar URL de checkout');
	throw redirect(302, checkout.init_point);
};

const validateUsername = (username: string) => /^[a-zA-Z0-9_]{2,16}$/gm.test(username);
