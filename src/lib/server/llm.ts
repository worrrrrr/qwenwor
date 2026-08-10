// ============================================================
// LLM Router — ส่งคำขอไปยัง AI provider ที่พร้อมใช้งาน
// ลำดับ: Groq → Gemini → DeepSeek → Ollama (ตาม key ใน .env)
// ============================================================
import { env } from '$env/dynamic/private';

export interface LLMHistoryItem {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface GenerateOptions {
	provider: string;
	model: string;
	system?: string;
	history: LLMHistoryItem[];
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = 60000) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const res = await fetch(url, { ...init, signal: ctrl.signal });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} finally {
		clearTimeout(t);
	}
}

function withSystem(system: string | undefined, history: LLMHistoryItem[]) {
	const msgs: LLMHistoryItem[] = [];
	if (system) msgs.push({ role: 'system', content: system });
	return msgs.concat(history);
}

async function callGroq(system: string | undefined, history: LLMHistoryItem[], model: string) {
	const key = env.GROQ_API_KEY;
	const m = model || env.GROQ_MODEL || 'llama-3.3-70b-versatile';
	if (!key) throw new Error('ยังไม่ได้ตั้งค่า GROQ_API_KEY');

	const data = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
		body: JSON.stringify({ model: m, messages: withSystem(system, history), temperature: 0.7 })
	});
	return data.choices?.[0]?.message?.content;
}

async function callDeepSeek(system: string | undefined, history: LLMHistoryItem[], model: string) {
	const key = env.DEEPSEEK_API_KEY;
	const m = model || env.DEEPSEEK_MODEL || 'deepseek-chat';
	if (!key) throw new Error('ยังไม่ได้ตั้งค่า DEEPSEEK_API_KEY');

	const data = await fetchJson('https://api.deepseek.com/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
		body: JSON.stringify({ model: m, messages: withSystem(system, history), temperature: 0.7 })
	});
	return data.choices?.[0]?.message?.content;
}

async function callGemini(system: string | undefined, history: LLMHistoryItem[], model: string) {
	const key = env.GEMINI_API_KEY;
	const m = model || env.GEMINI_MODEL || 'gemini-2.0-flash';
	if (!key) throw new Error('ยังไม่ได้ตั้งค่า GEMINI_API_KEY');

	const contents = history.map((h) => ({
		role: h.role === 'assistant' ? 'model' : h.role,
		parts: [{ text: h.content }]
	}));
	const payload: any = { contents };
	if (system) payload.systemInstruction = { parts: [{ text: system }] };

	const data = await fetchJson(
		`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
		{ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }
	);
	return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

async function callOllama(system: string | undefined, history: LLMHistoryItem[], model: string) {
	const base = env.OLLAMA_BASE_URL;
	const m = model || env.OLLAMA_MODEL || 'qwen2.5';
	if (!base) throw new Error('ยังไม่ได้ตั้งค่า OLLAMA_BASE_URL');

	const headers: Record<string, string> = { 'content-type': 'application/json' };
	if (env.OLLAMA_API_KEY) headers.authorization = `Bearer ${env.OLLAMA_API_KEY}`;

	const data = await fetchJson(`${base}/api/chat`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ model: m, messages: withSystem(system, history), stream: false })
	});
	return data.message?.content;
}

const callers: Record<string, (s: string | undefined, h: LLMHistoryItem[], m: string) => Promise<string | undefined>> = {
	groq: callGroq,
	gemini: callGemini,
	deepseek: callDeepSeek,
	ollama: callOllama
};

// ลอง provider ที่ Agent เลือกก่อน แล้ว fallback ผ่านตัวอื่นที่เหลือ
export async function generateReply({
	provider,
	model,
	system,
	history
}: GenerateOptions): Promise<{ text: string; provider: string; model: string }> {
	const order = [...new Set([provider, 'groq', 'gemini', 'deepseek', 'ollama'])];

	let lastError: unknown;
	for (const p of order) {
		const fn = callers[p];
		if (!fn) continue;
		try {
			const text = await fn(system, history, model);
			if (text && text.trim()) {
				return { text: text.trim(), provider: p, model: model || '' };
			}
		} catch (e) {
			lastError = e;
		}
	}

	throw lastError ?? new Error('ไม่มี AI provider ที่ใช้งานได้');
}

// สร้าง System prompt จากตัวตนของ Agent
export function buildAgentSystemPrompt(agent: Record<string, any>): string {
	const id = agent.identity ?? {};
	const capabilities = Array.isArray(agent.capabilities) ? agent.capabilities : [];
	return [
		`คุณคือ Agent ชื่อ "${agent.name}" ในระบบ Agentic Knowledge Workspace`,
		id.role ? `บทบาท: ${id.role}` : '',
		id.personality ? `บุคลิก: ${id.personality}` : '',
		id.description ? `คำอธิบาย: ${id.description}` : '',
		capabilities.length ? `ความสามารถ: ${capabilities.join(', ')}` : '',
		'ตอบเป็นภาษาไทย ใช้บุคลิกและบทบาทของคุณ ตอบให้ตรงประเด็น กระชับ แต่ครอบคลุม'
	]
		.filter(Boolean)
		.join('\n');
}
