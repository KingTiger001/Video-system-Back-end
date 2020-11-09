import { useCallback, useEffect, useState } from 'react'

export const useVideoResize = ({ autoHeight, autoWidth, ref }) => {
  const getDimensions = () => ({
    width: autoWidth ? Math.round((ref.current.offsetHeight / 9) * 16) : ref.current.offsetWidth,
    height: autoHeight ? Math.round((ref.current.offsetWidth / 16) * 9) : ref.current.offsetHeight
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => setDimensions(getDimensions())

    if (ref.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  return dimensions;
};

export const useDebounce = (effect, delay , deps) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}