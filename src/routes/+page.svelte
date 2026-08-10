<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import AgentCard from '$lib/components/AgentCard.svelte';
  import KnowledgeCard from '$lib/components/KnowledgeCard.svelte';
  import WorkflowCard from '$lib/components/WorkflowCard.svelte';
  import TaskCard from '$lib/components/TaskCard.svelte';

  let { data } = $props();

  const agents = $derived(data.agents);
  const knowledge = $derived(data.knowledge);
  const workflows = $derived(data.workflows);
  const tasks = $derived(data.tasks);
  const activeWorkflows = $derived(workflows.filter((w) => w.status === 'running'));
</script>

<svelte:head>
  <title>Dashboard - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
    <Icons name="robot" size={36} class="shrink-0" />
    Agentic Knowledge Workspace
  </h1>
  <p class="text-gray-600">
    Multi-Agent System สำหรับการจัดการความรู้และการทำงานอัตโนมัติ
  </p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <!-- Agents Card -->
  <a href="/agents" class="card p-6 cursor-pointer">
    <div class="flex items-center mb-4">
      <Icons name="agents" size={30} class="mr-3 text-blue-600 shrink-0" />
      <h2 class="text-xl font-semibold">Agents</h2>
    </div>
    <p class="text-3xl font-bold text-blue-600 mb-2">{agents.length}</p>
    <ul class="space-y-2">
      {#each agents.slice(0, 3) as agent}
        <li class="flex items-center text-sm">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          {agent.name} ({agent.identity.role})
        </li>
      {/each}
      {#if agents.length > 3}
        <li class="text-sm text-blue-600">+{agents.length - 3} more</li>
      {/if}
    </ul>
  </a>

  <!-- Knowledge Base Card -->
  <a href="/knowledge" class="card p-6 cursor-pointer">
    <div class="flex items-center mb-4">
      <Icons name="knowledge" size={30} class="mr-3 text-green-600 shrink-0" />
      <h2 class="text-xl font-semibold">Knowledge Base</h2>
    </div>
    <p class="text-3xl font-bold text-green-600 mb-2">{knowledge.length}</p>
    <p class="text-sm text-gray-500">เอกสารและความรู้ในระบบ</p>
  </a>

  <!-- Workflows Card -->
  <a href="/workflows" class="card p-6 cursor-pointer">
    <div class="flex items-center mb-4">
      <Icons name="workflows" size={30} class="mr-3 text-purple-600 shrink-0" />
      <h2 class="text-xl font-semibold">Workflows</h2>
    </div>
    <p class="text-3xl font-bold text-purple-600 mb-2">{workflows.length}</p>
    <p class="text-sm text-gray-500">
      {activeWorkflows.length} กำลังทำงาน
    </p>
  </a>

  <!-- Scheduler Card -->
  <a href="/tasks" class="card p-6 cursor-pointer">
    <div class="flex items-center mb-4">
      <Icons name="tasks" size={30} class="mr-3 text-orange-600 shrink-0" />
      <h2 class="text-xl font-semibold">Scheduled Tasks</h2>
    </div>
    <p class="text-3xl font-bold text-orange-600 mb-2">{tasks.length}</p>
    <p class="text-sm text-gray-500">งานอัตโนมัติ</p>
  </a>

  <!-- แชทกับ Agent Card -->
  <a href="/chat" class="card p-6 cursor-pointer">
    <div class="flex items-center mb-4">
      <Icons name="chat" size={30} class="mr-3 text-indigo-600 shrink-0" />
      <h2 class="text-xl font-semibold">แชทกับ Agent</h2>
    </div>
    <p class="text-3xl font-bold text-indigo-600 mb-2">{agents.length}</p>
    <p class="text-sm text-gray-500">คุยแยก หรือรวมห้องได้</p>
  </a>

  <!-- Memory Card -->
  <div class="card p-6">
    <div class="flex items-center mb-4">
      <Icons name="memory" size={30} class="mr-3 text-indigo-500 shrink-0" />
      <h2 class="text-xl font-semibold">Memory System</h2>
    </div>
    <p class="text-lg font-medium text-indigo-600">เปิดใช้งาน</p>
    <p class="text-sm text-gray-500 mt-2">
      Short-term, Long-term, Episodic, Semantic
    </p>
  </div>
</div>

<!-- Featured Items Section -->
{#if agents.length > 0 || workflows.length > 0 || tasks.length > 0}
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if agents.length > 0}
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <Icons name="agents" size={22} class="shrink-0" /> Recent Agents
          </h2>
          <a href="/agents" class="text-sm text-blue-600 hover:underline">View All</a>
        </div>
        <div class="space-y-3">
          {#each agents.slice(0, 3) as agent}
            <AgentCard {agent} />
          {/each}
        </div>
      </div>
    {/if}

    {#if workflows.length > 0}
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <Icons name="workflows" size={22} class="shrink-0" /> Active Workflows
          </h2>
          <a href="/workflows" class="text-sm text-blue-600 hover:underline">View All</a>
        </div>
        <div class="space-y-3">
          {#each activeWorkflows.slice(0, 2) as workflow}
            <WorkflowCard workflow={workflow} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

<div class="mt-8 card p-6">
  <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
    <Icons name="target" size={24} class="shrink-0" /> องค์ประกอบหลักของระบบ
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">Knowledge Base (RAG)</h3>
        <p class="text-sm text-gray-600">ระบบจัดเก็บและค้นหาความรู้</p>
      </div>
    </div>
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">Memory + Identity</h3>
        <p class="text-sm text-gray-600">จัดการตัวตนและความจำของ Agent</p>
      </div>
    </div>
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">Multi-Agent System</h3>
        <p class="text-sm text-gray-600">ก็อต, น้องบี, Brian</p>
      </div>
    </div>
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">Workflow Engine</h3>
        <p class="text-sm text-gray-600">จัดการลำดับขั้นตอนการทำงาน</p>
      </div>
    </div>
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">Automation Scheduler</h3>
        <p class="text-sm text-gray-600">รันงานตามเวลาที่กำหนด</p>
      </div>
    </div>
    <div class="flex items-start">
      <Icons name="check" size={16} class="text-green-500 mr-1 shrink-0" />
      <div>
        <h3 class="font-medium">แชทกับ Agent</h3>
        <p class="text-sm text-gray-600">คุยเดี่ยวหรือห้องรวม พร้อมบันทึกผลงาน</p>
      </div>
    </div>
  </div>
</div>
