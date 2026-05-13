import api from "../../../app/api/axios";

export async function login(vo) {

    const resp = await api.post(`/guest/login`, vo);
    return resp.data;
}

export async function join(vo) {
    const resp = await api.post(`/guest/join`, vo);
    return resp;
}
