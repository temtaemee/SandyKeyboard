import { useNavigate } from "react-router-dom";
import { login } from "../api/memberApi";

function useLogin() {
    const navi = useNavigate();

    async function fetchLogin(vo) {

        try {

            const data = await login(vo);

            if (data.result === "success") {

                localStorage.setItem("accessToken", data.token);

                console.log("로그인 성공");

                navi(`/`);

            }

        } catch (err) {

            console.error("로그인 실패", err);
        }
    }

    return { fetchLogin, navi };
}

export default useLogin;