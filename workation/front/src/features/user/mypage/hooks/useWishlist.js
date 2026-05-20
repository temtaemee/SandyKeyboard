import { useEffect, useState } from "react";
import {
    getMyWishlist,
    insertWishlist,
    deleteWishlist,
} from "../api/mypageApi";

export default function useWishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 찜 목록 조회
    async function asyncGetMyWishlist() {
        try {
            setIsLoading(true);

            const data = await getMyWishlist();
            setWishlist(data);
        } catch (err) {
            console.error("찜 목록 조회 실패", err);
        } finally {
            setIsLoading(false);
        }
    }

    // 찜 추가
    async function asyncInsertWishlist(spaceId) {
        try {
            await insertWishlist(spaceId);

            // 추가 후 목록 새로고침
            await asyncGetMyWishlist();
        } catch (err) {
            console.error("찜 추가 실패", err);
        }
    }

    // 찜 삭제
    async function asyncDeleteWishlist(wishlistId) {
        try {
            await deleteWishlist(wishlistId);

            // 삭제 후 화면 즉시 반영
            setWishlist((prev) =>
                prev.filter((item) => item.wishlistId !== wishlistId)
            );
        } catch (err) {
            console.error("찜 삭제 실패", err);
        }
    }

    useEffect(() => {
        asyncGetMyWishlist();
    }, []);

    return {
        wishlist,
        isLoading,

        asyncGetMyWishlist,
        asyncInsertWishlist,
        asyncDeleteWishlist,
    };
}