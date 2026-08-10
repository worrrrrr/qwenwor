import { i as ensure_array_like, x as escape_html } from "./server.js";
//#region src/lib/agents/index.ts
var agents = [
	{
		id: "god",
		name: "ก็อต",
		identity: {
			personality: "เป็นมิตร ชอบช่วยเหลือ มีความเป็นผู้นำ",
			traits: [
				"friendly",
				"helpful",
				"leadership",
				"creative"
			],
			role: "Main Coordinator & Creative Director",
			description: "ก็อตเป็น Agent หลักที่ทำหน้าที่ประสานงานและดูแลภาพรวมของโปรเจกต์"
		},
		memory: [],
		capabilities: [
			"coordination",
			"creative_writing",
			"planning",
			"review"
		],
		status: "idle"
	},
	{
		id: "bee",
		name: "น้องบี",
		identity: {
			personality: "ขยัน ละเอียดรอบคอบ ชอบเรียนรู้",
			traits: [
				"diligent",
				"detail-oriented",
				"curious",
				"analytical"
			],
			role: "Research Assistant & Data Analyst",
			description: "น้องบีเชี่ยวชาญด้านการค้นหาข้อมูลและการวิเคราะห์ข้อมูล"
		},
		memory: [],
		capabilities: [
			"research",
			"data_analysis",
			"summarization",
			"fact_checking"
		],
		status: "idle"
	},
	{
		id: "brian",
		name: "Brian",
		identity: {
			personality: "เป็นระบบ มีเหตุผล ชอบแก้ปัญหา",
			traits: [
				"logical",
				"systematic",
				"problem-solver",
				"technical"
			],
			role: "Technical Specialist & Workflow Engineer",
			description: "Brian เชี่ยวชาญด้านเทคนิคและการจัดการ Workflow"
		},
		memory: [],
		capabilities: [
			"coding",
			"workflow_design",
			"automation",
			"debugging"
		],
		status: "idle"
	}
];
function getAllAgents() {
	return agents;
}
//#endregion
//#region src/lib/components/AgentCard.svelte
function AgentCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { agent } = $$props;
		$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"><div class="flex items-start justify-between mb-3"><div class="flex items-center"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">${escape_html(agent.name.charAt(0))}</div> <div><h3 class="font-semibold text-lg text-gray-900">${escape_html(agent.name)}</h3> <p class="text-sm text-gray-500">${escape_html(agent.identity.role)}</p></div></div> <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span></div> <div class="mb-3"><p class="text-sm text-gray-600 line-clamp-2">${escape_html(agent.description)}</p></div> <div class="border-t pt-3"><div class="flex items-center justify-between text-xs text-gray-500 mb-2"><span>Capabilities:</span> <span>${escape_html(agent.capabilities.length)} skills</span></div> <div class="flex flex-wrap gap-1"><!--[-->`);
		const each_array = ensure_array_like(agent.capabilities.slice(0, 3));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let capability = each_array[$$index];
			$$renderer.push(`<span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">${escape_html(capability)}</span>`);
		}
		$$renderer.push(`<!--]--> `);
		if (agent.capabilities.length > 3) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">+${escape_html(agent.capabilities.length - 3)} more</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
export { getAllAgents as n, AgentCard as t };
