// // self.addEventListener("install", function (event) {
// //   console.log("Hello world from the Service Worker 🤙");
// // });

// const installEvent = () => {
//   self.addEventListener("install", () => {
//     console.log("service worker installed");
//   });
// };
// installEvent();

// const activateEvent = () => {
//   self.addEventListener("activate", () => {
//     console.log("service worker activated");
//   });
// };
// activateEvent();

// // self.addEventListener('push', event => {
// //   if (event.data) {
// //     const data = event.data.json();
// //     console.log('Push Received:', data);

// //     const options = {
// //       body: data.body,
// //       icon: data.icon || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLD7y_9ATQ370Da9O6VmmrZ45EE8qxrGwohQ&s',
// //       badge: data.badge || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLD7y_9ATQ370Da9O6VmmrZ45EE8qxrGwohQ&s',
// //       image: data.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLD7y_9ATQ370Da9O6VmmrZ45EE8qxrGwohQ&s',
// //       tag: `notification-${Date.now()}`,
// //       requireInteraction: true,
// //       data: {
// //         url: data.url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLD7y_9ATQ370Da9O6VmmrZ45EE8qxrGwohQ&s'
// //       },
// //       actions: [
// //         {
// //           action: 'view',
// //           title: 'View',
// //           icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLD7y_9ATQ370Da9O6VmmrZ45EE8qxrGwohQ&s'
// //         },
// //         {
// //           action: 'dismiss',
// //           title: 'Dismiss',
// //           icon: 'https://example.com/dismiss-icon.png'
// //         }
// //       ]
// //     };

// //     event.waitUntil(
// //       self.registration.showNotification(data.title, options)
// //     );
// //   } else {
// //     console.error('Push event but no data');
// //   }
// // });

// self.addEventListener('push', event => {
//   if (event.data) {
//     const data = event.data.json();
//     console.log('Push Received:', data);

//     self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
//       clients.forEach(client => {
//         client.postMessage(data);
//       });
//     });
//   } else {
//     console.error('Push event but no data');
//   }
// });
// ;


