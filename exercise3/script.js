const msgInputBtn = document.querySelector(".j-btn-msg");
const geoBtn = document.querySelector(".j-btn-geo")
const wsUri = "wss://echo.websocket.events/";
const initialServerResponse = "echo.websocket.events sponsored by Lob.com";
let websocket;

const sendWebsocketMessage = (newMessage) => {
   if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      websocket = new WebSocket(wsUri);

      websocket.onopen = function (evt) {
         console.log("CONNECTED");
         websocket.send(newMessage);
      };
      websocket.onclose = function (evt) {
         console.log("DISCONNECTED");
         websocket = null;
      };
      websocket.onmessage = function (evt) {
         console.log(evt.data)
         if (evt.data !== initialServerResponse && !evt.data.includes('(Geo-location)')) {
            addPostToChatDiv(evt.data, true);
         }
      };
      websocket.onerror = function (evt) {
         console.log(evt.data);
      };
   } else {
      websocket.send(newMessage);
   }
};

const createPostDiv = (newMessage, isServerMsg, locationUrl) => {
   const newDiv = document.createElement("div");
   newDiv.className = !isServerMsg ? "post" : "post post_server";
   let elementHtml;
   if (locationUrl === "") {
      elementHtml = `<span class="post-text">${newMessage}</span>`;
   } else {
      elementHtml = `<a class="post-link" href="${locationUrl}" target="_blank">${newMessage}</a>`;
   }
   newDiv.innerHTML = elementHtml;
   return newDiv;
};

const addPostToChatDiv = (newMessage, isServerMessage = false, locationUrl = "") => {
   const chatDiv = document.querySelector(".chat");
   const childDiv = createPostDiv(newMessage, isServerMessage, locationUrl);
   chatDiv.appendChild(childDiv);
}

msgInputBtn.addEventListener("click", () => {
   const msgInput = document.querySelector(".message-input");
   const message = msgInput.value;

   if (message === "") {
      alert("Please fill in message field");
      return;
   }
   addPostToChatDiv(message);
   // Clear the input element
   msgInput.value = "";
   // Send message to server
   sendWebsocketMessage(message);
});

// function executed on error
const error = () => {
   console.log('Can not get your location');
}

// function executed when coordinates were received
const success = (position) => {
   const latitude = position.coords.latitude;
   const longitude = position.coords.longitude;
   const coordsString = `Latitude: ${latitude}°, Longitude: ${longitude}° (Geo-location)`;
   const linkText = 'Гео-локация';
   const mapLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

   addPostToChatDiv(linkText, false, mapLink);
   sendWebsocketMessage(coordsString);
}

geoBtn.addEventListener('click', () => {
   if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser.');
   } else {
      navigator.geolocation.getCurrentPosition(success, error);
   }
});

// Close websocket connection when page is closed
window.addEventListener('beforeunload', () => {
   if (websocket) {
      websocket.close();
   }
});