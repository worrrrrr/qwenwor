<script lang="ts">
  import logo from '$lib/assets/logo.svg?url';
  import Icons from '$lib/components/Icons.svelte';

  let { form } = $props();
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>เข้าสู่ระบบ - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="w-full max-w-md">
  <div class="bg-white rounded-xl shadow-md p-8">
    <div class="flex flex-col items-center mb-6">
      <img src={logo} alt="โลโก้" class="h-16 w-16 rounded-xl mb-3" draggable="false" />
      <h1 class="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
      <p class="text-sm text-gray-500 mt-1">Agentic Knowledge Workspace</p>
    </div>

    {#if form?.message}
      <div class="mb-4 p-3 rounded-md bg-green-50 text-green-700 text-sm">{form.message}</div>
    {/if}
    {#if form?.error}
      <div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{form.error}</div>
    {/if}

    <form method="POST" action="?/login" class="space-y-4">
      <label class="block">
        <span class="text-sm font-medium text-gray-700">อีเมล</span>
        <input
          type="email"
          name="email"
          value={form?.email ?? ''}
          required
          class="input input-green mt-1"
          placeholder="you@example.com"
        />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-gray-700">รหัสผ่าน</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          required
          class="input input-green mt-1"
          placeholder="••••••••"
        />
        <button
          type="button"
          class="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-gray-700"
          onclick={() => (showPassword = !showPassword)}
        >
          <Icons name="eye" size={14} /> {showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
        </button>
      </label>
      <button class="w-full btn btn-green">เข้าสู่ระบบ</button>
    </form>

    <div class="my-4 flex items-center gap-3">
      <div class="flex-1 border-t border-gray-200"></div>
      <span class="text-xs text-gray-400">หรือ</span>
      <div class="flex-1 border-t border-gray-200"></div>
    </div>

    <form method="POST" action="?/magiclink">
      <input type="hidden" name="email" value={form?.email ?? ''} />
      <button class="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1.5">
        <Icons name="mail" size={14} /> ส่งลิงก์เข้าสู่ระบบทางอีเมล
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      ยังไม่มีบัญชี?{' '}
      <a href="/signup" class="text-indigo-600 hover:text-indigo-800 font-medium">สมัครสมาชิก</a>
    </p>
  </div>
</div>
