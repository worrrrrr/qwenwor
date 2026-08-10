// ตัวส่งสัญญาณ "มีกิจกรรมแชทเกิดขึ้น" — ใช้ให้ sidebar ประวัติแชทรีเฟรชทันทีหลังส่งข้อความ
export const chatActivity = $state({ version: 0 });

export function bumpChatActivity(): void {
	chatActivity.version += 1;
}
