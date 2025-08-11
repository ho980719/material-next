'use client';

import React from 'react';
import {useNetworkStatus} from "@/app/contenxt/NetworkStatusContext";

const OfflineIndicator = () => {
    // 위에서 만든 커스텀 훅을 사용해 현재 네트워크 상태를 가져옴
    const isOnline = useNetworkStatus();

    // 만약 온라인 상태이면, 아무것도 렌더링하지 않음
    if (isOnline) {
        return null;
    }

    // 오프라인 상태일 때만 아래의 UI를 렌더링
    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            backgroundColor: '#333',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            zIndex: 1000, // 다른 요소들 위에 보이도록 z-index 설정
        }}>
            오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.
        </div>
    );
};

export default OfflineIndicator;