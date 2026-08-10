import { a as head, i as ensure_array_like } from "../../../chunks/server.js";
import { n as getAllTasks, t as TaskCard } from "../../../chunks/TaskCard.js";
//#region src/routes/tasks/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const tasks = getAllTasks();
		head("1pluywh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Scheduled Tasks - Agentic Knowledge Workspace</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 mb-2">⏰ Scheduled Tasks</h1> <p class="text-gray-600">จัดการงานอัตโนมัติที่รันตามเวลาที่กำหนด</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
		const each_array = ensure_array_like(tasks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let task = each_array[$$index];
			TaskCard($$renderer, { task });
		}
		$$renderer.push(`<!--]--></div> `);
		if (tasks.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มี Scheduled Tasks</h3> <p class="mt-1 text-sm text-gray-500">ยังไม่ได้สร้างงานอัตโนมัติในระบบ</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
