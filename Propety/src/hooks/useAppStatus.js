import { useState, useEffect } from 'react';
import { BASE_URL } from '../api';

export const useAppStatus = () => {
    const [isDone, setIsDone] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(`${BASE_URL}/status`);
                const data = await response.json();
                setIsDone(data.status === 'done');
            } catch (error) {
                console.error('Error fetching app status:', error);
                setIsDone(false);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    return { isDone, loading };
};
