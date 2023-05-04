export function fetchJson(url, method, body) {
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  console.log(url);

  if (method !== "GET") fetchOptions.body = JSON.stringify(body);

  return fetch(url, fetchOptions);
}
