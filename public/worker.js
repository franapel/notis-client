console.log('service worker')

self.addEventListener('push', event => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEKR5aiFZXaEw/company-logo_200_200/0/1623338722735?e=2159024400&v=beta&t=hK8pPzamZcRK0qJCgoSbWwk3V2bIxsUpKjIvX7RIbD0'
    })
})