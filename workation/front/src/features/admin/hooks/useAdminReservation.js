import { useDispatch, useSelector } from 'react-redux';
import {
  addPartner,
  updatePartner,
  togglePartnerStatus,
} from '../store/adminReservationSlice';

export default function useAdminReservation() {
  const dispatch = useDispatch();
  const { partners, loading, error } = useSelector((state) => state.admin.reservation);

  return {
    partners,
    loading,
    error,
    addPartner: (partner) => dispatch(addPartner(partner)),
    updatePartner: (id, changes) => dispatch(updatePartner({ id, changes })),
    togglePartnerStatus: (id) => dispatch(togglePartnerStatus(id)),
  };
}
