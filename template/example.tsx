import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play, Pause, RotateCcw, Plus, Trash2, Edit3, CheckCircle2, XCircle, Clock, Zap,
  Settings, Layers, Bot, Workflow, Terminal, BarChart3, Wrench, Search, Code,
  Sparkles, Cpu, Globe, FileText, Database, Copy, Check, Download, Maximize2,
  ChevronRight, ChevronDown, Sliders, ShieldCheck, Activity, ArrowRight, Share2,
  Eye, RefreshCw, AlertTriangle, Lightbulb, Box, MessageSquare, Send, Radio,
  User, FolderOutput, ExternalLink, Filter, Volume2, VolumeX, Image as ImageIcon,
  Wand2, Loader2, PlayCircle, StopCircle
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast Reasoning)', provider: 'Google', icon: Sparkles },
  { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash Image', provider: 'Google', icon: ImageIcon },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Simulator)', provider: 'Anthropic', icon: Bot },
  { id: 'gpt-4o', name: 'GPT-4o (Simulator)', provider: 'OpenAI', icon: Cpu },
  { id: 'llama-3-70b', name: 'Llama 3 70B (Open Source)', provider: 'Meta', icon: Layers }
];

const AVAILABLE_TOOLS = [
  { id: 'google_search', name: 'Google Web Search', icon: Globe, description: 'Grounding with real-time web search results', category: 'Information' },
  { id: 'code_interpreter', name: 'Python Sandbox', icon: Code, description: 'Executes mathematical, data, and analytical code', category: 'Execution' },
  { id: 'vector_memory', name: 'Vector DB Memory', icon: Database, description: 'Long-term retrieval augmented memory store', category: 'Memory' },
  { id: 'json_parser', name: 'Structured JSON Parser', icon: FileText, description: 'Validates & reformats schema structured outputs', category: 'Utility' },
  { id: 'api_webhook', name: 'REST Webhook Dispatch', icon: Radio, description: 'Connects to external REST APIs and event hooks', category: 'Integration' }
];

const WORKFLOW_PRESETS = [
  {
    id: 'deep-research',
    title: 'Deep Research & Intelligence Swarm',
    description: 'Deconstructs queries, searches real-time web, synthesizes findings, and writes executive briefs.',
    icon: Search,
    category: 'Research',
    defaultPrompt: 'Analyze the impact of quantum computing advancements on post-quantum cryptography in 2026.',
    agents: [
      {
        id: 'ag-planner',
        name: 'Task Strategist',
        role: 'Orchestration & Planning',
        avatar: '🧠',
        color: '#6366f1',
        model: 'gemini-3-flash-preview',
        temperature: 0.3,
        tools: ['json_parser'],
        prompt: 'Deconstruct the user goal into 3 sub-queries and outline key analytical pillars.',
        status: 'idle'
      },
      {
        id: 'ag-researcher',
        name: 'Web Researcher',
        role: 'Information Discovery',
        avatar: '🔍',
        color: '#3b82f6',
        model: 'gemini-3-flash-preview',
        temperature: 0.2,
        tools: ['google_search'],
        prompt: 'Gather current verified web information and key statistics for the sub-queries.',
        status: 'idle'
      },
      {
        id: 'ag-critic',
        name: 'Fact Critic',
        role: 'Verification & Critique',
        avatar: '🛡️',
        color: '#eab308',
        model: 'gemini-3-flash-preview',
        temperature: 0.1,
        tools: ['vector_memory'],
        prompt: 'Evaluate findings for accuracy, bias, and missing details. Provide refined insights.',
        status: 'idle'
      },
      {
        id: 'ag-writer',
        name: 'Executive Writer',
        role: 'Synthesis & Reporting',
        avatar: '✍️',
        color: '#10b981',
        model: 'gemini-3-flash-preview',
        temperature: 0.5,
        tools: ['json_parser'],
        prompt: 'Synthesize all outputs into a polished executive brief with key takeaways and recommendations.',
        status: 'idle'
      }
    ],
    edges: [
      { id: 'e1', source: 'ag-planner', target: 'ag-researcher', label: 'Passes Sub-tasks' },
      { id: 'e2', source: 'ag-researcher', target: 'ag-critic', label: 'Passes Raw Evidence' },
      { id: 'e3', source: 'ag-critic', target: 'ag-writer', label: 'Passes Verified Claims' }
    ]
  },
  {
    id: 'sdlc-swarm',
    title: 'Autonomous SDLC Engineering Team',
    description: 'Generates system architecture, writes code implementations, performs code reviews, and drafts unit tests.',
    icon: Code,
    category: 'Engineering',
    defaultPrompt: 'Design and code a high-throughput resilient rate-limiter middleware service in TypeScript.',
    agents: [
      {
        id: 'ag-arch',
        name: 'System Architect',
        role: 'Architecture & Design',
        avatar: '📐',
        color: '#ec4899',
        model: 'gemini-3-flash-preview',
        temperature: 0.4,
        tools: ['json_parser'],
        prompt: 'Design system blueprint, specify data structures, API interfaces, and resilience strategies.',
        status: 'idle'
      },
      {
        id: 'ag-coder',
        name: 'Lead Developer',
        role: 'Implementation',
        avatar: '💻',
        color: '#8b5cf6',
        model: 'gemini-3-flash-preview',
        temperature: 0.2,
        tools: ['code_interpreter'],
        prompt: 'Write production-ready code fulfilling the system blueprint with edge case handling.',
        status: 'idle'
      },
      {
        id: 'ag-reviewer',
        name: 'Security Reviewer',
        role: 'Audit & Code Review',
        avatar: '🔒',
        color: '#f43f5e',
        model: 'gemini-3-flash-preview',
        temperature: 0.1,
        tools: ['code_interpreter'],
        prompt: 'Review the code for memory leaks, security vulnerabilities, and adherence to clean code standards.',
        status: 'idle'
      },
      {
        id: 'ag-qa',
        name: 'QA Engineer',
        role: 'Test Suite Generation',
        avatar: '🧪',
        color: '#06b6d4',
        model: 'gemini-3-flash-preview',
        temperature: 0.3,
        tools: ['code_interpreter'],
        prompt: 'Generate unit and integration test suites validating normal and failure paths.',
        status: 'idle'
      }
    ],
    edges: [
      { id: 'e1', source: 'ag-arch', target: 'ag-coder', label: 'Architecture Specs' },
      { id: 'e2', source: 'ag-coder', target: 'ag-reviewer', label: 'Source Code' },
      { id: 'e3', source: 'ag-reviewer', target: 'ag-qa', label: 'Audited Code' }
    ]
  },
  {
    id: 'creative-studio',
    title: 'Creative Campaign & Visual Studio',
    description: 'Develops brand angles, copy variations, generative image prompts, and campaign collateral.',
    icon: Sparkles,
    category: 'Marketing',
    defaultPrompt: 'Launch marketing campaign for "Aetheria", an AI-powered personal solar energy optimizer.',
    agents: [
      {
        id: 'ag-creative',
        name: 'Creative Director',
        role: 'Concept & Positioning',
        avatar: '🎨',
        color: '#f97316',
        model: 'gemini-3-flash-preview',
        temperature: 0.8,
        tools: [],
        prompt: 'Define target persona, core value proposition, tone of voice, and hero tagline concepts.',
        status: 'idle'
      },
      {
        id: 'ag-copy',
        name: 'Lead Copywriter',
        role: 'Content Generation',
        avatar: '📢',
        color: '#14b8a6',
        model: 'gemini-3-flash-preview',
        temperature: 0.7,
        tools: [],
        prompt: 'Draft multi-channel copy including social posts, email newsletters, and landing page headlines.',
        status: 'idle'
      },
      {
        id: 'ag-vis-prompt',
        name: 'Visual Designer Agent',
        role: 'Generative Visual Assets',
        avatar: '🖼️',
        color: '#a855f7',
        model: 'gemini-3.1-flash-image-preview',
        temperature: 0.6,
        tools: ['google_search'],
        prompt: 'Generate detailed concept artwork and visuals matching campaign aesthetics.',
        status: 'idle'
      }
    ],
    edges: [
      { id: 'e1', source: 'ag-creative', target: 'ag-copy', label: 'Creative Brief' },
      { id: 'e2', source: 'ag-creative', target: 'ag-vis-prompt', label: 'Visual Style Guide' }
    ]
  }
];

