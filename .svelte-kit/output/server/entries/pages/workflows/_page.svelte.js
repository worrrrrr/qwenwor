import { a as head, i as ensure_array_like, x as escape_html } from "../../../chunks/server.js";
import { n as getActiveWorkflows, r as getAllWorkflows, t as WorkflowCard } from "../../../chunks/WorkflowCard.js";
//#region src/routes/workflows/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const workflows = getAllWorkflows();
		const activeWorkflows = getActiveWorkflows();
		head("1k5z4u1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Workflows - Agentic Knowledge Workspace</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><div class="flex justify-between items-center"><div><h1 class="text-3xl font-bold text-gray-900 mb-2">⚙️ Workflows</h1> <p class="text-gray-600">จัดการลำดับขั้นตอนการทำงานอัตโนมัติ</p></div> <div class="text-right"><p class="text-sm text-gray-500">${escape_html(workflows.length)} workflows ทั้งหมด</p> <p class="text-sm text-blue-600 font-medium">${escape_html(activeWorkflows.length)} กำลังทำงาน</p></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
		const each_array = ensure_array_like(workflows);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let workflow = each_array[$$index];
			WorkflowCard($$renderer, { workflow });
		}
		$$renderer.push(`<!--]--></div> `);
		if (workflows.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg> <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มี Workflows</h3> <p class="mt-1 text-sm text-gray-500">ยังไม่ได้สร้าง workflow ในระบบ</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
