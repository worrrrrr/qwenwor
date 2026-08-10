import { i as ensure_array_like, x as escape_html } from "./server.js";
//#region src/lib/tools/index.ts
var ToolRegistry = class {
	tools = /* @__PURE__ */ new Map();
	register(tool) {
		this.tools.set(tool.id, tool);
	}
	get(id) {
		return this.tools.get(id);
	}
	getAll() {
		return Array.from(this.tools.values());
	}
	unregister(id) {
		return this.tools.delete(id);
	}
	async executeTool(toolId, params) {
		const tool = this.get(toolId);
		if (!tool) throw new Error(`Tool ${toolId} not found`);
		return await tool.execute(params);
	}
};
var toolRegistry = new ToolRegistry();
[
	{
		id: "search_web",
		name: "Search Web",
		description: "ค้นหาข้อมูลจากอินเทอร์เน็ต",
		parameters: [{
			name: "query",
			type: "string",
			description: "คำค้นหา",
			required: true
		}],
		execute: async (params) => {
			console.log("Searching web for:", params.query);
			return {
				results: [],
				query: params.query
			};
		}
	},
	{
		id: "read_file",
		name: "Read File",
		description: "อ่านไฟล์จาก Knowledge Base",
		parameters: [{
			name: "fileId",
			type: "string",
			description: "รหัสไฟล์",
			required: true
		}],
		execute: async (params) => {
			console.log("Reading file:", params.fileId);
			return {
				content: "",
				fileId: params.fileId
			};
		}
	},
	{
		id: "send_message",
		name: "Send Message",
		description: "ส่งข้อความไปยัง Agent อื่น",
		parameters: [{
			name: "recipientId",
			type: "string",
			description: "ผู้รับ",
			required: true
		}, {
			name: "content",
			type: "string",
			description: "เนื้อหา",
			required: true
		}],
		execute: async (params) => {
			console.log("Sending message to:", params.recipientId, params.content);
			return {
				success: true,
				recipientId: params.recipientId
			};
		}
	},
	{
		id: "create_document",
		name: "Create Document",
		description: "สร้างเอกสารใหม่ใน Knowledge Base",
		parameters: [
			{
				name: "title",
				type: "string",
				description: "ชื่อเอกสาร",
				required: true
			},
			{
				name: "content",
				type: "string",
				description: "เนื้อหา",
				required: true
			},
			{
				name: "tags",
				type: "array",
				description: "แท็ก",
				required: false
			}
		],
		execute: async (params) => {
			console.log("Creating document:", params.title);
			return {
				id: `doc_${Date.now()}`,
				title: params.title
			};
		}
	},
	{
		id: "run_workflow",
		name: "Run Workflow",
		description: "รัน Workflow ที่กำหนด",
		parameters: [{
			name: "workflowId",
			type: "string",
			description: "รหัส Workflow",
			required: true
		}],
		execute: async (params) => {
			console.log("Running workflow:", params.workflowId);
			return {
				workflowId: params.workflowId,
				status: "started"
			};
		}
	},
	{
		id: "schedule_task",
		name: "Schedule Task",
		description: "ตั้งเวลางานอัตโนมัติ",
		parameters: [
			{
				name: "name",
				type: "string",
				description: "ชื่องาน",
				required: true
			},
			{
				name: "cronExpression",
				type: "string",
				description: "Cron expression",
				required: true
			},
			{
				name: "action",
				type: "string",
				description: "การกระทำ",
				required: true
			}
		],
		execute: async (params) => {
			console.log("Scheduling task:", params.name);
			return {
				taskId: `task_${Date.now()}`,
				name: params.name
			};
		}
	}
].forEach((tool) => toolRegistry.register(tool));
function getAllTools() {
	return toolRegistry.getAll();
}
//#endregion
//#region src/lib/components/ToolCard.svelte
function ToolCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { tool } = $$props;
		$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-red-500"><div class="flex items-start justify-between mb-3"><div class="flex items-center"><div class="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center text-white mr-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div> <div><h3 class="font-semibold text-lg text-gray-900">${escape_html(tool.name)}</h3> <p class="text-xs text-gray-500">ID: ${escape_html(tool.id)}</p></div></div></div> <p class="text-sm text-gray-600 mb-3">${escape_html(tool.description)}</p> `);
		if (tool.parameters && tool.parameters.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-3"><h4 class="text-xs font-medium text-gray-500 uppercase mb-2">Parameters</h4> <div class="space-y-1"><!--[-->`);
			const each_array = ensure_array_like(tool.parameters);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let param = each_array[$$index];
				$$renderer.push(`<div class="flex items-center text-sm"><span class="font-mono text-blue-600 mr-2">${escape_html(param.name)}</span> <span class="text-gray-400 mr-2">:</span> <span class="text-gray-600">${escape_html(param.type)}</span> `);
				if (param.required) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">required</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="pt-3 border-t"><button class="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium transition-colors">Execute Tool</button></div></div>`);
	});
}
//#endregion
export { getAllTools as n, ToolCard as t };
