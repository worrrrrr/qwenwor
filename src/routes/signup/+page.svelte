<script lang="ts">
  import logo from '$lib/assets/logo.svg?url';
  import Icons from '$lib/components/Icons.svelte';

  let { form } = $props();
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>สมัครสมาชิก - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="w-full max-w-md">
  <div class="bg-white rounded-xl shadow-md p-8">
    <div class="flex flex-col items-center mb-6">
      <img src={logo} alt="โลโก้" class="h-16 w-16 rounded-xl mb-3" draggable="false" />
      <h1 class="text-2xl font-bold text-gray-900">สมัครสมาชิก</h1>
      <p class="text-sm text-gray-500 mt-1">สร้างบัญชีใหม่สำหรับ Agentic Knowledge Workspace</p>
    </div>

    {#if form?.message}
      <div class="mb-4 p-3 rounded-md bg-green-50 text-green-700 text-sm">{form.message}</div>
    {/if}
    {#if form?.error}
      <div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{form.error}</div>
    {/if}

    <form method="POST" action="?/signup" class="space-y-4">
      <label class="block">
        <span class="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</span>
        <input
          type="text"
          name="fullName"
          value={form?.fullName ?? ''}
          class="input input-green mt-1"
          placeholder="เช่น ก็อต"
        />
      </label>
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
        <span class="text-sm font-medium text-gray-700">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</span>
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
      <button class="w-full btn btn-green">สมัครสมาชิก</button>
    </form>

    <div class="my-4 flex items-center gap-3">
      <div class="flex-1 border-t border-gray-200"></div>
      <span class="text-xs text-gray-400">หรือ</span>
      <div class="flex-1 border-t border-gray-200"></div>
    </div>

    <!-- สมัครสมาชิกด้วย Google -->
    <a
      href="/auth/google"
      class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      สมัครสมาชิกด้วย Google
    </a>

    <p class="mt-6 text-center text-sm text-gray-600">
      มีบัญชีอยู่แล้ว?{' '}
      <a href="/login" class="text-indigo-600 hover:text-indigo-800 font-medium">เข้าสู่ระบบ</a>
    </p>
  </div>
</div>
