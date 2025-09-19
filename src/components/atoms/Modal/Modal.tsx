import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { ModalProps } from './Modal.types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  preventCloseOnOverlay = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !preventCloseOnOverlay) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70'
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`
          relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl
          transform transition-all duration-200 ease-out
          animate-in fade-in-0 zoom-in-95
        `}
      >
        {/* Header */}
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h2
              id='modal-title'
              className='text-lg font-semibold text-gray-900'
            >
              {title}
            </h2>
            <IconButton
              icon={<X size={20} />}
              onClick={onClose}
              size='sm'
              ariaLabel='Fechar modal'
            />
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <div className='absolute top-4 right-4 z-10'>
            <IconButton
              icon={<X size={20} />}
              onClick={onClose}
              size='sm'
              ariaLabel='Fechar modal'
            />
          </div>
        )}

        {/* Content */}
        <div className={title ? 'p-6' : 'p-6 pt-12'}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
