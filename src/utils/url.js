export const getDirectImageUrl = (url) => {
  if (!url) return url
  
  // Handle Google Drive Links
  if (url.includes('drive.google.com')) {
    const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0]
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`
  }
  
  // Handle Dropbox Links
  if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '')
  }

  return url
}
