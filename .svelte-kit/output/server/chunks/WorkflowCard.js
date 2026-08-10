import { i as ensure_array_like, n as attr_style, s as stringify, t as attr_class, x as escape_html } from "./server.js";
//#region src/lib/workflow/index.ts
var WorkflowEngine = class {
	workflows = /* @__PURE__ */ new Map();
	activeWorkflows = /* @__PURE__ */ new Set();
	createWorkflow(name, steps) {
		const id = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const workflow = {
			id,
			name,
			steps: steps.map((step, index) => ({
				...step,
				id: `step_${index}_${Math.random().toString(36).substr(2, 6)}`,
				status: "pending"
			})),
			status: "pending",
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		this.workflows.set(id, workflow);
		return workflow;
	}
	async executeWorkflow(workflowId) {
		const workflow = this.workflows.get(workflowId);
		if (!workflow) throw new Error(`Workflow ${workflowId} not found`);
		this.activeWorkflows.add(workflowId);
		workflow.status = "running";
		workflow.updatedAt = /* @__PURE__ */ new Date();
		for (const step of workflow.steps) {
			if (workflow.status !== "running") break;
			step.status = "running";
			try {
				await this.executeStep(step);
				step.status = "completed";
			} catch (error) {
				step.status = "failed";
				workflow.status = "failed";
				workflow.updatedAt = /* @__PURE__ */ new Date();
				this.activeWorkflows.delete(workflowId);
				return workflow;
			}
		}
		if (workflow.status === "running") workflow.status = "completed";
		workflow.updatedAt = /* @__PURE__ */ new Date();
		this.activeWorkflows.delete(workflowId);
		return workflow;
	}
	async executeStep(step) {
		return new Promise((resolve) => setTimeout(resolve, 100));
	}
	getWorkflow(id) {
		return this.workflows.get(id);
	}
	getAllWorkflows() {
		return Array.from(this.workflows.values());
	}
	getActiveWorkflows() {
		return Array.from(this.activeWorkflows).map((id) => this.workflows.get(id)).filter((w) => w !== void 0);
	}
	cancelWorkflow(workflowId) {
		const workflow = this.workflows.get(workflowId);
		if (!workflow) return false;
		if (workflow.status === "running" || workflow.status === "pending") {
			workflow.status = "failed";
			workflow.updatedAt = /* @__PURE__ */ new Date();
			this.activeWorkflows.delete(workflowId);
			for (const step of workflow.steps) if (step.status === "pending") step.status = "skipped";
			return true;
		}
		return false;
	}
	deleteWorkflow(workflowId) {
		this.cancelWorkflow(workflowId);
		return this.workflows.delete(workflowId);
	}
};
var workflowEngine = new WorkflowEngine();
function getAllWorkflows() {
	return workflowEngine.getAllWorkflows();
}
function getActiveWorkflows() {
	return workflowEngine.getActiveWorkflows();
}
//#endregion
//#region src/lib/components/WorkflowCard.svelte
function WorkflowCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { workflow } = $$props;
		function getStatusColor(status) {
			switch (status) {
				case "pending": return "bg-gray-100 text-gray-700";
				case "running": return "bg-blue-100 text-blue-700 animate-pulse";
				case "completed": return "bg-green-100 text-green-700";
				case "failed": return "bg-red-100 text-red-700";
				default: return "bg-gray-100 text-gray-700";
			}
		}
		function getStatusText(status) {
			return {
				pending: "รอทำงาน",
				running: "กำลังทำงาน",
				completed: "เสร็จสิ้น",
				failed: "ล้มเหลว"
			}[status] || status;
		}
		$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"><div class="flex justify-between items-start mb-3"><h3 class="font-semibold text-lg text-gray-900">${escape_html(workflow.name)}</h3> <span${attr_class(`px-2 py-1 text-xs rounded-full ${stringify(getStatusColor(workflow.status))}`)}>${escape_html(getStatusText(workflow.status))}</span></div> <div class="mb-4"><div class="flex items-center justify-between text-sm text-gray-600 mb-2"><span>Progress</span> <span>${escape_html(workflow.steps.filter((s) => s.status === "completed").length)} / ${escape_html(workflow.steps.length)} steps</span></div> <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-purple-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(workflow.steps.filter((s) => s.status === "completed").length / workflow.steps.length * 100)}%`)}></div></div></div> <div class="space-y-2"><h4 class="text-sm font-medium text-gray-700">ขั้นตอน:</h4> <!--[-->`);
		const each_array = ensure_array_like(workflow.steps);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let step = each_array[index];
			$$renderer.push(`<div class="flex items-center text-sm"><span${attr_class(`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${step.status === "completed" ? "bg-green-500 text-white" : ""} ${step.status === "running" ? "bg-blue-500 text-white" : ""} ${step.status === "pending" ? "bg-gray-300 text-gray-600" : ""} ${step.status === "failed" ? "bg-red-500 text-white" : ""} ${step.status === "skipped" ? "bg-gray-200 text-gray-500" : ""} `)}>${escape_html(index + 1)}</span> <span class="flex-1 text-gray-700">${escape_html(step.name)}</span> <span class="text-xs text-gray-500">${escape_html(step.agentId)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500"><span>สร้าง: ${escape_html(new Date(workflow.createdAt).toLocaleDateString("th-TH"))}</span> <span>อัพเดท: ${escape_html(new Date(workflow.updatedAt).toLocaleDateString("th-TH"))}</span></div></div>`);
	});
}
//#endregion
export { getActiveWorkflows as n, getAllWorkflows as r, WorkflowCard as t };
