// self.addEventListener("install", function (event) {
//   console.log("Hello world from the Service Worker 🤙");
// });

const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
  });
};
activateEvent();

self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("Push Received...");
  console.log(data);

  const options = {
    body: data.body,
    icon:
      data.icon ||
      "https://images.unsplash.com/photo-1514464750060-00e6e34c8b8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bm90aWZpY2F0aW9uc3xlbnwwfHwwfHx8MA%3D%3D", // Ensure icon is properly defined
    tag: "simple-push-notification-example",
  };

  self.registration.showNotification(data.title, options);
});
