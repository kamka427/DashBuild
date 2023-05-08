import { SvelteKitAuth } from '@auth/sveltekit';
import Email, { type SendVerificationRequestParams } from '@auth/core/providers/email';
import Azure from '@auth/core/providers/azure-ad';
import { AZURE_ID, AZURE_SECRET, AZURE_TENANT_ID, AUTH_SECRET } from '$env/static/private';
import type { Awaitable } from '@auth/core/types';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/utils/prisma';

async function authorization({ event, resolve }: { event: any; resolve: any }): Promise<Response> {
	if (event.url.pathname.startsWith('/p')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	const result = await resolve(event, {
		transformPageChunk: ({ html }: { html: string }) => html
	});
	return result;
}

export const handle = sequence(
	SvelteKitAuth({
		adapter: PrismaAdapter(prisma) as any,
		providers: [
			Email({
				server: {
					host: process.env.SMTP_HOST,
					port: Number(process.env.SMTP_PORT),
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASSWORD
					}
				},
				from: process.env.EMAIL_FROM,
				name: 'Sign in with Email'
			}) as any,
			Azure({
				clientId: AZURE_ID,
				clientSecret: AZURE_SECRET,
				tenantId: AZURE_TENANT_ID,
				authorization: { params: { scope: 'openid profile user.Read email' } }
			}) as any
		],
		secret: AUTH_SECRET,
		trustHost: true,
		session: {
			strategy: 'jwt',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			updateAge: 60 * 60 * 24 // 1 day
		}
	}),
	authorization
) satisfies Handle;
