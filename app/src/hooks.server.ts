// @ts-nocheck
import { SvelteKitAuth } from '@auth/sveltekit';
import Email from '@auth/core/providers/email';
import Azure from '@auth/core/providers/azure-ad';
import GitHub from '@auth/core/providers/github';
import CredentialsProvider from '@auth/core/providers/credentials';
import {
	AZURE_ID,
	AZURE_SECRET,
	AZURE_TENANT_ID,
	GITHUB_ID,
	GITHUB_SECRET,
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD,
	EMAIL_FROM,
	AUTH_SECRET,
	EMAIL_TEST
} from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/utils/prisma';

const availableProviders = [];

if (EMAIL_TEST) {
	availableProviders.push(
		CredentialsProvider({
			name: 'Email for testing',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'testemail@example.com' }
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email as string
					}
				});
				if (user) {
					return user;
				} else {
					return null;
				}
			}
		}) as any
	);
}

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD && EMAIL_FROM) {
	availableProviders.push(
		Email({
			server: {
				host: SMTP_HOST,
				port: Number(SMTP_PORT),
				auth: {
					user: SMTP_USER,
					pass: SMTP_PASSWORD
				}
			},
			from: EMAIL_FROM,
			name: 'Magic Link'
		}) as any
	);
}
if (AZURE_ID && AZURE_SECRET && AZURE_TENANT_ID) {
	availableProviders.push(
		Azure({
			clientId: AZURE_ID,
			clientSecret: AZURE_SECRET,
			tenantId: AZURE_TENANT_ID,
			authorization: { params: { scope: 'openid profile user.Read email' } }
		}) as any
	);
}
if (GITHUB_ID && GITHUB_SECRET) {
	availableProviders.push(GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }) as any);
}

async function authorization({ event, resolve }: { event: any; resolve: any }): Promise<Response> {
	if (event.url.pathname.startsWith('/p')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, 'Unauthorized');
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
		providers: [...availableProviders],
		secret: AUTH_SECRET,
		trustHost: true,
		session: {
			strategy: 'jwt',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			updateAge: 60 * 60 * 24 // 1 day
		},
		callbacks: {
			async jwt({ token, user }) {
				if (user) {
					token.id = user.id;
				}
				return token;
			},
			async session({ session, token }) {
				session.user.id = token.id;
				return session;
			}
		}
	}),
	authorization
) satisfies Handle;
