import { a as head, i as ensure_array_like } from "../../../chunks/server.js";
import { n as getAllAgents, t as AgentCard } from "../../../chunks/AgentCard.js";
//#region src/routes/agents/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const agents = getAllAgents();
		head("h3sa6j", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Agents - Agentic Knowledge Workspace</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 mb-2">👥 Agents</h1> <p class="text-gray-600">จัดการและติดตามสถานะของ Multi-Agent System</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
		const each_array = ensure_array_like(agents);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let agent = each_array[$$index];
			AgentCard($$renderer, { agent });
		}
		$$renderer.push(`<!--]--></div> `);
		if (agents.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มี Agents</h3> <p class="mt-1 text-sm text-gray-500">ยังไม่ได้เพิ่ม Agents เข้าในระบบ</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
