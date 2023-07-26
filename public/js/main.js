const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const usersList = document.getElementById("users");
const leaveroom = document.getElementById("leave-btn");
const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit("joinRoom", { username, room });
socket.on("message", (msg) => {
  outPutMsg(msg);
});
socket.on("usersInRoom", (res) => {
  usersList.innerHTML = `
  ${res.map((user) => `<li>${user.username}</li>`)}
  `;
});
// submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  outPutMsg(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// format output message
function outPutMsg(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
   ${msg.txt}
  </p>
  `;
  chatMessages.appendChild(div);
}

leaveroom.addEventListener("click", () => {
  socket.emit("leaveRoom", username);
});
