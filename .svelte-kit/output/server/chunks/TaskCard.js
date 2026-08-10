import { b as attr, x as escape_html } from "./server.js";
//#region src/lib/scheduler/index.ts
var Scheduler = class {
	tasks = /* @__PURE__ */ new Map();
	intervals = /* @__PURE__ */ new Map();
	scheduleTask(task) {
		const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const scheduledTask = {
			...task,
			id,
			lastRun: void 0,
			nextRun: this.calculateNextRun(task.cronExpression)
		};
		this.tasks.set(id, scheduledTask);
		if (task.enabled) this.startTask(scheduledTask);
		return scheduledTask;
	}
	calculateNextRun(cronExpression) {
		return new Date((/* @__PURE__ */ new Date()).getTime() + 6e4);
	}
	startTask(task) {
		if (this.intervals.has(task.id)) this.stopTask(task.id);
		const interval = setInterval(() => {
			if (task.enabled) {
				this.executeTask(task);
				task.lastRun = /* @__PURE__ */ new Date();
				task.nextRun = this.calculateNextRun(task.cronExpression);
			}
		}, 6e4);
		this.intervals.set(task.id, interval);
	}
	async executeTask(task) {
		console.log(`Executing scheduled task: ${task.name} (${task.id})`);
	}
	stopTask(taskId) {
		const interval = this.intervals.get(taskId);
		if (interval) {
			clearInterval(interval);
			this.intervals.delete(taskId);
			return true;
		}
		return false;
	}
	enableTask(taskId) {
		const task = this.tasks.get(taskId);
		if (!task) return false;
		task.enabled = true;
		this.startTask(task);
		return true;
	}
	disableTask(taskId) {
		const task = this.tasks.get(taskId);
		if (!task) return false;
		task.enabled = false;
		this.stopTask(taskId);
		return true;
	}
	getTask(taskId) {
		return this.tasks.get(taskId);
	}
	getAllTasks() {
		return Array.from(this.tasks.values());
	}
	getEnabledTasks() {
		return Array.from(this.tasks.values()).filter((t) => t.enabled);
	}
	deleteTask(taskId) {
		this.stopTask(taskId);
		return this.tasks.delete(taskId);
	}
	updateTask(taskId, updates) {
		const task = this.tasks.get(taskId);
		if (!task) return false;
		const wasEnabled = task.enabled;
		Object.assign(task, updates);
		if (task.enabled && !wasEnabled) this.startTask(task);
		else if (!task.enabled && wasEnabled) this.stopTask(taskId);
		return true;
	}
};
var scheduler = new Scheduler();
function getAllTasks() {
	return scheduler.getAllTasks();
}
//#endregion
//#region src/lib/components/TaskCard.svelte
function TaskCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { task } = $$props;
		$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-orange-500"><div class="flex justify-between items-start mb-3"><div><h3 class="font-semibold text-lg text-gray-900">${escape_html(task.name)}</h3> <p class="text-sm text-gray-500 font-mono mt-1">${escape_html(task.cronExpression)}</p></div> <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer"${attr("checked", task.enabled, true)}/> <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div></label></div> <div class="mb-3"><p class="text-sm text-gray-600"><span class="font-medium">Action:</span> ${escape_html(task.action)}</p> `);
		if (task.workflowId) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-gray-600"><span class="font-medium">Workflow:</span> ${escape_html(task.workflowId)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-3 pt-3 border-t"><div><p class="text-xs text-gray-500">Last Run</p> <p class="text-sm font-medium text-gray-700">${escape_html(task.lastRun ? new Date(task.lastRun).toLocaleString("th-TH") : "ยังไม่เคยรัน")}</p></div> <div><p class="text-xs text-gray-500">Next Run</p> <p class="text-sm font-medium text-orange-600">${escape_html(task.nextRun ? new Date(task.nextRun).toLocaleString("th-TH") : "ไม่ได้กำหนด")}</p></div></div></div>`);
	});
}
//#endregion
export { getAllTasks as n, TaskCard as t };
