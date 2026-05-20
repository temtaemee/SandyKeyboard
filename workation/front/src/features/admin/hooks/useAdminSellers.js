import { useEffect, useState } from 'react';
import { getAdminSellers, updateSellerStatus, getAdminUsers, updateUserStatus } from '../api/adminSellersApi';
import { SELLERS_LIST, CUSTOMER_LIST } from '../data/adminSellersData';
import { SELLER_STATUS_MAP } from '../data/adminSellersConstants';

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
        setCustomers(CUSTOMER_LIST);
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
