self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'RambaMedTech';
  const body = data.body || 'You have a new reminder.';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.reminderId || 'ramba-notification',
      renotify: true,
      data: { url: '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});
