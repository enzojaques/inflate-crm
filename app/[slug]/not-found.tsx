export default function PreviewNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
        404
      </p>
      <h1 className="mt-3 font-sans text-3xl font-bold text-stone-900">
        Preview Not Found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
        This client preview link doesn&rsquo;t exist or hasn&rsquo;t been
        published yet. Double-check the URL or contact NA Web Services.
      </p>
    </div>
  )
}
