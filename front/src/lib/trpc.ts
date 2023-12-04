import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../back/src/router'
import superjson from 'superjson';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export function getTRPCClient() {
	const client = createTRPCProxyClient<AppRouter>({
		transformer: superjson,
		links: [
			httpBatchLink({
				//url: PUBLIC_API_URL + '/trpc',
                url: '/api/trpc',
			})
		]
	});

	return client;
}
