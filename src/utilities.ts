import GameInit from './bootstrap'

export function delay (seconds: number): Promise<any> {
  let ms = seconds * 100

  return (data) => {
    return new Promise(resolve => window.setTimeout(() => resolve(data), ms))
  }
}

export function notify (...message: string[]): string[] {
  if (GameInit.notify === 'console') {
    console.info(...message)
  } else if (GameInit.notify === 'notification') {
    if (Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification((message).join(' '))
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(notify)
    }
  }

  return message
}

export function emit (name: string, details: any = {}) {
  let event = new CustomEvent(name, {
    detail: details
  })
  window.dispatchEvent(event)
}

export function assert (condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}
