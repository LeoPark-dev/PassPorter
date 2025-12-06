// Vercel Serverless Function
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { query } = req.query

    if (!query) {
      res.status(400).json({ error: 'Query parameter is required' })
      return
    }

    const apiKey = process.env.VITE_NEWS_API_KEY

    if (!apiKey) {
      res.status(500).json({ error: 'News API key is not configured' })
      return
    }

    // News API 호출
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
    
    const response = await fetch(newsApiUrl)

    if (!response.ok) {
      const errorData = await response.text()
      res.status(response.status).json({ 
        error: 'News API request failed',
        details: errorData 
      })
      return
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('News API proxy error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

