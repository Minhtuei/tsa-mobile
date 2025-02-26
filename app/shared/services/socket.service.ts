import { io, Socket } from 'socket.io-client';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Public method to provide access to the singleton instance
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Method to initialize the socket connection
  public initializeSocket(url: string, token: string): void {
    if (!this.socket) {
      this.socket = io(url, {
        autoConnect: false,
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error.message);
        if (error.status === 401) {
          alert('Session expired or unauthorized. Please log in again.');
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });
    }
  }

  // Method to retrieve the socket instance
  public getSocket(): Socket | null {
    return this.socket;
  }

  // Method to close the socket connection
  public closeSocket(): void {
    if (this.socket) {
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('error');
      this.socket.close();
      this.socket = null;
    }
  }
}
