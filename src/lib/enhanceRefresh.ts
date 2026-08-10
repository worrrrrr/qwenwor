// enhance wrapper: หลัง action สำเร็จ ให้ reload ข้อมูลหน้าใหม่ (รายการอัปเดตทันที ไม่ต้อง F5)
import { invalidateAll } from '$app/navigation';
import type { SubmitFunction } from '@sveltejs/kit';

export const enhanceRefresh: SubmitFunction = () => {
	return async ({ update, result }) => {
		await update();
		if (result.type === 'success') invalidateAll();
	};
};
