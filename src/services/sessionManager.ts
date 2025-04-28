import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";

const EXPIRE_HOURS = 5;
const EXPIRE_MS = EXPIRE_HOURS * 60 * 60 * 1000;


export const checkSession = () => {
    const { user, userTimestamp } = useUserStore.getState();
    if (!user || !userTimestamp) return false;
    
    const now = Date.now();
    const isExpired = now - userTimestamp > EXPIRE_MS; 
    if (isExpired) {
        useUserStore.getState().clearUser();
        toast.error("Hết phiên đăng nhập, vui lòng đăng nhập lại!");  
    }
}


export const checkSessionInterval = () => {
    setInterval(() => {
        checkSession();
    }, 1000 * 60 * 15); // kiểm tra mỗi 15 phút
}


