<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import LeftSidebar from '$lib/components/LeftSidebar.svelte';
  import RightSidebar from '$lib/components/RightSidebar.svelte';
  import { page } from '$app/state';
  import type { User } from '@supabase/supabase-js';
  import type { Snippet } from 'svelte';

  interface Props {
    data: {
      user: User | null;
      counts: {
        agents: number;
        knowledge: number;
        workflows: number;
        tasks: number;
      };
      recentChats: {
        id: string;
        title: string;
        isGroup: boolean;
        agentId: string | null;
        agentName: string | null;
        updatedAt: string;
      }[];
    };
    children: Snippet;
  }

  let { data, children }: Props = $props();

  // สถานะเปิด/ปิด sidebar (ซ้าย/ขวา)
  let leftOpen = $state(true);
  let rightOpen = $state(true);

  // หน้า auth (login/signup/reset-password) แสดงแบบลีนๆ ไม่มี Navbar/Sidebar
  const isAuthPage = $derived(
    page.url.pathname.startsWith('/login') ||
      page.url.pathname.startsWith('/signup') ||
      page.url.pathname.startsWith('/auth')
  );
</script>

{#if isAuthPage}
  <div class="h-screen w-full bg-slate-100 flex items-center justify-center p-4">
    {@render children()}
  </div>
{:else}
  <!-- ล็อกความสูงหน้าจอ 100vh และห้ามสโครลที่ระดับ Body/Outer Div -->
  <div class="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">
    <!-- Navbar ด้านบน คงที่ -->
    <Navbar user={data.user} />
    <div class="flex-1 min-h-0 my-5">
      <!-- พืนที่ทำงานหลัก (เต็มความสูงที่เหลือจาก Navbar) -->
      <div class="flex h-full min-h-0 overflow-hidden space-x-5">
        <LeftSidebar open={leftOpen} onToggle={() => (leftOpen = !leftOpen)} chats={data.recentChats} />

        <!-- เนื้อหาหลัก (Chat/Dashboard): สโครลเฉพาะตรงนี้ -->
        <main class="flex-1 min-w-0 bg-white overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {@render children()}
        </main>

        <RightSidebar open={rightOpen} onToggle={() => (rightOpen = !rightOpen)} />
      </div>
    </div>
  </div>
{/if}
