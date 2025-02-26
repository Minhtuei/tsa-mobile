import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from 'app/shared/hooks/redux';

interface ContextValue {
  socket: Socket | null;
  sendMessage: (message: string) => void;
}

export const SocketContext = createContext<ContextValue>({
  socket: null,
  sendMessage: () => {}
});
console.log('SocketUrl:', process.env.EXPO_SOCKET_SERVER_URL);
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const auth = useAppSelector((state) => state.auth);
  useEffect(() => {
    const newSocket = io(process.env.EXPO_SOCKET_SERVER_URL, {
      // const newSocket = io('https://api.transportsupport.systems', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [auth.accessToken]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
      if (error.status === 401) {
        alert('Session expired or unauthorized. Please log in again.');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('connect_error');
      socket.close();
    };
  }, [socket]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket) {
        socket.emit('message', message);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

export default SocketProvider;
