import { updateTimer } from 'app/shared/state/timer.slice';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';

export const useTimer = () => {
  const dispatch = useAppDispatch();
  const { isActive, remainingTime } = useAppSelector((state) => state.timer);
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) {
      interval = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    } else if (!isActive && remainingTime <= 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingTime, dispatch]);
  return { isActive, remainingTime };
};
