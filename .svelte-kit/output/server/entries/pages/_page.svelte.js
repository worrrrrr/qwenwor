import { a as head, i as ensure_array_like, x as escape_html } from "../../chunks/server.js";
import { n as getAllAgents, t as AgentCard } from "../../chunks/AgentCard.js";
import { n as getAllKnowledge } from "../../chunks/KnowledgeCard.js";
import { n as getActiveWorkflows, r as getAllWorkflows, t as WorkflowCard } from "../../chunks/WorkflowCard.js";
import { n as getAllTasks } from "../../chunks/TaskCard.js";
import { n as getAllTools } from "../../chunks/ToolCard.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const agents = getAllAgents();
		const knowledge = getAllKnowledge();
		const workflows = getAllWorkflows();
		const activeWorkflows = getActiveWorkflows();
		const tasks = getAllTasks();
		const tools = getAllTools();
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard - Agentic Knowledge Workspace</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><h1 class="text-4xl font-bold text-gray-900 mb-2">🤖 Agentic Knowledge Workspace</h1> <p class="text-gray-600">Multi-Agent System สำหรับการจัดการความรู้และการทำงานอัตโนมัติ</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"><a href="/agents" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"><div class="flex items-center mb-4"><span class="text-3xl mr-3">👥</span> <h2 class="text-xl font-semibold">Agents</h2></div> <p class="text-3xl font-bold text-blue-600 mb-2">${escape_html(agents.length)}</p> <ul class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(agents.slice(0, 3));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let agent = each_array[$$index];
			$$renderer.push(`<li class="flex items-center text-sm"><span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span> ${escape_html(agent.name)} (${escape_html(agent.identity.role)})</li>`);
		}
		$$renderer.push(`<!--]--> `);
		if (agents.length > 3) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<li class="text-sm text-blue-600">+${escape_html(agents.length - 3)} more</li>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></ul></a> <a href="/knowledge" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"><div class="flex items-center mb-4"><span class="text-3xl mr-3">📚</span> <h2 class="text-xl font-semibold">Knowledge Base</h2></div> <p class="text-3xl font-bold text-green-600 mb-2">${escape_html(knowledge.length)}</p> <p class="text-sm text-gray-500">เอกสารและความรู้ในระบบ</p></a> <a href="/workflows" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"><div class="flex items-center mb-4"><span class="text-3xl mr-3">⚙️</span> <h2 class="text-xl font-semibold">Workflows</h2></div> <p class="text-3xl font-bold text-purple-600 mb-2">${escape_html(workflows.length)}</p> <p class="text-sm text-gray-500">${escape_html(activeWorkflows.length)} กำลังทำงาน</p></a> <a href="/tasks" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"><div class="flex items-center mb-4"><span class="text-3xl mr-3">⏰</span> <h2 class="text-xl font-semibold">Scheduled Tasks</h2></div> <p class="text-3xl font-bold text-orange-600 mb-2">${escape_html(tasks.length)}</p> <p class="text-sm text-gray-500">งานอัตโนมัติ</p></a> <a href="/tools" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"><div class="flex items-center mb-4"><span class="text-3xl mr-3">🛠️</span> <h2 class="text-xl font-semibold">Tools</h2></div> <p class="text-3xl font-bold text-red-600 mb-2">${escape_html(tools.length)}</p> <p class="text-sm text-gray-500">เครื่องมือที่พร้อมใช้งาน</p></a> <div class="bg-white rounded-lg shadow-md p-6"><div class="flex items-center mb-4"><span class="text-3xl mr-3">🧠</span> <h2 class="text-xl font-semibold">Memory System</h2></div> <p class="text-lg font-medium text-indigo-600">เปิดใช้งาน</p> <p class="text-sm text-gray-500 mt-2">Short-term, Long-term, Episodic, Semantic</p></div></div> `);
		if (agents.length > 0 || workflows.length > 0 || tasks.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
			if (agents.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-6"><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">👥 Recent Agents</h2> <a href="/agents" class="text-sm text-blue-600 hover:underline">View All</a></div> <div class="space-y-3"><!--[-->`);
				const each_array_1 = ensure_array_like(agents.slice(0, 3));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let agent = each_array_1[$$index_1];
					AgentCard($$renderer, { agent });
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (workflows.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-6"><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">⚙️ Active Workflows</h2> <a href="/workflows" class="text-sm text-blue-600 hover:underline">View All</a></div> <div class="space-y-3"><!--[-->`);
				const each_array_2 = ensure_array_like(activeWorkflows.slice(0, 2));
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let workflow = each_array_2[$$index_2];
					WorkflowCard($$renderer, { workflow });
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-8 bg-white rounded-lg shadow-md p-6"><h2 class="text-2xl font-semibold mb-4">🎯 องค์ประกอบหลักของระบบ</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Knowledge Base (RAG)</h3> <p class="text-sm text-gray-600">ระบบจัดเก็บและค้นหาความรู้</p></div></div> <div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Memory + Identity</h3> <p class="text-sm text-gray-600">จัดการตัวตนและความจำของ Agent</p></div></div> <div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Multi-Agent System</h3> <p class="text-sm text-gray-600">ก็อต, น้องบี, Brian</p></div></div> <div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Workflow Engine</h3> <p class="text-sm text-gray-600">จัดการลำดับขั้นตอนการทำงาน</p></div></div> <div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Automation Scheduler</h3> <p class="text-sm text-gray-600">รันงานตามเวลาที่กำหนด</p></div></div> <div class="flex items-start"><span class="text-green-500 mr-2">✓</span> <div><h3 class="font-medium">Tools &amp; Actions</h3> <p class="text-sm text-gray-600">ชุดเครื่องมือที่ Agent เรียกใช้</p></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
