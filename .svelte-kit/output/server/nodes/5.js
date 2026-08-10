

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tasks/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.C2OVlsCB.js","_app/immutable/chunks/BzFIM_EC.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/B8YleU0c.js"];
export const stylesheets = [];
export const fonts = [];
