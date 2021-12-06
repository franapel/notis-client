import { useEffect, useState } from 'react'

function App() {

  const [user, setUser] = useState()

  let register

  const registerServiceWorker = async() => {
    register = await navigator.serviceWorker.register('./worker.js', {
      scope: '/'
    })
  }

  useEffect(() => {
    registerServiceWorker()
  })

  const subscribeToNotifications = async (userId) => {
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    })
    const url = process.env.REACT_APP_SERVER_URL + '/subscription'
    const body = { subscription,  userId }
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.text())
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const id = document.querySelector('#id').value

    const url = process.env.REACT_APP_SERVER_URL + '/user/' + id
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())

    if (res.success) {
      const user = res.user
      setUser(user)
      subscribeToNotifications(user.id)
    } else {
      console.log(res.msg)
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' id='id' name='id' placeholder='ID de usuario' />
        <input type='submit' value='Ingresar' />
      </form>
      <span style={{position: 'absolute', top: 0, right: 10}}>{user && user.username}</span>
    </div>
  );
}

export default App
