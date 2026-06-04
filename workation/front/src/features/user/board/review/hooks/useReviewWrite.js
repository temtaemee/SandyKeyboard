import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createReview, updateReview, getReviewDetail, getUnreviewedReservations } from '../api/reviewApi';

export function useReviewWrite() {
  const navigate = useNavigate();
  const { reviewId: paramReviewId } = useParams();
  const [searchParams] = useSearchParams();

  // /review/edit/:reviewId 또는 ?id= 쿼리 파라미터 모두 지원
  const editId = paramReviewId ?? searchParams.get('id');
  const isEdit = !!editId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]); // 삭제된 기존 이미지 ID 목록
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  // 다녀온 예약 목록 (미작성 리뷰용)
  const [unreviewedReservations, setUnreviewedReservations] = useState([]);
  const [reservationId, setReservationId] = useState('');

  // 수정 모드일 때 보여줄 다녀온 곳 정보
  const [stayName, setStayName] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');

  // 수정 모드: 기존 리뷰 데이터 로드
  useEffect(() => {
    if (!isEdit) return;
    getReviewDetail(editId)
      .then((data) => {
        setTitle(data.title ?? '');
        setContent(data.content ?? '');
        setTag(data.tag ?? '');
        setRating(data.rating ?? 5);
        setExistingImages(data.images ?? []);
        setStayName(data.stayName ?? '');
        setCheckinDate(data.checkinDate ?? '');
        setCheckoutDate(data.checkoutDate ?? '');
      })
      .catch((err) => {
        console.error('수정할 후기를 불러오지 못했습니다.', err);
        alert('후기 정보를 불러오지 못했습니다.');
        navigate('/board/review/list');
      })
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  // 신규 작성 모드: 다녀온 예약 목록 로드
  useEffect(() => {
    if (isEdit) return;
    getUnreviewedReservations()
      .then((data) => setUnreviewedReservations(data))
      .catch((err) => console.error('예약 목록을 불러오지 못했습니다.', err));
  }, [isEdit]);

  function handleFileChange(e) {
    [...e.target.files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) => [...prev, { file, previewUrl: ev.target.result }]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function handleRemoveNewImage(i) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleRemoveExistingImage(i) {
    const removed = existingImages[i];
    // 삭제된 이미지 ID 목록에 추가
    if (removed?.id) {
      setDeletedImageIds((prev) => [...prev, removed.id]);
    }
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');
    if (rating === 0) return alert('별점을 선택해주세요.');
    if (!isEdit && !reservationId) return alert('다녀온 예약을 선택해주세요.');

    try {
      setSubmitting(true);
      const dto = { title, content, tag, rating, reservationId: isEdit ? undefined : Number(reservationId) };
      const imageFiles = images.map((img) => img.file);

      if (isEdit) {
        // 삭제된 이미지 ID 목록도 함께 전송
        await updateReview(editId, dto, imageFiles, deletedImageIds);
      } else {
        await createReview(dto, imageFiles);
      }

      navigate('/board/review');
    } catch (err) {
      console.error(err);
      alert(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  const totalImageCount = existingImages.length + images.length;

  return {
    isEdit,
    title,
    setTitle,
    content,
    setContent,
    tag,
    setTag,
    rating,
    setRating,
    images,
    existingImages,
    totalImageCount,
    submitting,
    loadingEdit,
    handleFileChange,
    handleRemoveNewImage,
    handleRemoveExistingImage,
    handleSubmit,
    unreviewedReservations,
    reservationId,
    setReservationId,
    stayName,
    checkinDate,
    checkoutDate,
  };
}
