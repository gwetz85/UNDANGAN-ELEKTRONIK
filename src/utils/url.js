export const getDirectImageUrl = (url) => {
  if (!url) return url
  
  // Handle Google Drive Links
  if (url.includes('drive.google.com')) {
    const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0]
    if (id) return `https://lh3.googleusercontent.com/d/${id}`
  }
  
  // Handle Dropbox Links
  if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '')
  }

  return url
}

export const getYoutubeId = (url) => {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}
