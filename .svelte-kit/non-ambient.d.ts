
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/agents" | "/api" | "/api/blogs" | "/api/brains" | "/api/chats" | "/api/chats/[id]" | "/api/chat" | "/api/prompts" | "/api/skills" | "/api/workflows" | "/api/workflows/[id]" | "/api/works" | "/api/works/[id]" | "/auth" | "/auth/callback" | "/auth/google" | "/auth/reset-password" | "/blogs" | "/brains" | "/chat" | "/chat/[agentId]" | "/knowledge" | "/login" | "/logout" | "/prompts" | "/signup" | "/skills" | "/tasks" | "/workflows" | "/works";
		RouteParams(): {
			"/api/chats/[id]": { id: string };
			"/api/workflows/[id]": { id: string };
			"/api/works/[id]": { id: string };
			"/chat/[agentId]": { agentId: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; agentId?: string | undefined };
			"/agents": Record<string, never>;
			"/api": { id?: string | undefined };
			"/api/blogs": Record<string, never>;
			"/api/brains": Record<string, never>;
			"/api/chats": { id?: string | undefined };
			"/api/chats/[id]": { id: string };
			"/api/chat": Record<string, never>;
			"/api/prompts": Record<string, never>;
			"/api/skills": Record<string, never>;
			"/api/workflows": { id?: string | undefined };
			"/api/workflows/[id]": { id: string };
			"/api/works": { id?: string | undefined };
			"/api/works/[id]": { id: string };
			"/auth": Record<string, never>;
			"/auth/callback": Record<string, never>;
			"/auth/google": Record<string, never>;
			"/auth/reset-password": Record<string, never>;
			"/blogs": Record<string, never>;
			"/brains": Record<string, never>;
			"/chat": { agentId?: string | undefined };
			"/chat/[agentId]": { agentId: string };
			"/knowledge": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/prompts": Record<string, never>;
			"/signup": Record<string, never>;
			"/skills": Record<string, never>;
			"/tasks": Record<string, never>;
			"/workflows": Record<string, never>;
			"/works": Record<string, never>
		};
		Pathname(): "/" | "/agents" | "/api/blogs" | "/api/brains" | "/api/chats" | `/api/chats/${string}` & {} | "/api/chat" | "/api/prompts" | "/api/skills" | `/api/workflows/${string}` & {} | "/api/works" | `/api/works/${string}` & {} | "/auth/callback" | "/auth/google" | "/auth/reset-password" | "/blogs" | "/brains" | "/chat" | `/chat/${string}` & {} | "/knowledge" | "/login" | "/logout" | "/prompts" | "/signup" | "/skills" | "/tasks" | "/workflows" | "/works";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}