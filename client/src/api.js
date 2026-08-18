const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

async function getJSON(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export async function signup(user) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(user)
  })
  return getJSON(response)
}

export async function signin(user) {
  const response = await fetch('/auth/signin', {
    method: 'POST',
    headers: jsonHeaders,
    credentials: 'include',
    body: JSON.stringify(user)
  })
  return getJSON(response)
}

export async function signout() {
  const response = await fetch('/auth/signout', { method: 'GET' })
  return getJSON(response)
}

export async function listResource(resource) {
  const response = await fetch(`/api/${resource}`, { method: 'GET' })
  return getJSON(response)
}

export async function createResource(resource, item, token) {
  const headers = { ...jsonHeaders }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`/api/${resource}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(item)
  })
  return getJSON(response)
}

export async function updateResource(resource, id, item, token) {
  const response = await fetch(`/api/${resource}/${id}`, {
    method: 'PUT',
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(item)
  })
  return getJSON(response)
}

export async function deleteResource(resource, id, token) {
  const response = await fetch(`/api/${resource}/${id}`, {
    method: 'DELETE',
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${token}`
    }
  })
  return getJSON(response)
}
