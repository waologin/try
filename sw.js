


/* --------------------------------------------------
   sw.js - Service Worker (同じオリジンの /sw.js に配置)
   役割:
     - push イベントを受けて通知を表示
     - notificationclick を処理
   注意: 実際の通知表示はブラウザの通知権限が必須
   -------------------------------------------------- */

// sw.js の中身（ファイルとして保存）

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'New message', body: 'You have a new push' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    // 非JSONでも安全に扱う
    try { data.body = event.data.text(); } catch (e2) {}
  }

  const title = data.title || '通知';
  const options = {
    body: data.message || data.body || '(no-body)',
    tag: data.senderId ? 'msg-' + data.senderId : undefined,
    data: data,
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
