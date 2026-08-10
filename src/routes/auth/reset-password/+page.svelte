<script lang="ts">
  import logo from '$lib/assets/logo.svg?url';
  import Icons from '$lib/components/Icons.svelte';

  let { form } = $props();
  let showPassword = $state(false);
  let showConfirm = $state(false);
</script>

<svelte:head>
  <title>ตั้งรหัสผ่านใหม่ - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="w-full max-w-md">
  <div class="bg-white rounded-xl shadow-md p-8">
    <div class="flex flex-col items-center mb-6">
      <img src={logo} alt="โลโก้" class="h-16 w-16 rounded-xl mb-3" draggable="false" />
      <h1 class="text-2xl font-bold text-gray-900">ตั้งรหัสผ่านใหม่</h1>
      <p class="text-sm text-gray-500 mt-1">กรอกรหัสผ่านใหม่ของคุณ</p>
    </div>

    {#if form?.error}
      <div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{form.error}</div>
    {/if}

    <form method="POST" action="?/update" class="space-y-4">
      <label class="block">
        <span class="text-sm font-medium text-gray-700">รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          required
          minlength="6"
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
      <label class="block">
        <span class="text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</span>
        <input
          type={showConfirm ? 'text' : 'password'}
          name="confirmPassword"
          required
          minlength="6"
          class="input input-green mt-1"
          placeholder="••••••••"
        />
        <button
          type="button"
          class="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-gray-700"
          onclick={() => (showConfirm = !showConfirm)}
        >
          <Icons name="eye" size={14} /> {showConfirm ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
        </button>
      </label>
      <button class="w-full btn btn-green">บันทึกรหัสผ่านใหม่</button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      จำรหัสผ่านได้แล้ว?&nbsp;
      <a href="/login" class="text-indigo-600 hover:text-indigo-800 font-medium">เข้าสู่ระบบ</a>
    </p>
  </div>
</div>
