// 用于获取 url 中的 fid 和 cid
// '/abc?cid=xyz' => { fid: 'abc', cid: 'xyz' }

export function getUrlData(url: string) {
  const urlParts = url.split('?')
  const fid = urlParts[0].split('/')[1]
  let cid = ''
  if (urlParts.length > 1) {
    const searchParams = new URLSearchParams(urlParts[1])
    cid = searchParams.get('cid') || ''
  }

  return { fid, cid }
}
