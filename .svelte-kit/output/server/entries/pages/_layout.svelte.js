import "../../chunks/index-server.js";
import { x as escape_html } from "../../chunks/server.js";
//#region src/lib/components/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title = "Agentic Knowledge Workspace", subtitle } = $$props;
		let currentTime = /* @__PURE__ */ new Date();
		$$renderer.push(`<nav class="bg-white shadow-lg border-b border-gray-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between h-16"><div class="flex items-center"><div class="flex-shrink-0 flex items-center"><span class="text-3xl mr-3">🤖</span> <div><h1 class="text-xl font-bold text-gray-900">${escape_html(title)}</h1> `);
		if (subtitle) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-gray-500">${escape_html(subtitle)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="hidden md:ml-6 md:flex md:space-x-8"><a href="/" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</a> <a href="/agents" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Agents</a> <a href="/knowledge" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Knowledge</a> <a href="/workflows" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Workflows</a> <a href="/tasks" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Tasks</a> <a href="/tools" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Tools</a></div></div> <div class="flex items-center space-x-4"><div class="hidden md:block text-sm text-gray-600">${escape_html(currentTime.toLocaleTimeString("th-TH"))}</div> <div class="flex items-center"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">A</div></div> <div class="md:hidden flex items-center"><button class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
		$$renderer.push(`<!--]--></svg></button></div></div></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="min-h-screen bg-gray-50">`);
	Navbar($$renderer, {});
	$$renderer.push(`<!----> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
	children($$renderer);
	$$renderer.push(`<!----></main> <footer class="bg-white border-t border-gray-200 mt-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><p class="text-center text-sm text-gray-500">© 2025 Agentic Knowledge Workspace. Built with SvelteKit</p></div></footer></div>`);
}
//#endregion
export { _layout as default };
