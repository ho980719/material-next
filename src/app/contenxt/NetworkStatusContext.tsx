'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 컨텍스트 생성: isOnline 상태를 담을 공간
const NetworkStatusContext = createContext<boolean>(true);

// 커스텀 훅: 다른 컴포넌트에서 쉽게 isOnline 상태를 사용하기 위함
export const useNetworkStatus = () => {
    return useContext(NetworkStatusContext);
};

// 프로바이더 컴포넌트: 상태를 실제로 관리하고 하위 컴포넌트에 제공
export const NetworkStatusProvider = ({ children }: { children: ReactNode }) => {
    // isOnline 상태 관리, 기본값은 true
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        // 컴포넌트가 처음 마운트될 때 현재 네트워크 상태를 확인
        if (typeof window !== 'undefined') {
            setIsOnline(navigator.onLine);
        }

        // 'online' 이벤트 리스너: 브라우저가 온라인 상태가 되면 isOnline을 true로 설정
        const handleOnline = () => setIsOnline(true);
        // 'offline' 이벤트 리스너: 브라우저가 오프라인 상태가 되면 isOnline을 false로 설정
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <NetworkStatusContext.Provider value={isOnline}>
            {children}
        </NetworkStatusContext.Provider>
    );
};