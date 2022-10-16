import { standaloneServerPort } from '../../server/config'

type fetchJSONArgs = {
  method: RequestInit['method']
  data?: Record<string, unknown>
  url: string
}
type templateData = {
  filename: string
  content: string
}

const fetchJSON = async ({ method, url, data }: fetchJSONArgs): Promise<templateData[]> => {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  })
  return await res.json()
}
export { fetchJSON }

function debounce(callback, timeout = 1000) {
  let timeoutFn
  return (...args) => {
    const context = this
    clearTimeout(timeoutFn)
    timeoutFn = setTimeout(() => callback.apply(context, args), timeout)
  }
}

const uploadFile = async (file, standaloneServer) => {
  const formData = new FormData()
  formData.append('file-0', file)
  const baseUrl = standaloneServer ? `http://localhost:${standaloneServerPort}` : ''
  const res = await fetch(`${baseUrl}/api/builder/handle`, { method: 'POST', body: formData })
  return await res.json()
}
export { uploadFile }

const loadTemplate = async (standaloneServer) => {
  const baseUrl = standaloneServer ? `http://localhost:${standaloneServerPort}` : ''
  const data = await fetchJSON({ method: 'get', url: `${baseUrl}/api/builder/handle` })
  const component = data.find((c) => c.filename === '/default.json') // TODO: fix for windows
  return component?.content
}
export { loadTemplate }

const saveTemplate = async (state, standaloneServer) => {
  const baseUrl = standaloneServer ? `http://localhost:${standaloneServerPort}` : ''
  const path =
    window.location.pathname === '/' || window.location.pathname === ''
      ? 'default.json'
      : `${window.location.pathname}.json`

  const body = { path, data: JSON.parse(state.serialize()) }

  await fetchJSON({
    method: 'post',
    url: `${baseUrl}/api/builder/handle`,
    data: body,
  })
}

// NOTE: prevent saving on first load
// would be better to somehow check from editor state
let stateChanged = false

const saveTemplateDebounce = debounce((e) => {
  if (stateChanged) {
    saveTemplate(e, false)
  }
  stateChanged = true
})
export { saveTemplateDebounce }
