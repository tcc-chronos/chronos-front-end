import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipProps } from './Tooltip.types';

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  delay = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const style: React.CSSProperties = { position: 'absolute', zIndex: 9999 };
      switch (position) {
        case 'top':
          style.left = rect.left + rect.width / 2;
          style.top = rect.top - 8;
          style.transform = 'translate(-50%, -100%)';
          break;
        case 'bottom':
          style.left = rect.left + rect.width / 2;
          style.top = rect.bottom + 8;
          style.transform = 'translate(-50%, 0)';
          break;
        case 'left':
          style.left = rect.left - 8;
          style.top = rect.top + rect.height / 2;
          style.transform = 'translate(-100%, -50%)';
          break;
        case 'right':
          style.left = rect.right + 8;
          style.top = rect.top + rect.height / 2;
          style.transform = 'translate(0, -50%)';
          break;
        default:
          break;
      }
      setTooltipStyle(style);
    }
  }, [isVisible, position]);

  return (
    <div
      ref={triggerRef}
      className='inline-block'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            style={tooltipStyle}
            className={`w-70 ${className}`}
            role='tooltip'
          >
            <div className='bg-functional-heavy-dark text-functional-soft-lightest text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal'>
              {content}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
