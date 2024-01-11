import axios from 'axios';


export const graphql = async (query: string, variables?: object) => {
  const baseUrl = process.env.REACT_APP_API_URL;

  try {
    if (!baseUrl) {
      throw new Error('No API URL');
    }

    const response = await axios.post(
      baseUrl,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } },
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}