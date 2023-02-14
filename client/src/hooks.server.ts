import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import Azure from "@auth/core/providers/azure-ad"
import { GITHUB_ID, GITHUB_SECRET, AZURE_ID, AZURE_SECRET, AZURE_TENANT_ID } from "$env/static/private"
import type { Handle } from "@sveltejs/kit"
import type { Provider } from "@auth/core/providers"
import type { Profile } from "@auth/core/types"

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }) as Provider<Profile>,
    Azure({ clientId: AZURE_ID, clientSecret: AZURE_SECRET, tenantId: AZURE_TENANT_ID }) as Provider<Profile>
  ]
}) satisfies Handle
