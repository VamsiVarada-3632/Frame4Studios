import { useState, useCallback } from 'react';

export function useVideoModal() {
  const [modalWork, setModalWork] = useState(null);

  const openModal = useCallback((work) => setModalWork(work), []);
  const closeModal = useCallback(() => setModalWork(null), []);

  return { modalWork, openModal, closeModal, isOpen: !!modalWork };
}
