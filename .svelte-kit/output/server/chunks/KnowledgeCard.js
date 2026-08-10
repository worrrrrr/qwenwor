import { i as ensure_array_like, x as escape_html } from "./server.js";
//#region src/lib/knowledge/index.ts
var KnowledgeBaseStore = class {
	store = /* @__PURE__ */ new Map();
	add(knowledge) {
		this.store.set(knowledge.id, knowledge);
	}
	get(id) {
		return this.store.get(id);
	}
	search(query, limit = 10) {
		const results = [];
		const queryLower = query.toLowerCase();
		for (const kb of this.store.values()) if (kb.title.toLowerCase().includes(queryLower) || kb.content.toLowerCase().includes(queryLower)) {
			results.push(kb);
			if (results.length >= limit) break;
		}
		return results;
	}
	getAll() {
		return Array.from(this.store.values());
	}
	delete(id) {
		return this.store.delete(id);
	}
	update(id, updates) {
		const existing = this.get(id);
		if (!existing) return false;
		const updated = {
			...existing,
			...updates
		};
		this.store.set(id, updated);
		return true;
	}
};
var knowledgeBaseStore = new KnowledgeBaseStore();
function getAllKnowledge() {
	return knowledgeBaseStore.getAll();
}
//#endregion
//#region src/lib/components/KnowledgeCard.svelte
function KnowledgeCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { knowledge } = $$props;
		$$renderer.push(`<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-green-500"><div class="flex justify-between items-start mb-2"><h3 class="font-semibold text-lg text-gray-900 line-clamp-1">${escape_html(knowledge.title)}</h3> <span class="text-xs text-gray-400 whitespace-nowrap ml-2">${escape_html(new Date(knowledge.metadata.updatedAt).toLocaleDateString("th-TH"))}</span></div> <p class="text-sm text-gray-600 mb-3 line-clamp-2">${escape_html(knowledge.content.substring(0, 150))}${escape_html(knowledge.content.length > 150 ? "..." : "")}</p> <div class="flex flex-wrap gap-2 mb-3"><!--[-->`);
		const each_array = ensure_array_like(knowledge.metadata.tags);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tag = each_array[$$index];
			$$renderer.push(`<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">#${escape_html(tag)}</span>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t"><div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span>${escape_html(knowledge.metadata.source)}</span></div> `);
		if (knowledge.metadata.agentId) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-blue-600">Agent: ${escape_html(knowledge.metadata.agentId)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { getAllKnowledge as n, KnowledgeCard as t };