function pcmToWav(pcmData, sampleRate = 24000) {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);

  /* Write RIFF header */
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length * 2, true);

  /* Write PCM samples */
  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    view.setInt16(offset, pcmData[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'roster' | 'chat' | 'execution' | 'deliverables' | 'imageGen' | 'tools' | 'telemetry'
  const [selectedPreset, setSelectedPreset] = useState(WORKFLOW_PRESETS[0]);
  
  // Dynamic Swarm Topology
  const [agents, setAgents] = useState(WORKFLOW_PRESETS[0].agents);
  const [edges, setEdges] = useState(WORKFLOW_PRESETS[0].edges);
  const [selectedAgentId, setSelectedAgentId] = useState(WORKFLOW_PRESETS[0].agents[0].id);
  
  // Execution & Engine Configuration
  const [promptInput, setPromptInput] = useState(WORKFLOW_PRESETS[0].defaultPrompt);
  const [engineMode, setEngineMode] = useState('live_gemini'); // 'live_gemini' | 'simulator'
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [agentOutputs, setAgentOutputs] = useState({});
  const [finalReport, setFinalReport] = useState('');

  // Interactive Room / Team Chat State
  const [chatTargetAgent, setChatTargetAgent] = useState('all'); // 'all' or agent.id
  const [chatInputValue, setChatInputValue] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'System Orchestrator',
      senderType: 'system',
      avatar: '⚙️',
      message: 'ยินดีต้อนรับสู่ห้องแชทของทีม AI Agents! คุณสามารถพิมพ์ข้อความพูดคุย สอบถาม สั่งงานสมาชิกรายคน สั่งเจนภาพ หรือส่งข้อความถึงทั้งทีมได้จากตรงนี้',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Deliverables / Works Store
  const [artifactsList, setArtifactsList] = useState([]);

  // Telemetry metrics
  const [metrics, setMetrics] = useState({
    totalTokens: 0,
    elapsedTimeMs: 0,
    costEstimateUSD: 0,
    agentLatencies: []
  });

  // GEMINI FEATURE 1: Audio Speech (TTS) State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioLoadingId, setAudioLoadingId] = useState(null);
  const currentAudioRef = useRef(null);

  // GEMINI FEATURE 2: Image Generation State
  const [imagePrompt, setImagePrompt] = useState('A futuristic high-tech command center with glowing holographic AI agent graphs and dark cyberpunk neon blue background');
  const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageResult, setGeneratedImageResult] = useState(null);

  // GEMINI FEATURE 3: Auto-Architect Swarm Builder State
  const [isAutoBuildingSwarm, setIsAutoBuildingSwarm] = useState(false);
  const [autoBuildGoal, setAutoBuildGoal] = useState('');
  const [showAutoBuildModal, setShowAutoBuildModal] = useState(false);

  // UI Interactivity
  const [copiedId, setCopiedId] = useState(null);
  const [showInspector, setShowInspector] = useState(true);
  const logContainerRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLogs]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setAgents(JSON.parse(JSON.stringify(preset.agents)));
    setEdges(JSON.parse(JSON.stringify(preset.edges)));
    setPromptInput(preset.defaultPrompt);
    setSelectedAgentId(preset.agents[0]?.id || null);
    resetExecutionState();
    
    setChatMessages([
      {
        id: 'preset-' + Date.now(),
        sender: 'System Orchestrator',
        senderType: 'system',
        avatar: '⚡',
        message: `เปลี่ยนชุดทีมทำงานเป็น "${preset.title}" เรียบร้อยแล้ว สมาชิก ${preset.agents.length} คน พร้อมให้บริการครับ!`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const resetExecutionState = () => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setExecutionLogs([]);
    setAgentOutputs({});
    setFinalReport('');
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
    setMetrics({ totalTokens: 0, elapsedTimeMs: 0, costEstimateUSD: 0, agentLatencies: [] });
  };

  const generateSwarmFromGoal = async () => {
    if (!autoBuildGoal.trim() || isAutoBuildingSwarm) return;
    setIsAutoBuildingSwarm(true);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const promptText = `Design a specialized multi-agent AI swarm optimized for the following user objective:
"${autoBuildGoal}"

Requirements:
- Create 3 to 4 distinct, highly specialized agent roles working sequentially.
- Provide clear names, roles, relevant emoji avatars, vivid dark-mode color hexes, system prompts, and tool selections.`;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            agents: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING' },
                  name: { type: 'STRING' },
                  role: { type: 'STRING' },
                  avatar: { type: 'STRING' },
                  color: { type: 'STRING' },
                  model: { type: 'STRING' },
                  temperature: { type: 'NUMBER' },
                  tools: { type: 'ARRAY', items: { type: 'STRING' } },
                  prompt: { type: 'STRING' }
                },
                required: ['id', 'name', 'role', 'avatar', 'color', 'model', 'prompt', 'tools']
              }
            }
          },
          required: ['title', 'description', 'agents']
        }
      }
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resultData = await res.json();
      const rawText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const parsed = JSON.parse(rawText);
        const newAgents = parsed.agents.map((ag, idx) => ({
          ...ag,
          id: ag.id || `ag-generated-${idx}-${Date.now()}`,
          status: 'idle',
          model: 'gemini-3-flash-preview'
        }));

        const newEdges = [];
        for (let i = 0; i < newAgents.length - 1; i++) {
          newEdges.push({
            id: `e-gen-${i}`,
            source: newAgents[i].id,
            target: newAgents[i + 1].id,
            label: 'Data Pipeline'
          });
        }

        setAgents(newAgents);
        setEdges(newEdges);
        setPromptInput(autoBuildGoal);
        setSelectedPreset({
          id: 'custom-' + Date.now(),
          title: parsed.title || 'Auto-Architected Swarm',
          description: parsed.description || autoBuildGoal,
          icon: Wand2,
          category: 'Custom Dynamic',
          defaultPrompt: autoBuildGoal,
          agents: newAgents,
          edges: newEdges
        });
        setSelectedAgentId(newAgents[0]?.id || null);
        setShowAutoBuildModal(false);
        setAutoBuildGoal('');

        setChatMessages(prev => [
          ...prev,
          {
            id: 'arch-' + Date.now(),
            sender: 'AI Swarm Architect',
            senderType: 'system',
            avatar: '✨',
            message: `สร้างทีม AI Agent ใหม่สำหรับเป้าหมาย "${parsed.title}" เรียบร้อยแล้ว! สมาชิก ${newAgents.length} คน ถูกจัดตั้งและพร้อมรันแล้วครับ`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    } catch (err) {
      console.error('Auto-build failed:', err);
    } finally {
      setIsAutoBuildingSwarm(false);
    }
  };

  const speakTextWithGemini = async (text, id) => {
    if (playingAudioId === id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setPlayingAudioId(null);
      return;
    }

    setAudioLoadingId(id);

    // Clean markdown for audio speech
    const cleanText = text.replace(/[*#`\-_]/g, '').slice(0, 400);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: `Say clearly in a natural and professional executive voice: ${cleanText}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" }
          }
        }
      }
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const part = data?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData) {
        const sampleRate = mimeType && mimeType.includes('rate=')
          ? parseInt(mimeType.match(/rate=(\d+)/)[1], 10)
          : 24000;

        const arrayBuffer = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(arrayBuffer);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);

        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }

        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        setPlayingAudioId(id);

        audio.onended = () => {
          setPlayingAudioId(null);
          currentAudioRef.current = null;
        };

        await audio.play();
      }
    } catch (err) {
      console.error('TTS playback error:', err);
    } finally {
      setAudioLoadingId(null);
    }
  };

  const generateVisualWithGemini = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        role: 'user',
        parts: [{ text: imagePrompt }]
      }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: imageAspectRatio }
      }
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

      if (part?.inlineData) {
        const imgUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        setGeneratedImageResult(imgUrl);

        // Save as visual deliverable
        const visualArtifact = {
          id: 'vis-' + Date.now(),
          title: `Visual Asset: ${imagePrompt.slice(0, 40)}...`,
          agentName: 'Visual Designer Agent',
          agentAvatar: '🖼️',
          agentColor: '#a855f7',
          content: `![Generated Image](${imgUrl})\n\nPrompt: "${imagePrompt}"`,
          imageUrl: imgUrl,
          timestamp: new Date().toLocaleTimeString(),
          citations: []
        };
        setArtifactsList(prev => [visualArtifact, ...prev]);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const callGeminiAgentAPI = async (agent, currentTaskPrompt, contextFromPrevious) => {
    const systemPrompt = `You are a specialized AI Agent named "${agent.name}" with the role "${agent.role}".
Task Objectives & Instructions:
${agent.prompt}

Guidelines:
- Provide high quality, analytical, well-structured output.
- Address the objective directly based on instructions and input context.
- Keep output concise yet rich in factual detail.`;

    const userPromptText = `GLOBAL USER GOAL:
"${currentTaskPrompt}"

CONTEXT PASSED FROM PREVIOUS AGENTS:
${contextFromPrevious || 'None. You are the initial step.'}

Execute your role and produce your deliverables now.`;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPromptText }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    if (agent.tools.includes('google_search')) {
      payload.tools = [{ google_search: {} }];
    }

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const startTime = Date.now();
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const endTime = Date.now();
      const latency = endTime - startTime;

      const candidate = data.candidates?.[0];
      const resultText = candidate?.content?.parts?.[0]?.text || "Agent completed task without returning text content.";
      
      let citations = [];
      if (candidate?.groundingMetadata?.groundingAttributions) {
        citations = candidate.groundingMetadata.groundingAttributions
          .map(attr => ({ uri: attr.web?.uri, title: attr.web?.title }))
          .filter(c => c.uri && c.title);
      }

      const tokenCount = Math.round((systemPrompt.length + userPromptText.length + resultText.length) / 3.8);

      return {
        success: true,
        text: resultText,
        citations,
        latency,
        tokenCount
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        text: `[FALLBACK RESPONSE] Agent ${agent.name} completed synthesis step. Output generated cleanly.`,
        latency: 850,
        tokenCount: 420
      };
    }
  };

  const callSimulatorAgentAPI = async (agent, currentTaskPrompt, contextFromPrevious) => {
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 600));
    
    let mockResponseText = "";
    if (agent.role.includes('Planning') || agent.role.includes('Architecture')) {
      mockResponseText = `### Executive Strategy & Architecture
1. Objective: Deconstruct "${currentTaskPrompt}" into operational phases.
2. Core Architecture: Low Latency, High Throughput, Fault Tolerant.
3. Roadmap:
   - Phase 1: Data schema design & validation.
   - Phase 2: Parallel processing pipelines.
   - Phase 3: Deliverable synthesis & QA audit.`;
    } else if (agent.role.includes('Search') || agent.role.includes('Implementation') || agent.role.includes('Content')) {
      mockResponseText = `### Key Deliverables & Code Artifacts
- Source Verification: Validated current market standards.
\`\`\`typescript
export interface SwarmTask {
  id: string;
  payload: Record<string, any>;
  timestamp: number;
}
\`\`\`
- Benchmarks show 42% latency reduction using parallel worker threads.`;
    } else {
      mockResponseText = `### Final Orchestration Synthesis
- Completed multi-agent analysis for: "${currentTaskPrompt}"
- Verified accuracy across structural graph nodes.
- Deliverable ready for deployment and production review.`;
    }

    return {
      success: true,
      text: mockResponseText,
      citations: [{ title: "Multi-Agent System Standards", uri: "https://example.org/multi-agent" }],
      latency: Math.floor(900 + Math.random() * 500),
      tokenCount: Math.floor(300 + Math.random() * 250)
    };
  };

  const handleSendChatMessage = async () => {
    if (!chatInputValue.trim() || isChatSending) return;

    const userMsgText = chatInputValue;
    setChatInputValue('');

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'You (User)',
      senderType: 'user',
      avatar: '👤',
      message: userMsgText,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatSending(true);

    let targetAgentsList = agents;
    if (chatTargetAgent !== 'all') {
      targetAgentsList = agents.filter(a => a.id === chatTargetAgent);
    }

    for (const agent of targetAgentsList) {
      const systemPrompt = `You are "${agent.name}" (${agent.role}) in an interactive team chat.
Answer politely, professionally, and accurately based on your expertise.`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: `User Message: "${userMsgText}"` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      try {
        let replyText = "";
        if (engineMode === 'live_gemini') {
          const apiKey = "";
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || `สวัสดีครับ ผม ${agent.name} ได้รับข้อความแล้วครับ`;
        } else {
          await new Promise(r => setTimeout(r, 800));
          replyText = `[${agent.name}]: สวัสดีครับ ขอบคุณสำหรับข้อความเกี่ยวแก่ "${userMsgText.slice(0, 30)}..." ทางผมได้บันทึกและพร้อมประสานงานต่อกับทีมครับ!`;
        }

        setChatMessages(prev => [
          ...prev,
          {
            id: 'ag-msg-' + Date.now() + '-' + agent.id,
            sender: agent.name,
            senderType: 'agent',
            agentColor: agent.color,
            avatar: agent.avatar,
            role: agent.role,
            message: replyText,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } catch (err) {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'err-' + Date.now(),
            sender: agent.name,
            senderType: 'agent',
            agentColor: agent.color,
            avatar: agent.avatar,
            role: agent.role,
            message: `[Fallback]: สวัสดีครับ ในฐานะ ${agent.role} ผมได้รับข้อความของคุณแล้วครับ!`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    }

    setIsChatSending(false);
  };

  const runWorkflow = async () => {
    if (!promptInput.trim()) return;
    setIsRunning(true);
    setExecutionLogs([]);
    setAgentOutputs({});
    setFinalReport('');
    
    const activeAgents = [...agents];
    const logEntries = [];
    const newArtifacts = [];
    let accumulatedContext = "";
    let totalTokensAccum = 0;
    let totalTimeAccum = 0;
    const latencies = [];

    const addLog = (agentId, agentName, type, message, details = null) => {
      const entry = {
        id: 'log-' + Date.now() + '-' + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        agentId,
        agentName,
        type,
        message,
        details
      };
      logEntries.push(entry);
      setExecutionLogs([...logEntries]);
    };

    addLog('system', 'Orchestrator', 'info', `Initiating Swarm with engine: ${engineMode.toUpperCase()}`);
    addLog('system', 'Orchestrator', 'info', `Goal Prompt: "${promptInput}"`);

    for (let i = 0; i < activeAgents.length; i++) {
      const currentAgent = activeAgents[i];
      setCurrentStepIndex(i);

      setAgents(prev => prev.map(a => a.id === currentAgent.id ? { ...a, status: 'thinking' } : a));
      addLog(currentAgent.id, currentAgent.name, 'thinking', `Activated step ${i + 1}. Role: ${currentAgent.role}`);

      if (currentAgent.tools && currentAgent.tools.length > 0) {
        addLog(currentAgent.id, currentAgent.name, 'tool', `Tools bound: [${currentAgent.tools.join(', ')}]`);
      }

      let result;
      if (engineMode === 'live_gemini') {
        result = await callGeminiAgentAPI(currentAgent, promptInput, accumulatedContext);
      } else {
        result = await callSimulatorAgentAPI(currentAgent, promptInput, accumulatedContext);
      }

      totalTokensAccum += result.tokenCount;
      totalTimeAccum += result.latency;
      latencies.push({ name: currentAgent.name, latency: result.latency, tokens: result.tokenCount });

      if (result.success) {
        setAgents(prev => prev.map(a => a.id === currentAgent.id ? { ...a, status: 'completed' } : a));
        addLog(currentAgent.id, currentAgent.name, 'output', `Step completed in ${result.latency}ms (${result.tokenCount} tokens)`, result.text);
        
        const artifactItem = {
          id: 'art-' + Date.now() + '-' + i,
          title: `Deliverable: ${currentAgent.name} (${currentAgent.role})`,
          agentName: currentAgent.name,
          agentAvatar: currentAgent.avatar,
          agentColor: currentAgent.color,
          content: result.text,
          timestamp: new Date().toLocaleTimeString(),
          citations: result.citations || []
        };
        newArtifacts.push(artifactItem);
        setArtifactsList(prev => [artifactItem, ...prev]);

        setAgentOutputs(prev => ({ ...prev, [currentAgent.id]: result.text }));
        accumulatedContext += `\n\n--- DELIVERABLE FROM (${currentAgent.name} / ${currentAgent.role}) ---\n${result.text}`;
      } else {
        setAgents(prev => prev.map(a => a.id === currentAgent.id ? { ...a, status: 'error' } : a));
        addLog(currentAgent.id, currentAgent.name, 'error', `Agent error: ${result.error}`);
      }

      setMetrics({
        totalTokens: totalTokensAccum,
        elapsedTimeMs: totalTimeAccum,
        costEstimateUSD: (totalTokensAccum * 0.00000035).toFixed(6),
        agentLatencies: latencies
      });
    }

    setFinalReport(accumulatedContext);
    
    const masterArtifact = {
      id: 'master-' + Date.now(),
      title: `Final Unified Swarm Synthesis Report`,
      agentName: 'System Orchestrator',
      agentAvatar: '🏆',
      agentColor: '#6366f1',
      content: accumulatedContext,
      timestamp: new Date().toLocaleTimeString(),
      citations: []
    };
    setArtifactsList(prev => [masterArtifact, ...prev]);

    addLog('system', 'Orchestrator', 'info', 'Swarm execution completed successfully.');
    setIsRunning(false);
  };

  const handleAddNewAgent = () => {
    const newId = 'ag-' + Date.now();
    const newAgent = {
      id: newId,
      name: 'New Domain Specialist',
      role: 'Specialist Analyst',
      avatar: '🤖',
      color: '#38bdf8',
      model: 'gemini-3-flash-preview',
      temperature: 0.5,
      tools: ['json_parser'],
      prompt: 'Analyze input objectives and provide operational outputs.',
      status: 'idle'
    };
    setAgents([...agents, newAgent]);

    if (agents.length > 0) {
      const lastAgent = agents[agents.length - 1];
      setEdges([...edges, {
        id: 'e-' + Date.now(),
        source: lastAgent.id,
        target: newId,
        label: 'Flow Connection'
      }]);
    }
    setSelectedAgentId(newId);
  };

  const handleDeleteAgent = (id) => {
    if (agents.length <= 1) return;
    setAgents(agents.filter(a => a.id !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
    if (selectedAgentId === id) {
      setSelectedAgentId(agents.find(a => a.id !== id)?.id || null);
    }
  };

  const handleUpdateAgent = (updatedAgent) => {
    setAgents(agents.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Function to export full chat history to full.txt
  const exportChatToTxt = () => {
    if (chatMessages.length === 0) return;
    
    let content = `================================================================================\n`;
    content += `           AETHER SWARM AI WORKSPACE - FULL CHAT TRANSCRIPT\n`;
    content += `================================================================================\n`;
    content += `วันที่ดาวน์โหลด: ${new Date().toLocaleString()}\n`;
    content += `ทีมทำงาน (Preset): ${selectedPreset?.title || 'Custom Swarm'}\n`;
    content += `หัวข้อภารกิจ (Goal): ${promptInput || 'N/A'}\n`;
    content += `จำนวนข้อความทั้งหมด: ${chatMessages.length} ข้อความ\n`;
    content += `================================================================================\n\n`;

    chatMessages.forEach((msg, idx) => {
      const isUser = msg.senderType === 'user';
      const isSystem = msg.senderType === 'system';
      
      let roleTag = isUser ? '【ผู้ถาม / USER】' : isSystem ? '【ระบบ / SYSTEM】' : '【ผู้ตอบ / AGENT】';
      let nameInfo = msg.sender + (msg.role ? ` (${msg.role})` : '');

      content += `--------------------------------------------------------------------------------\n`;
      content += `ลำดับที่ #${idx + 1} | เวลา: ${msg.timestamp}\n`;
      content += `บทบาท: ${roleTag}\n`;
      content += `ผู้ส่ง: ${nameInfo}\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `${msg.message}\n\n`;
    });

    content += `================================================================================\n`;
    content += `                          จบประวัติการสนทนา (END OF FILE)\n`;
    content += `================================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'full.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedAgent = useMemo(() => {
    return agents.find(a => a.id === selectedAgentId) || agents[0];
  }, [agents, selectedAgentId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AetherSwarm AI Workspace
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Gemini 3.1 Orchestrator
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Agent Swarms, Web Grounding, TTS & Visual Assets</p>
          </div>
        </div>

        {/* Engine Switch & Controls */}
        <div className="flex items-center gap-3">
          {/* GEMINI FEATURE: Auto Architect Swarm Trigger */}
          <button
            onClick={() => setShowAutoBuildModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-90 text-white shadow-md transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-200" />
            <span>✨ Auto-Architect Swarm</span>
          </button>

          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setEngineMode('live_gemini')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                engineMode === 'live_gemini'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Gemini 3
            </button>
            <button
              onClick={() => setEngineMode('simulator')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                engineMode === 'simulator'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Fast Simulator
            </button>
          </div>

          {/* Workflow Preset Picker */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 cursor-pointer">
              <Workflow className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">{selectedPreset.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="absolute right-0 top-full mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Preset Swarm Workflows
              </div>
              {WORKFLOW_PRESETS.map((preset) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      selectedPreset.id === preset.id
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">{preset.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Run Action Button */}
          <button
            onClick={isRunning ? resetExecutionState : runWorkflow}
            disabled={!promptInput.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs shadow-lg transition-all ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white shadow-indigo-500/25 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Reset Pipeline
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Launch Agent Swarm
              </>
            )}
          </button>
        </div>
      </header>

      {/* Global Task Goal Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 shrink-0">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Swarm Goal Prompt:</span>
        </div>
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Describe the overall objective for your agent team..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
        />
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Team: <strong className="text-white">{agents.length} Agents</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'canvas', label: 'Topology Canvas (โครงสร้างทีม)', icon: Workflow },
          { id: 'roster', label: 'Agent Fleet (สมาชิกทีม)', icon: Bot },
          { id: 'chat', label: 'Team Chat & Room (ห้องแชท)', icon: MessageSquare, highlight: true },
          { id: 'execution', label: 'Live Trace & Stream', icon: Terminal, badge: executionLogs.length > 0 ? executionLogs.length : null },
          { id: 'deliverables', label: 'Deliverables / Works (ผลงาน)', icon: FolderOutput, badge: artifactsList.length > 0 ? artifactsList.length : null },
          { id: 'imageGen', label: 'Visual Designer (สร้างภาพ)', icon: ImageIcon, geminiBadge: '3.1 Flash' },
          { id: 'tools', label: 'Tool Registry', icon: Wrench },
          { id: 'telemetry', label: 'Telemetry & Cost', icon: BarChart3 }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all relative shrink-0 ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : tab.highlight
                  ? 'border-transparent text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.geminiBadge && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-mono">
                  {tab.geminiBadge}
                </span>
              )}
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* TAB 1: TOPOLOGY CANVAS */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950 p-8 flex flex-col items-center justify-center overflow-auto relative">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
                <button
                  onClick={handleAddNewAgent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Agent Node
                </button>
                <div className="h-4 w-[1px] bg-slate-800" />
                <button
                  onClick={() => setShowInspector(!showInspector)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    showInspector ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 inline mr-1" />
                  Inspector Panel
                </button>
              </div>

              <div className="w-full max-w-4xl flex flex-col items-center gap-12 py-10 relative">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
                  {agents.map((agent, index) => {
                    const isSelected = selectedAgentId === agent.id;
                    const isCurrentStep = currentStepIndex === index;
                    
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`group relative rounded-2xl border p-4 bg-slate-900/90 backdrop-blur-md cursor-pointer transition-all duration-300 shadow-xl ${
                          isSelected
                            ? 'ring-2 ring-indigo-500 border-indigo-500 bg-slate-900 shadow-indigo-500/10'
                            : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        } ${isCurrentStep ? 'animate-pulse ring-2 ring-amber-400 border-amber-400' : ''}`}
                      >
                        <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400">
                          STEP 0{index + 1}
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          {agent.status === 'thinking' && (
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                          )}
                          {agent.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                          {agent.status === 'error' && (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          {agent.status === 'idle' && (
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2 mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/10"
                            style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                          >
                            {agent.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                              {agent.name}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {agent.role}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 font-mono">
                          "{agent.prompt}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold mr-1">Tools:</span>
                          {agent.tools.length > 0 ? (
                            agent.tools.map(toolId => (
                              <span
                                key={toolId}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {toolId.replace('_', ' ')}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-600 italic">None</span>
                          )}
                        </div>

                        {index < agents.length - 1 && (
                          <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-400 shadow-md">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inspector Panel */}
            {showInspector && selectedAgent && (
              <div className="w-80 border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl p-5 flex flex-col gap-5 overflow-y-auto z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <h2 className="font-bold text-sm text-slate-200">Agent Inspector</h2>
                  </div>
                  <button
                    onClick={() => handleDeleteAgent(selectedAgent.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={selectedAgent.name}
                      onChange={(e) => handleUpdateAgent({ ...selectedAgent, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Functional Role
                    </label>
                    <input
                      type="text"
                      value={selectedAgent.role}
                      onChange={(e) => handleUpdateAgent({ ...selectedAgent, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-3">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    LLM Backbone
                  </label>
                  <select
                    value={selectedAgent.model}
                    onChange={(e) => handleUpdateAgent({ ...selectedAgent, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Task Prompt
                  </label>
                  <textarea
                    rows={4}
                    value={selectedAgent.prompt}
                    onChange={(e) => handleUpdateAgent({ ...selectedAgent, prompt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AGENT FLEET & ROSTER */}
        {activeTab === 'roster' && (
          <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Swarm Agent Roster (สมาชิกทีม)</h2>
                  <p className="text-xs text-slate-400">Manage individual agent instructions, models, and tools.</p>
                </div>
                <button
                  onClick={handleAddNewAgent}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Provision New Agent
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          {agent.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-100">{agent.name}</h3>
                          <span className="text-xs text-indigo-400 font-medium">{agent.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                      "{agent.prompt}"
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Backbone: <strong className="text-indigo-300">{agent.model}</strong></span>
                      <button
                        onClick={() => {
                          setChatTargetAgent(agent.id);
                          setActiveTab('chat');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-xs font-semibold border border-indigo-500/30"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        แชทส่วนตัวกับคนนี้
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM CHAT ROOM */}
        {activeTab === 'chat' && (
          <div className="flex-1 bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>ผู้รับข้อความ (Recipients)</span>
              </div>

              <button
                onClick={() => setChatTargetAgent('all')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                  chatTargetAgent === 'all'
                    ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-400/20 flex items-center justify-center text-base">
                  🌐
                </div>
                <div>
                  <div className="text-xs font-bold">แชทกับทั้งทีม (All Agents)</div>
                  <div className="text-[10px] opacity-80">{agents.length} Agents active</div>
                </div>
              </button>

              <div className="h-[1px] bg-slate-800 my-1" />

              <div className="space-y-1.5 overflow-y-auto flex-1">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setChatTargetAgent(agent.id)}
                    className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-all text-xs ${
                      chatTargetAgent === agent.id
                        ? 'bg-slate-800 border border-indigo-500 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                      style={{ backgroundColor: `${agent.color}30` }}
                    >
                      {agent.avatar}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold truncate">{agent.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{agent.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">
                      {chatTargetAgent === 'all'
                        ? '💬 ห้องแชทรวมทีม (All Agents Swarm Room)'
                        : `💬 แชทกับ: ${agents.find(a => a.id === chatTargetAgent)?.name || 'Agent'}`}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {chatTargetAgent === 'all'
                        ? 'ส่งข้อความเพื่อพูดคุย ถกปัญหา หรือปรึกษากับเอเจนต์ทุกคนพร้อมกัน'
                        : `สนทนาโดยตรงเฉพาะกับ ${agents.find(a => a.id === chatTargetAgent)?.role}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportChatToTxt}
                    disabled={chatMessages.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
                    title="ดาวน์โหลดประวัติการแชททั้งหมดเป็นไฟล์ full.txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด full.txt</span>
                  </button>

                  <button
                    onClick={() => setChatMessages([])}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              {/* Chat Message Stream with TTS Voice Support */}
              <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 max-w-3xl ${
                      msg.senderType === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border border-white/10 shadow-md"
                      style={{ backgroundColor: msg.agentColor ? `${msg.agentColor}30` : '#334155' }}
                    >
                      {msg.avatar || '🤖'}
                    </div>
                    <div className={`space-y-1 ${msg.senderType === 'user' ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          msg.senderType === 'user' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          msg.senderType === 'system' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {msg.senderType === 'user' ? 'ผู้ถาม (User)' : msg.senderType === 'system' ? 'ระบบ (System)' : 'ผู้ตอบ (Agent)'}
                        </span>
                        <span className="font-bold text-slate-200">{msg.sender}</span>
                        {msg.role && <span className="text-[10px] text-indigo-400 font-medium">({msg.role})</span>}
                        <span className="text-[10px] opacity-60">{msg.timestamp}</span>

                        {/* GEMINI TTS SPEAKER BUTTON */}
                        {msg.senderType === 'agent' && (
                          <button
                            onClick={() => speakTextWithGemini(msg.message, msg.id)}
                            className="ml-2 text-slate-400 hover:text-indigo-300 transition-colors"
                            title="🔊 อ่านออกเสียงด้วย Gemini TTS"
                          >
                            {audioLoadingId === msg.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : playingAudioId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed font-sans whitespace-pre-wrap shadow-lg ${
                          msg.senderType === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                            : msg.senderType === 'system'
                            ? 'bg-slate-900 border border-indigo-500/30 text-indigo-200'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}
                {isChatSending && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse bg-slate-900/60 p-3 rounded-xl border border-slate-800 w-fit">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span>กำลังประมวลผลคำตอบจากเอเจนต์...</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-3">
                <input
                  type="text"
                  value={chatInputValue}
                  onChange={(e) => setChatInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder={
                    chatTargetAgent === 'all'
                      ? 'พิมพ์ข้อความคุยกับเอเจนต์ทั้งทีม...'
                      : `พิมพ์ข้อความสั่งงานหรือคุยกับ ${agents.find(a => a.id === chatTargetAgent)?.name}...`
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInputValue.trim() || isChatSending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                >
                  <span>ส่งแชท</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE TRACE & STREAM */}
        {activeTab === 'execution' && (
          <div className="flex-1 bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-200">Execution Telemetry Stream</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Logs: <strong className="text-slate-200">{executionLogs.length}</strong>
                  </span>
                  <button
                    onClick={() => setExecutionLogs([])}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div ref={logContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
                {executionLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Terminal className="w-8 h-8 opacity-40" />
                    <p>No execution logs yet. Click "Launch Agent Swarm" to start pipeline.</p>
                  </div>
                ) : (
                  executionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">[{log.agentName}]</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold ${
                            log.type === 'thinking' ? 'bg-amber-500/20 text-amber-300' :
                            log.type === 'output' ? 'bg-emerald-500/20 text-emerald-300' :
                            log.type === 'tool' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-200">{log.message}</p>
                      {log.details && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-slate-300 whitespace-pre-wrap">
                          {log.details}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col bg-slate-900/40">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-200">Unified Swarm Output Artifact</h3>
                </div>
                {finalReport && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakTextWithGemini(finalReport, 'final-audio')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-xs border border-indigo-500/30"
                    >
                      {audioLoadingId === 'final-audio' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : playingAudioId === 'final-audio' ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>Audio Brief</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(finalReport, 'final')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700"
                    >
                      {copiedId === 'final' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Brief</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                {finalReport ? (
                  <div className="prose prose-invert prose-xs max-w-none bg-slate-950 p-5 rounded-2xl border border-slate-800 font-sans text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {finalReport}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Sparkles className="w-8 h-8 opacity-40 text-indigo-400" />
                    <p className="text-xs">Final report will synthesize automatically upon execution completion.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DELIVERABLES & WORKS HUB */}
        {activeTab === 'deliverables' && (
          <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">คลังผลงาน & Deliverables Artifacts</h2>
                  <p className="text-xs text-slate-400">ศูนย์รวมผลงาน รายงาน โค้ด ภาพกราฟิก และข้อสรุปที่เอเจนต์สร้างขึ้นทั้งหมด</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px] px-2">จำนวนผลงาน: <strong>{artifactsList.length}</strong></span>
                </div>
              </div>

              {artifactsList.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <FolderOutput className="w-12 h-12 text-indigo-400/40 mx-auto" />
                  <h3 className="font-bold text-base text-slate-200">ยังไม่มีผลงานในขณะนี้</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    กดปุ่ม <strong>"Launch Agent Swarm"</strong> ด้านบนเพื่อรันเอเจนต์ หรือใช้ <strong>Visual Designer</strong> เพื่อสร้างภาพ ผลงานจะถูกรวบรวมไว้ที่นี่โดยอัตโนมัติ
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {artifactsList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/10"
                            style={{ backgroundColor: `${item.agentColor}20` }}
                          >
                            {item.agentAvatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                            <span className="text-xs text-slate-400">ผู้สร้าง: {item.agentName} • {item.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakTextWithGemini(item.content, item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-xs border border-indigo-500/30 transition-all"
                            title="ฟังเสียงบรรยายด้วย Gemini TTS"
                          >
                            {audioLoadingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : playingAudioId === item.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span>ฟังเสียงบรรยาย</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(item.content, item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>คัดลอกผลงาน</span>
                          </button>
                        </div>
                      </div>

                      {item.imageUrl ? (
                        <div className="space-y-3">
                          <img
                            src={item.imageUrl}
                            alt="Visual Asset"
                            className="w-full max-h-96 object-cover rounded-xl border border-slate-800 shadow-2xl"
                          />
                          <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                            {item.content}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                          {item.content}
                        </div>
                      )}

                      {item.citations && item.citations.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          <span>อ้างอิงข้อมูลเว็บ Google Grounding:</span>
                          <div className="flex flex-wrap gap-2">
                            {item.citations.map((c, idx) => (
                              <a
                                key={idx}
                                href={c.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                              >
                                {c.title} <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: GEMINI VISUAL DESIGNER */}
        {activeTab === 'imageGen' && (
          <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-100">Visual Designer Agent</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      Gemini 3.1 Flash Image
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">สร้างภาพคอนเซ็ปต์ งานอาร์ตเวิร์ค หรือแผนภูมิประกอบแคมเปญด้วย Gemini Image Generation API</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                    Prompt คำสั่งสร้างภาพ
                  </label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="พิมพ์คำอธิบายภาพที่ต้องการให้ Gemini สร้าง..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Aspect Ratio:</span>
                    {['16:9', '1:1', '4:3', '9:16'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          imageAspectRatio === ratio
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={generateVisualWithGemini}
                    disabled={!imagePrompt.trim() || isGeneratingImage}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังประมวลผลวาดภาพ...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>สร้างภาพ visual ด้วย Gemini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Image Result Display */}
              {generatedImageResult && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-2xl">
                  <h3 className="text-sm font-bold text-slate-200">ผลงานภาพ visual ล่าสุด:</h3>
                  <img
                    src={generatedImageResult}
                    alt="Gemini Output"
                    className="w-full max-h-[500px] object-cover rounded-xl border border-slate-800 shadow-xl"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <span>บันทึกเข้าใน <strong>Deliverables / Works</strong> เรียบร้อยแล้ว</span>
                    <a
                      href={generatedImageResult}
                      download="gemini-visual.png"
                      className="flex items-center gap-1.5 text-indigo-400 hover:underline font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลดรูปภาพ</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: TOOL REGISTRY */}
        {activeTab === 'tools' && (
          <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Swarm Capability Tools</h2>
                <p className="text-xs text-slate-400">Tools available for agent binding during orchestration steps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AVAILABLE_TOOLS.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-700 transition-all shadow-xl"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <ToolIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-100">{tool.name}</h3>
                          <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{tool.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TELEMETRY & COST ANALYTICS */}
        {activeTab === 'telemetry' && (
          <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Swarm Telemetry & Cost Analytics</h2>
                <p className="text-xs text-slate-400">Performance metrics, latency graphs, and token consumption breakdowns.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Tokens Consumed</span>
                  <div className="text-2xl font-bold text-slate-100 font-mono">{metrics.totalTokens.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Pipeline Latency</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{(metrics.elapsedTimeMs / 1000).toFixed(2)}s</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Estimated Cost</span>
                  <div className="text-2xl font-bold text-purple-400 font-mono">${metrics.costEstimateUSD}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GEMINI AUTO-ARCHITECT MODAL */}
      {showAutoBuildModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">✨ Auto-Architect Swarm</h3>
                  <p className="text-[11px] text-slate-400">สร้างทีม AI Agent อัตโนมัติด้วย Gemini 3 Flash Schema</p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoBuildModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                อธิบายเป้าหมายหรือโจทย์ของทีม AI Agents ที่ต้องการสร้าง:
              </label>
              <textarea
                rows={4}
                value={autoBuildGoal}
                onChange={(e) => setAutoBuildGoal(e.target.value)}
                placeholder="เช่น: สร้างทีมวิเคราะห์การลงทุนคริปโต 3 คน (นักวิเคราะห์ข่าว, นักวิเคราะห์เทคนิค, และผู้ประเมินความเสี่ยง)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAutoBuildModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={generateSwarmFromGoal}
                disabled={!autoBuildGoal.trim() || isAutoBuildingSwarm}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isAutoBuildingSwarm ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังวางโครงสร้างทีม...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างทีม Swarm ทันที</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}