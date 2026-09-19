export interface AppNotification {
  id: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  type: 'MESSAGE' | 'APPOINTMENT' | 'PAYMENT' | 'PRESCRIPTION' | 'SYSTEM';
  senderName?: string;
  avatarUrl?: string;
  createdAt: number;
}

export interface AppMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

const initialNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'New Clinical Message Received',
    text: 'Dr. Milind Verma: Please check your cardiology prescription dosage update.',
    time: '2 min ago',
    unread: true,
    type: 'MESSAGE',
    senderName: 'Dr. Milind Verma, MD',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=60&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 120000
  },
  {
    id: 'n-2',
    title: 'Appointment Request Approved',
    text: 'Dr. Milind Verma approved your appointment slot for Cardiology consultation.',
    time: '15 min ago',
    unread: true,
    type: 'APPOINTMENT',
    senderName: 'Dr. Milind Verma, MD',
    createdAt: Date.now() - 900000
  },
  {
    id: 'n-3',
    title: 'Razorpay Payment Confirmed',
    text: 'Payment of $150 confirmed. Unique Txn ID: RZP-TXN-84920193 generated.',
    time: '1 hour ago',
    unread: false,
    type: 'PAYMENT',
    createdAt: Date.now() - 3600000
  }
];

const initialMessages: AppMessage[] = [
  {
    id: 'm-1',
    sender: 'Dr. Milind Verma, MD',
    text: 'Please remember to take your Lisinopril 10mg morning dose with water.',
    time: '2 min ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=60&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-2',
    sender: 'Nikhil Agarwal',
    text: 'Thank you doctor, I have uploaded my blood test lab results.',
    time: '10 min ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'
  }
];

type NotificationListener = (notifications: AppNotification[], messages: AppMessage[]) => void;

class NotificationService {
  private notifications: AppNotification[] = initialNotifications;
  private messages: AppMessage[] = initialMessages;
  private listeners: Set<NotificationListener> = new Set();
  private toastCallback: ((notif: AppNotification) => void) | null = null;

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getMessages(): AppMessage[] {
    return [...this.messages];
  }

  public subscribe(listener: NotificationListener) {
    this.listeners.add(listener);
    listener(this.notifications, this.messages);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setToastCallback(cb: (notif: AppNotification) => void) {
    this.toastCallback = cb;
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn([...this.notifications], [...this.messages]));
  }

  // Trigger when a new message arrives -> Adds to both Messages and Notifications!
  public pushMessage(sender: string, text: string, avatar?: string) {
    const newMsg: AppMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      time: 'Just now',
      unread: true,
      avatar: avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=60&auto=format&fit=crop&q=80'
    };

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `New Message from ${sender}`,
      text: `${sender}: ${text}`,
      time: 'Just now',
      unread: true,
      type: 'MESSAGE',
      senderName: sender,
      avatarUrl: avatar,
      createdAt: Date.now()
    };

    this.messages = [newMsg, ...this.messages];
    this.notifications = [newNotif, ...this.notifications];
    this.notifyListeners();

    if (this.toastCallback) {
      this.toastCallback(newNotif);
    }
  }

  // Trigger general system notification
  public pushNotification(title: string, text: string, type: AppNotification['type'] = 'SYSTEM', senderName?: string) {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      text,
      time: 'Just now',
      unread: true,
      type,
      senderName,
      createdAt: Date.now()
    };

    this.notifications = [newNotif, ...this.notifications];
    this.notifyListeners();

    if (this.toastCallback) {
      this.toastCallback(newNotif);
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, unread: false }));
    this.notifyListeners();
  }

  public markAllMessagesAsRead() {
    this.messages = this.messages.map(m => ({ ...m, unread: false }));
    this.notifyListeners();
  }
}

export const notificationService = new NotificationService();
