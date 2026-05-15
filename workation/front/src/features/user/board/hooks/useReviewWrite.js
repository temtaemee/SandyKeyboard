import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createReview, updateReview, getReviewDetail } from '../api/Reviewapi';

export function useReviewWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getReviewDetail(editId)
      .then((data) => {
        setTitle(data.title ?? '');
        setContent(data.content ?? '');
        setTag(data.tag ?? '');
        setRating(data.rating ?? 5);
        setExistingImages(data.images ?? []);
      })
      .catch((err) => {
        console.error('수정할 후기를 불러오지 못했습니다.', err);
        alert('후기 정보를 불러오지 못했습니다.');
        navigate('/board/review/list');
      })
      .finally(() => setLoadingEdit(false));
  }, [editId]);

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
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');
    if (rating === 0) return alert('별점을 선택해주세요.');

    try {
      setSubmitting(true);
      const dto = { title, content, tag, rating };
      const imageFiles = images.map((img) => img.file);

      if (isEdit) {
        await updateReview(editId, dto, imageFiles);
      } else {
        await createReview(dto, imageFiles);
      }

      navigate('/board/review/list');
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
    title, setTitle,
    content, setContent,
    tag, setTag,
    rating, setRating,
    images,
    existingImages,
    totalImageCount,
    submitting,
    loadingEdit,
    handleFileChange,
    handleRemoveNewImage,
    handleRemoveExistingImage,
    handleSubmit,
  };
}
