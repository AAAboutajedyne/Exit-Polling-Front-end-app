
export function delay(time) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time)
  })
}