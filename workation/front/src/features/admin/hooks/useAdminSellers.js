import { useEffect, useState } from 'react';
import { getAdminSellers, updateSellerStatus, getAdminUsers, updateUserStatus } from '../api/adminSellersApi';
import { SELLERS_LIST, SELLER_STATUS_MAP } from '../data/adminSellersData';

const CUSTOMER_MOCK = [
  { id: 'USR-001', name: '강다은', email: 'daeun.kang@example.com', phone: '010-1111-2222', joinDate: '2023-02-10', resvCount: 14, status: 'active' },
  { id: 'USR-002', name: '윤지오', email: 'jio.yoon@example.com', phone: '010-2222-3333', joinDate: '2023-04-25', resvCount: 6, status: 'active' },
  { id: 'USR-003', name: '서하준', email: 'hajun.seo@example.com', phone: '010-3333-4444', joinDate: '2023-06-14', resvCount: 2, status: 'stopped' },
  { id: 'USR-004', name: '김도연', email: 'doyeon.kim@example.com', phone: '010-4444-5555', joinDate: '2023-08-30', resvCount: 9, status: 'active' },
  { id: 'USR-005', name: '이나영', email: 'nayoung.lee@example.com', phone: '010-5555-6666', joinDate: '2023-11-05', resvCount: 3, status: 'active' },
  { id: 'USR-006', name: '박성민', email: 'sungmin.park@example.com', phone: '010-6666-7777', joinDate: '2026-03-10', resvCount: 1, status: 'active' },
  { id: 'USR-007', name: '조현우', email: 'hyunwoo.jo@example.com', phone: '010-7777-8888', joinDate: '2026-04-07', resvCount: 0, status: 'stopped' },
  { id: 'USR-008', name: '신예진', email: 'yejin.shin@example.com', phone: '010-8888-9999', joinDate: '2026-05-01', resvCount: 5, status: 'active' },
];

export default function useAdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellerRes, userRes] = await Promise.all([
          getAdminSellers(),
          getAdminUsers(),
        ]);
        setSellers(sellerRes.data);
        setCustomers(userRes.data);
      } catch (err) {
        console.error(err);
        setSellers(SELLERS_LIST);
        setCustomers(CUSTOMER_MOCK);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSellerStatus = async (sellerId, suspended) => {
    try {
      await updateSellerStatus(sellerId, suspended);
      setSellers((prev) =>
        prev.map((s) =>
          s.id === sellerId ? { ...s, status: suspended ? 'stopped' : 'active' } : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserStatus = async (userId, suspended) => {
    try {
      await updateUserStatus(userId, suspended);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, status: suspended ? 'stopped' : 'active' } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return { sellers, customers, loading, error, toggleSellerStatus, toggleUserStatus };
}
