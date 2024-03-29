// @ts-nocheck
// Import the SvelteKitAuth middleware and the authentication providers
import { SvelteKitAuth } from '@auth/sveltekit';
import Email from '@auth/core/providers/email';
import Azure from '@auth/core/providers/azure-ad';
import GitHub from '@auth/core/providers/github';
import CredentialsProvider from '@auth/core/providers/credentials';

// Import the environment variables and the Prisma adapter
import { AUTH_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

// Import the Handle and error types from the SvelteKit framework
import { type Handle, error } from '@sveltejs/kit';

// Import the sequence and prisma functions
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/utils/prisma';

// Define the available authentication providers
const availableProviders = [];

// Add the CredentialsProvider if EMAIL_TEST is true
if (env.EMAIL_TEST === 'true') {
	availableProviders.push(
		CredentialsProvider({
			name: 'Email for testing',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'testemail@example.com' }
			},
			authorize: async (credentials) => {
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

// Add the Email provider if SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and EMAIL_FROM are defined
if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD && env.EMAIL_FROM) {
	availableProviders.push(
		Email({
			server: {
				host: env.SMTP_HOST,
				port: Number(env.SMTP_PORT),
				auth: {
					user: env.SMTP_USER,
					pass: env.SMTP_PASSWORD
				}
			},
			from: env.EMAIL_FROM,
			name: 'Magic Link'
		}) as any
	);
}

// Add the Azure provider if AZURE_ID, AZURE_SECRET, and AZURE_TENANT_ID are defined
if (env.AZURE_ID && env.AZURE_SECRET && env.AZURE_TENANT_ID) {
	availableProviders.push(
		Azure({
			clientId: env.AZURE_ID,
			clientSecret: env.AZURE_SECRET,
			tenantId: env.AZURE_TENANT_ID,
			authorization: { params: { scope: 'openid profile user.Read email' } }
		}) as any
	);
}

// Add the GitHub provider if GITHUB_ID and GITHUB_SECRET are defined
if (env.GITHUB_ID && env.GITHUB_SECRET) {
	availableProviders.push(
		GitHub({ clientId: env.GITHUB_ID, clientSecret: env.GITHUB_SECRET }) as any
	);
}

// Define the authorization function
const authorization = async ({
	event,
	resolve
}: {
	event: any;
	resolve: any;
}): Promise<Response> => {
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
};

// Define the SvelteKit handle function
export const handle: Handle = sequence(
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
			jwt: async ({ token, user }) => {
				if (user) {
					token.id = user.id;
				}
				return token;
			},
			session: async ({ session, token }) => {
				session.user.id = token.id;
				return session;
			}
		}
	}),
	authorization
);
