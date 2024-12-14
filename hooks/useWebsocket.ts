import { useEffect, useRef } from 'react';

let websocket: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

const useWebsocket = (url: string, handleMessage: (msg: string) => void) => {
    const messageQueue = useRef<string[]>([]);
    const isConnected = useRef(false);
    const isReconnecting = useRef(false);

    const connect = () => {
        websocket = new WebSocket(url);

        websocket.onopen = () => {
            isConnected.current = true;
            isReconnecting.current = false;
            while (messageQueue.current.length > 0) {
                websocket?.send(messageQueue.current.shift()!);
            }
        };

        websocket.onmessage = (event) => {
            handleMessage(event.data);
        };

        websocket.onclose = () => {
            isConnected.current = false;
            
            websocket = null;
            attemptReconnect();
        };
        
        websocket.onerror = (error) => {
            isConnected.current = false;
            websocket?.close();
        };
    };

    const attemptReconnect = () => {
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            isConnected.current = false;
        }

        reconnectTimeout = setTimeout(async () => {
            handleMessage('Attempting to calling server');
            isReconnecting.current = true;
            await connect();
        }, 4000);

        setTimeout(() => {
            isReconnecting.current = false;
        },1000)
    };

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            websocket?.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        try {
            if (isConnected.current) {
                websocket?.send(message);
            } else {
                messageQueue.current.push(message);
            }
        } catch (error) {
            handleMessage("Message failed to send due to an connection error");
        }
    };

    return { sendMessage, isConnected, isReconnecting };
};

export default useWebsocket;