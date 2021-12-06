import { useState } from 'react'

function App() {

  const [user, setUser] = useState()

  const subscribeToWorker = async (userId) => {

    const register = await navigator.serviceWorker.register('./worker.js', {
      scope: '/'
    })

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    })

    const url = process.env.REACT_APP_SERVER_URL + '/subscription'
    const body = { subscription,  userId }
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.text())
    console.log(res)

  }


  const handleSubmit = async e => {
    e.preventDefault()
    const id = document.querySelector('#id').value

    const url = process.env.REACT_APP_SERVER_URL + '/user/' + id
    console.log(url)
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())

    if (res.success) {
      const user = res.user
      setUser(user)
      subscribeToWorker(user.id)
    } else {
      console.log(res.msg)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' id='id' name='id' placeholder='ID de usuario' />
        <input type='submit' />
      </form>
      <span style={{position: 'absolute', top: 0, right: 10}}>{user && user.username}</span>
    </div>
  );
}

export default App
