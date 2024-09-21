
import axios from 'axios';

const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = '060be44662a274d551c0a6b47365c1198afe56b9';

export async function searchComics(query, newoffset = 1) {
  
  console.log('offset:', newoffset);
  
  const response = await axios.get(`http://localhost:8080/${API_BASE_URL}/search?offset=${newoffset}`, {
    params: {
      api_key: API_KEY,
      format: 'json',
      resources: 'issue',
      offset: newoffset+10,
      page: newoffset,
      limit: 10,
      query,
    },
  });

  

  return response.data.results;
}

export async function getComicDetails(comicId) {
  console.log('Url:', `${API_BASE_URL}/issue/4000-${comicId}`);
  const response = await axios.get(`http://localhost:8080/${API_BASE_URL}/issue/${comicId}`, {
    params: {
      api_key: API_KEY,
      format: 'json',
    },
  });

  return response.data.results;
}
