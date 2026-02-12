import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAutoLogout = (logout) => {
    const location = useLocation();

    useEffect(() => {
        let timer;
        const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

        const activityEvents = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart'
        ];

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                console.log('Auto-logging out due to inactivity');
                logout();
            }, TIMEOUT_MS);
        };

        // Initialize timer
        resetTimer();

        // Add event listeners
        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            if (timer) clearTimeout(timer);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [logout, location]); // Re-run if location changes to ensure timer is active
};

export default useAutoLogout;
