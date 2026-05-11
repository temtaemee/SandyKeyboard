import { useNavigate } from "react-router-dom";
import { join } from "../api/memberApi"

export default function useJoin() {
    const navi = useNavigate();

    async function fetchJoin(vo) {
        const data = await join(vo);
        if (data.status == 201) {
            alert("회원가입 완료!");
            navi(`/`);
        }
    }

    return { fetchJoin, navi }
}