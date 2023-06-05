import dynamic from 'next/dynamic'


const CodeComponent = dynamic(() => import('./Code').then((imp) => imp.CodeComponent), {
  ssr: false,
})

export const RJson = ({ src, title = 'JSON' }: { src: object | undefined; title?: string }) => {
  if (!src) return null
  return (
    <CodeComponent title={title} value={JSON.stringify(src, null, 2)} mode='json' maxLines={30} />
  )
}
