export function fetchWithAuth(endpoint) {
  return window
    .fetch(endpoint, {
      credentials: "same-origin",
      headers: { Authorization: "Bearer " + localStorage.getItem("id_token") }
    })
    .then(response => response.json())
    .catch(error => console.log(error));
}
