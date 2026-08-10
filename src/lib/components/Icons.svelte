<script module lang="ts">
  export type IconName =
    | 'dashboard' | 'agents' | 'knowledge' | 'workflows' | 'tasks'
    | 'menu' | 'close' | 'search' | 'plus' | 'trash' | 'play' | 'stop'
    | 'check' | 'x-circle' | 'clock' | 'calendar' | 'memory' | 'robot'
    | 'document' | 'bolt' | 'chart' | 'sparkles' | 'globe' | 'refresh'
    | 'warning' | 'info' | 'heart' | 'pencil' | 'eye' | 'user'
    | 'chevron-left' | 'chevron-right' | 'chevron-down' | 'chevron-up'
    | 'arrow-left' | 'arrow-right' | 'external' | 'panel-left' | 'panel-right'
    | 'chat' | 'mail' | 'trophy' | 'target';
</script>

<script lang="ts">
  import dashboard from '$lib/assets/icons/dashboard.svg?url';
  import agents from '$lib/assets/icons/agents.svg?url';
  import knowledge from '$lib/assets/icons/knowledge.svg?url';
  import workflows from '$lib/assets/icons/workflows.svg?url';
  import tasks from '$lib/assets/icons/tasks.svg?url';
  import menu from '$lib/assets/icons/menu.svg?url';
  import close from '$lib/assets/icons/close.svg?url';
  import search from '$lib/assets/icons/search.svg?url';
  import plus from '$lib/assets/icons/plus.svg?url';
  import trash from '$lib/assets/icons/trash.svg?url';
  import play from '$lib/assets/icons/play.svg?url';
  import stop from '$lib/assets/icons/stop.svg?url';
  import check from '$lib/assets/icons/check.svg?url';
  import xCircle from '$lib/assets/icons/x-circle.svg?url';
  import clock from '$lib/assets/icons/clock.svg?url';
  import calendar from '$lib/assets/icons/calendar.svg?url';
  import memory from '$lib/assets/icons/memory.svg?url';
  import robot from '$lib/assets/icons/robot.svg?url';
  import document from '$lib/assets/icons/document.svg?url';
  import bolt from '$lib/assets/icons/bolt.svg?url';
  import chart from '$lib/assets/icons/chart.svg?url';
  import sparkles from '$lib/assets/icons/sparkles.svg?url';
  import globe from '$lib/assets/icons/globe.svg?url';
  import refresh from '$lib/assets/icons/refresh.svg?url';
  import warning from '$lib/assets/icons/warning.svg?url';
  import info from '$lib/assets/icons/info.svg?url';
  import heart from '$lib/assets/icons/heart.svg?url';
  import pencil from '$lib/assets/icons/pencil.svg?url';
  import eye from '$lib/assets/icons/eye.svg?url';
  import user from '$lib/assets/icons/user.svg?url';
  import chevronLeft from '$lib/assets/icons/chevron-left.svg?url';
  import chevronRight from '$lib/assets/icons/chevron-right.svg?url';
  import chevronDown from '$lib/assets/icons/chevron-down.svg?url';
  import chevronUp from '$lib/assets/icons/chevron-up.svg?url';
  import arrowLeft from '$lib/assets/icons/arrow-left.svg?url';
  import arrowRight from '$lib/assets/icons/arrow-right.svg?url';
  import external from '$lib/assets/icons/external.svg?url';
  import panelLeft from '$lib/assets/icons/panel-left.svg?url';
  import panelRight from '$lib/assets/icons/panel-right.svg?url';
  import chat from '$lib/assets/icons/chat.svg?url';
  import mail from '$lib/assets/icons/mail.svg?url';
  import trophy from '$lib/assets/icons/trophy.svg?url';
  import target from '$lib/assets/icons/target.svg?url';

  interface Props {
    name: IconName;
    size?: number | string;
    class?: string;
    title?: string;
  }

  let { name, size = '1.25rem', class: className = '', title = '' }: Props = $props();

  // ไฟล์ไอคอน SVG — ดู/แก้ได้ที่ src/lib/assets/icons/*.svg
  // แต่ละไฟล์มี gradient (ไล่สี) + animation (เคลื่อนไหว) ในตัว
  const icons: Record<IconName, string> = {
    dashboard, agents, knowledge, workflows, tasks,
    menu, close, search, plus, trash, play, stop, check,
    'x-circle': xCircle, clock, calendar, memory, robot, document,
    bolt, chart, sparkles, globe, refresh, warning, info, heart,
    pencil, eye, user,
    'chevron-left': chevronLeft, 'chevron-right': chevronRight,
    'chevron-down': chevronDown, 'chevron-up': chevronUp,
    'arrow-left': arrowLeft, 'arrow-right': arrowRight, external,
    'panel-left': panelLeft, 'panel-right': panelRight,
    chat, mail, trophy, target
  };

  const px = $derived(typeof size === 'number' ? `${size}px` : size);
</script>

<img
  src={icons[name]}
  style="width: {px}; height: {px};"
  alt={title}
  class={className}
  draggable="false"
/>
