import { nextTick} from "vue";
import type { Ref } from "vue"

type NotificationCallback = () => void;

const sendNotification = (message: string, status: string, notificationMessage: Ref<string>, callback?: NotificationCallback ) => {
  if (message) {
    notificationMessage.value = message as string;
    nextTick(() => {
      const notification = document.querySelector('.notification') as HTMLElement;
      if (notification) {
        notification.classList.add('show');
        if (status && status.trim() === 'error') {
          notification.style.backgroundColor = '#fa582a';
          notification.style.color = 'black';
        }
      }
    });
    setTimeout(() => {
      const notification = document.querySelector('.notification');
      if (notification) {
        notification.classList.remove('show');
      }
      setTimeout(() => {
        notificationMessage.value = ''
        if (callback) {
          callback();
        }
      }, 300);
    }, 3000)
  }
}

export { sendNotification }
