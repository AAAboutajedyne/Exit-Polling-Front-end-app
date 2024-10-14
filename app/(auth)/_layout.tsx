
export default function LoginLayout(
  { children }: { children: React.ReactNode }
) {
  return (
    <section className="mt-8">
      <main role="main">
        { children }
      </main>
    </section>
  )
}
