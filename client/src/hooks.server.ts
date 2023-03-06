import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Azure from '@auth/core/providers/azure-ad';
import CredentialsProvider from '@auth/core/providers/credentials';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	AZURE_ID,
	AZURE_SECRET,
	AZURE_TENANT_ID
} from '$env/static/private';
import type { Provider } from '@auth/core/providers';
import type { Profile } from '@auth/core/types';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const prisma = new PrismaClient();

async function authorization({ event, resolve }): Promise<any> {
	if (event.url.pathname.startsWith('/protected')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	const result = await resolve(event, {
		transformPageChunk: ({ html }): any => html
	});
	return result;
}

export const handle = sequence(
	SvelteKitAuth({
		adapter: PrismaAdapter(prisma),
		providers: [
			CredentialsProvider({
				name: 'Email for testing',
				credentials: {
					email: { label: 'Email', type: 'email' }
				},
				async authorize(credentials, req) {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email
						}
					});
					if (user) {
						return user;
					} else {
						return null;
					}
				}
			}),
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }) as Provider<Profile>,
			Azure({
				clientId: AZURE_ID,
				clientSecret: AZURE_SECRET,
				tenantId: AZURE_TENANT_ID,
				authorization: { params: { scope: 'openid profile user.Read email' } }
			}) as Provider<Profile>
		],
		session: {
			strategy: 'jwt',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			updateAge: 60 * 60 * 24 // 1 day
		}
	}),
	authorization
) satisfies Handle;
