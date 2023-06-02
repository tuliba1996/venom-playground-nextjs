import dynamic from 'next/dynamic'


const Code = dynamic(() => import('./Code').then((imp) => imp.Code), {
  ssr: false,
})

export const RJson = ({ src, title = 'JSON' }: { src: object | undefined; title?: string }) => {
  if (!src) return null
  return (
    // <ReactJson
    //   theme={'apathy'}
    //   displayDataTypes={false}
    //   displayObjectSize={false}
    //   style={{ background: 'transparent', overflowX: 'auto' }}
    //   src={src}
    //   name={false}
    //   enableClipboard={false}
    //   collapseStringsAfterLength={80}
    // />
    <Code title={title} value={JSON.stringify(src, null, 2)} mode='json' maxLines={30} />
  )
}
