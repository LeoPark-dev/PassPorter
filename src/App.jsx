import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Dock from '../components/Dock/Dock.jsx'
import { Globe } from '@/components/ui/globe'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from '../components/motion-primitives/morphing-dialog'
import EntryRequirementsDashboard from './components/EntryRequirementsDashboard'
import DocumentPracticeLeft from './components/DocumentPracticeLeft'
import EnglishPractice from './components/EnglishPractice'
import AIPractice from './components/AIPractice'
import CEFRTest from './components/CEFRTest'
import { CardDemo } from './components/ui/CardDemo'
import { IconX } from '@tabler/icons-react'
import './App.css'
import './components/DocumentPractice.css'
import homeIcon from '../assets/home.svg'
import checkIcon from '../assets/check.svg'
import writingIcon from '../assets/writing.svg'
import quizIcon from '../assets/quiz.svg'
import conversationIcon from '../assets/conversation.svg'
import expandIcon from '../assets/expand.svg'

function App() {
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')
  const [newsArticles, setNewsArticles] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoadingNews, setIsLoadingNews] = useState(false)
  const [showEntryRequirements, setShowEntryRequirements] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showDocumentPractice, setShowDocumentPractice] = useState(false)
  const [showEnglishPractice, setShowEnglishPractice] = useState(false)
  const [showAIPractice, setShowAIPractice] = useState(false)
  const [showAuthCard, setShowAuthCard] = useState(false)
  const [showLevelTest, setShowLevelTest] = useState(false)
  const [draggedArticle, setDraggedArticle] = useState(null)
  const [articleAnalysis, setArticleAnalysis] = useState(null)
  const [isAnalyzingArticle, setIsAnalyzingArticle] = useState(false)
  
  // 서류작성 연습 관련 상태
  const FORM_FIELDS = [
    { id: 'name', label: '성명 (Full Name)', placeholder: '홍길동 / Hong Gil Dong' },
    { id: 'birthDate', label: '생년월일 (Date of Birth)', placeholder: 'YYYY-MM-DD' },
    { id: 'nationality', label: '국적 (Nationality)', placeholder: '대한민국 / Republic of Korea' },
    { id: 'passportNumber', label: '여권번호 (Passport Number)', placeholder: 'M12345678' },
    { id: 'departure', label: '출발지 (Departure)', placeholder: '서울, 대한민국 / Seoul, Korea' },
    { id: 'arrival', label: '도착지 (Arrival)', placeholder: '뉴욕, 미국 / New York, USA' },
    { id: 'purpose', label: '체류 목적 (Purpose of Visit)', placeholder: '관광 / Tourism' },
    { id: 'duration', label: '체류 기간 (Duration of Stay)', placeholder: '7일 / 7 days' },
    { id: 'accommodation', label: '숙소 주소 (Accommodation Address)', placeholder: '호텔명 및 주소' },
    { id: 'contact', label: '연락처 (Contact Information)', placeholder: '전화번호 또는 이메일' },
  ]
  const [documentFormData, setDocumentFormData] = useState({})
  const [documentFeedbacks, setDocumentFeedbacks] = useState({})
  const [showDocumentFeedbacks, setShowDocumentFeedbacks] = useState({})
  const [isLoadingDocumentFeedback, setIsLoadingDocumentFeedback] = useState(false)

  // 국가명을 국가 코드로 변환하는 함수
  const getCountryCode = (countryName) => {
    const countryMap = {
      '한국': 'kr', '대한민국': 'kr', 'Korea': 'kr', 'South Korea': 'kr',
      '미국': 'us', 'United States': 'us', 'USA': 'us', 'America': 'us',
      '일본': 'jp', 'Japan': 'jp',
      '중국': 'cn', 'China': 'cn',
      '영국': 'gb', 'United Kingdom': 'gb', 'UK': 'gb',
      '프랑스': 'fr', 'France': 'fr',
      '독일': 'de', 'Germany': 'de',
      '이탈리아': 'it', 'Italy': 'it',
      '스페인': 'es', 'Spain': 'es',
      '캐나다': 'ca', 'Canada': 'ca',
      '호주': 'au', 'Australia': 'au',
      '태국': 'th', 'Thailand': 'th',
      '베트남': 'vn', 'Vietnam': 'vn',
      '싱가포르': 'sg', 'Singapore': 'sg',
      '인도네시아': 'id', 'Indonesia': 'id',
      '필리핀': 'ph', 'Philippines': 'ph',
      '말레이시아': 'my', 'Malaysia': 'my',
      '인도': 'in', 'India': 'in',
      '브라질': 'br', 'Brazil': 'br',
      '멕시코': 'mx', 'Mexico': 'mx',
      '뉴질랜드': 'nz', 'New Zealand': 'nz',
    }
    
    if (!countryName) return null
    
    // 정확한 매칭 시도
    if (countryMap[countryName]) {
      return countryMap[countryName]
    }
    
    // 대소문자 무시 매칭
    const normalized = countryName.trim()
    for (const [key, value] of Object.entries(countryMap)) {
      if (key.toLowerCase() === normalized.toLowerCase()) {
        return value
      }
    }
    
    return null
  }

  // 국가명을 영어로 변환하는 함수
  const getCountryNameInEnglish = (countryName) => {
    const countryMap = {
      '한국': 'South Korea', '대한민국': 'South Korea', 'Korea': 'South Korea',
      '미국': 'United States', 'United States': 'United States', 'USA': 'United States', 'America': 'United States',
      '일본': 'Japan', 'Japan': 'Japan',
      '중국': 'China', 'China': 'China',
      '영국': 'United Kingdom', 'United Kingdom': 'United Kingdom', 'UK': 'United Kingdom',
      '프랑스': 'France', 'France': 'France',
      '독일': 'Germany', 'Germany': 'Germany',
      '이탈리아': 'Italy', 'Italy': 'Italy',
      '스페인': 'Spain', 'Spain': 'Spain',
      '캐나다': 'Canada', 'Canada': 'Canada',
      '호주': 'Australia', 'Australia': 'Australia',
      '태국': 'Thailand', 'Thailand': 'Thailand',
      '베트남': 'Vietnam', 'Vietnam': 'Vietnam',
      '싱가포르': 'Singapore', 'Singapore': 'Singapore',
      '인도네시아': 'Indonesia', 'Indonesia': 'Indonesia',
      '필리핀': 'Philippines', 'Philippines': 'Philippines',
      '말레이시아': 'Malaysia', 'Malaysia': 'Malaysia',
      '인도': 'India', 'India': 'India',
      '브라질': 'Brazil', 'Brazil': 'Brazil',
      '멕시코': 'Mexico', 'Mexico': 'Mexico',
      '뉴질랜드': 'New Zealand', 'New Zealand': 'New Zealand',
    }
    
    if (!countryName) return null
    
    // 정확한 매칭 시도
    if (countryMap[countryName]) {
      return countryMap[countryName]
    }
    
    // 대소문자 무시 매칭
    const normalized = countryName.trim()
    for (const [key, value] of Object.entries(countryMap)) {
      if (key.toLowerCase() === normalized.toLowerCase()) {
        return value
      }
    }
    
    // 매칭되지 않으면 원본 반환
    return countryName
  }

  // 입국 관련 뉴스 가져오기 (News API 사용)
  const fetchEntryNews = async (departureCountry = null, arrivalCountry = null) => {
    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY
      if (!apiKey) {
        console.warn('News API 키가 설정되지 않았습니다. .env 파일에 VITE_NEWS_API_KEY를 설정해주세요.')
        return []
      }

      // 검색 키워드 구성 (관광, 여행, 비즈니스, 입국 관련)
      const keywords = ['tourism', 'travel', 'business', 'immigration', 'visa', 'entry requirements', 'tourist', 'visitor']
      let query = keywords.join(' OR ')
      
      // 국가 정보 추가
      if (arrivalCountry) {
        const arrivalEnglish = getCountryNameInEnglish(arrivalCountry)
        if (arrivalEnglish) {
          query = `${query} AND (${arrivalEnglish} OR ${arrivalCountry})`
        } else {
          query = `${query} AND ${arrivalCountry}`
        }
      }
      
      if (departureCountry && departureCountry !== arrivalCountry) {
        const departureEnglish = getCountryNameInEnglish(departureCountry)
        if (departureEnglish) {
          query = `${query} AND (${departureEnglish} OR ${departureCountry})`
        } else {
          query = `${query} AND ${departureCountry}`
        }
      }

      // News API 호출 (Vercel Serverless Function을 통해)
      // 프로덕션에서는 /api/news를 사용하고, 개발 환경에서는 직접 호출
      const isDevelopment = import.meta.env.DEV
      let url
      
      if (isDevelopment) {
        // 개발 환경: 직접 호출 (vite.config.js의 proxy 사용)
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
      } else {
        // 프로덕션: Vercel Serverless Function 사용
        url = `/api/news?query=${encodeURIComponent(query)}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`News API 요청 실패: ${response.status} - ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status === 'ok' && data.articles) {
        // 기사 데이터 변환
        const articles = data.articles
          .filter(article => article.title && article.title !== '[Removed]' && article.url)
          .slice(0, 20)
          .map((article, index) => ({
            id: `news-${index}-${Date.now()}-${Math.random()}`,
            title: article.title || 'No title',
            description: article.description || '',
            content: article.content || article.description || '',
            source: article.source?.name || 'Unknown source',
            publishedAt: article.publishedAt || new Date().toISOString(),
            image: getValidImageUrl(article.urlToImage),
            url: article.url || '#'
          }))
        
        return articles
      } else {
        throw new Error(data.message || '뉴스를 가져올 수 없습니다.')
      }
    } catch (error) {
      console.error('뉴스 가져오기 오류:', error)
      return []
    }
  }

  // 초기 입국 관련 뉴스 로드
  useEffect(() => {
    const loadInitialNews = async () => {
      setIsLoadingNews(true)
      try {
        const articles = await fetchEntryNews()
        if (articles.length > 0) {
          setNewsArticles(articles)
        } else {
          console.warn('초기 뉴스를 불러올 수 없습니다.')
        }
      } catch (error) {
        console.error('초기 뉴스 로드 실패:', error)
      } finally {
        setIsLoadingNews(false)
      }
    }
    
    loadInitialNews()
  }, [])

  const dockItems = [
    {
      icon: <img src={homeIcon} alt="Home" className="dock-icon-image" />,
      label: 'Home',
      onClick: () => {
        setShowEntryRequirements(false)
        setShowDocumentPractice(false)
        setShowEnglishPractice(false)
        setShowAIPractice(false)
        setShowLevelTest(false)
        setSelectedCountry(null)
        setIsExpanded(true)
      },
    },
    {
      icon: <img src={checkIcon} alt="입국요건 확인" className="dock-icon-image" />,
      label: '입국요건 확인',
      onClick: () => {
        setShowDocumentPractice(false)
        setShowEnglishPractice(false)
        setShowAIPractice(false)
        setSelectedCountry('미국')
        setShowEntryRequirements(true)
        setIsExpanded(true)
      },
    },
    {
      icon: <img src={writingIcon} alt="서류작성 연습" className="dock-icon-image" />,
      label: '서류작성 연습',
      onClick: () => {
        setShowEntryRequirements(false)
        setShowEnglishPractice(false)
        setShowAIPractice(false)
        setShowDocumentPractice(true)
        setIsExpanded(false) // 왼쪽/오른쪽 패널로 나뉨
      },
    },
    {
      icon: <img src={conversationIcon} alt="영어 표현 공부하기" className="dock-icon-image" />,
      label: '영어 표현 공부하기',
      onClick: () => {
        setShowEntryRequirements(false)
        setShowDocumentPractice(false)
        setShowAIPractice(false)
        setShowEnglishPractice(true)
        setIsExpanded(true)
        setSelectedCountry(null)
      },
    },
    {
      icon: <img src={quizIcon} alt="AI와 연습하기" className="dock-icon-image" />,
      label: 'AI와 연습하기',
      onClick: () => {
        setShowEntryRequirements(false)
        setShowDocumentPractice(false)
        setShowEnglishPractice(false)
        setShowAIPractice(true)
        setIsExpanded(true)
        setSelectedCountry(null)
      },
    },
  ]

  const handleSearch = async () => {
    if (!arrival.trim()) {
      alert('도착지를 입력해주세요.')
      return
    }
    
    setIsLoadingNews(true)
    setNewsArticles([])
    
    try {
      // 출발지와 도착지 정보로 입국 관련 뉴스 가져오기
      const articles = await fetchEntryNews(departure.trim() || null, arrival.trim())
      
      if (articles.length === 0) {
        alert('해당 국가의 입국 관련 뉴스를 찾을 수 없습니다.')
        // 초기 뉴스로 복원
        const initialArticles = await fetchEntryNews()
        setNewsArticles(initialArticles)
      } else {
        setNewsArticles(articles)
      }
    } catch (error) {
      console.error('뉴스 검색 실패:', error)
      alert(`뉴스를 가져오는 중 오류가 발생했습니다: ${error.message}`)
      // 에러 발생 시 초기 뉴스로 복원
      const initialArticles = await fetchEntryNews()
      setNewsArticles(initialArticles)
    } finally {
      setIsLoadingNews(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  // 이미지 로드 실패 시 대체 이미지 사용
  const handleImageError = (e) => {
    // 기본 placeholder 이미지로 대체
    if (e.target.src !== getDefaultImage()) {
      e.target.src = getDefaultImage()
      e.target.onerror = null // 무한 루프 방지
    }
  }

  // 기본 이미지 URL 생성
  const getDefaultImage = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ld3MgQXJ0aWNsZTwvdGV4dD48L3N2Zz4='
  }

  // 이미지 URL 검증 및 기본 이미지 반환
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'null' || imageUrl === 'undefined') {
      return getDefaultImage()
    }
    // data URL이거나 기본 이미지인 경우 그대로 반환
    if (imageUrl.startsWith('data:')) {
      return imageUrl
    }
    // 외부 URL인 경우 그대로 반환 (onError에서 처리)
    return imageUrl
  }

  // 드래그 시작
  const handleDragStart = (e, article) => {
    setDraggedArticle(article)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', article.id)
  }

  // 드래그 오버
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // 드래그 오버 시 draggedArticle이 설정되어 있으면 블러 효과 유지
    if (!draggedArticle) {
      // 드래그 중인 기사 정보가 없으면 설정 (이미지나 다른 요소에서 드래그 시작한 경우)
      const articleId = e.dataTransfer.getData('text/html')
      if (articleId) {
        const article = newsArticles.find(a => a.id === articleId)
        if (article) {
          setDraggedArticle(article)
        }
      }
    }
  }

  // 드롭 처리 및 기사 분석
  const handleDrop = async (e) => {
    e.preventDefault()
    
    // draggedArticle이 없으면 dataTransfer에서 가져오기
    let articleToAnalyze = draggedArticle
    if (!articleToAnalyze) {
      const articleId = e.dataTransfer.getData('text/html')
      if (articleId) {
        articleToAnalyze = newsArticles.find(a => a.id === articleId)
      }
    }
    
    if (!articleToAnalyze) {
      return
    }

    setIsAnalyzingArticle(true)
    setArticleAnalysis(null)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        alert('Gemini API 키가 설정되지 않았습니다.\n\n.env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.')
        setIsAnalyzingArticle(false)
        setDraggedArticle(null)
        return
      }

      // URL 대신 기사 내용 사용 (보안 문제 해결)
      const articleTitle = articleToAnalyze.title || ''
      const articleDescription = articleToAnalyze.description || ''
      const articleContent = articleToAnalyze.content || articleToAnalyze.description || ''
      
      const prompt = `다음 뉴스 기사를 상세하게 분석하고 다음 형식으로 정리해주세요:

제목: ${articleTitle}
설명: ${articleDescription}
내용: ${articleContent}

**중요 지시사항:**
1. headline: 기사의 핵심 내용을 정확하게 요약한 한 줄 제목 (한국어, 50자 이내)
2. summary: 기사의 핵심 내용을 3개의 문장으로 요약하되, 각 문장은:
   - 초급자도 이해할 수 있는 간단한 영어 문장 (15-20단어)
   - 해당 영어 문장의 정확한 한국어 해석
   - 기사의 실제 내용을 반영한 구체적인 정보 포함
3. keywords: 기사에서 가장 중요한 핵심 키워드 3-5개 (영어, 명사형)
4. keyExpressions: 기사에서 실제로 사용된 실용적인 영어 표현 3개, 각각:
   - 표현: 기사에서 사용된 실제 영어 표현 또는 중요한 단어
   - 의미: 한국어로 정확한 의미 설명
   - 예문: 기사 내에서 사용된 실제 문장 또는 유사한 맥락의 새로운 예문

다음 형식으로 JSON 응답을 제공해주세요:
{
  "headline": "기사의 핵심 내용을 정확하게 요약한 한 줄 제목 (한국어, 50자 이내)",
  "summary": [
    {
      "english": "기사의 첫 번째 핵심 내용을 초급자도 이해할 수 있는 간단한 영어 문장으로 작성 (15-20단어)",
      "korean": "위 영어 문장의 정확한 한국어 해석"
    },
    {
      "english": "기사의 두 번째 핵심 내용을 초급자도 이해할 수 있는 간단한 영어 문장으로 작성 (15-20단어)",
      "korean": "위 영어 문장의 정확한 한국어 해석"
    },
    {
      "english": "기사의 세 번째 핵심 내용을 초급자도 이해할 수 있는 간단한 영어 문장으로 작성 (15-20단어)",
      "korean": "위 영어 문장의 정확한 한국어 해석"
    }
  ],
  "keywords": ["기사에서 가장 중요한 키워드1 (영어)", "키워드2", "키워드3", "키워드4", "키워드5"],
  "keyExpressions": [
    {
      "expression": "기사에서 실제로 사용된 중요한 영어 표현 또는 단어",
      "meaning": "해당 표현의 정확한 한국어 의미 설명 (2-3문장으로 상세히)",
      "example": "기사 내에서 사용된 실제 문장 또는 유사한 맥락의 새로운 예문 (완전한 문장으로 작성)"
    },
    {
      "expression": "기사에서 실제로 사용된 중요한 영어 표현 또는 단어",
      "meaning": "해당 표현의 정확한 한국어 의미 설명 (2-3문장으로 상세히)",
      "example": "기사 내에서 사용된 실제 문장 또는 유사한 맥락의 새로운 예문 (완전한 문장으로 작성)"
    },
    {
      "expression": "기사에서 실제로 사용된 중요한 영어 표현 또는 단어",
      "meaning": "해당 표현의 정확한 한국어 의미 설명 (2-3문장으로 상세히)",
      "example": "기사 내에서 사용된 실제 문장 또는 유사한 맥락의 새로운 예문 (완전한 문장으로 작성)"
    }
  ]
}

**반드시 지켜야 할 사항:**
- 모든 내용은 기사의 실제 내용을 바탕으로 작성
- 추측이나 일반적인 내용이 아닌, 기사에 명시된 구체적인 정보 사용
- 영어 표현은 기사에서 실제로 사용된 표현 우선 선택
- 의미 설명은 2-3문장으로 상세하게 작성
- 예문은 완전한 문장으로 작성하고 맥락을 명확히 전달
- JSON 형식을 정확히 지켜서 응답`

      const model = 'gemini-2.0-flash'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API 요청 실패:', response.status, errorData)
        throw new Error(`API 요청 실패: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      console.log('API 응답 데이터:', data)

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('API 응답 형식 오류:', data)
        throw new Error('API 응답 형식이 올바르지 않습니다.')
      }

      const responseText = data.candidates[0].content.parts[0].text
      console.log('Gemini API 응답:', responseText)
      
      // JSON 추출
      let parsedAnalysis
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedAnalysis = JSON.parse(jsonMatch[0])
          console.log('파싱된 분석 결과:', parsedAnalysis)
        } else {
          console.warn('JSON 형식을 찾을 수 없습니다. 전체 응답:', responseText)
          throw new Error('JSON 형식을 찾을 수 없습니다.')
        }
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError)
        console.error('원본 응답:', responseText)
        throw new Error('응답을 파싱할 수 없습니다.')
      }

      console.log('분석 결과 설정 전:', parsedAnalysis)
      setArticleAnalysis(parsedAnalysis)
      console.log('분석 결과 설정 완료')
    } catch (error) {
      console.error('기사 분석 실패:', error)
      alert(`기사 분석 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setIsAnalyzingArticle(false)
      setDraggedArticle(null)
    }
  }

  // 드래그 종료 시 상태 초기화
  const handleDragEnd = () => {
    setDraggedArticle(null)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // 서류작성 연습 핸들러
  const handleDocumentInputChange = (fieldId, value) => {
    setDocumentFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    // 피드백이 있으면 초기화
    if (documentFeedbacks[fieldId]) {
      setDocumentFeedbacks(prev => {
        const newFeedbacks = { ...prev }
        delete newFeedbacks[fieldId]
        return newFeedbacks
      })
      setShowDocumentFeedbacks(prev => {
        const newShowFeedbacks = { ...prev }
        delete newShowFeedbacks[fieldId]
        return newShowFeedbacks
      })
    }
  }

  const toggleDocumentFeedback = (fieldId) => {
    setShowDocumentFeedbacks(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }))
  }

  const getDocumentFeedbackFromAI = async () => {
    setIsLoadingDocumentFeedback(true)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        alert('Gemini API 키가 설정되지 않았습니다.\n\n.env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.\n\n설정 후 개발 서버를 재시작해야 합니다.')
        setIsLoadingDocumentFeedback(false)
        return
      }
      
      // API 키 형식 확인 (일반적으로 AIza로 시작)
      if (!apiKey.startsWith('AIza')) {
        console.warn('API 키 형식이 예상과 다릅니다. 일반적으로 "AIza"로 시작합니다.')
      }
      
      console.log('API 키 확인:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4))

      // 사용자가 입력한 모든 필드 데이터를 JSON 형태로 준비
      const filledFields = Object.entries(documentFormData)
        .filter(([_, value]) => value && value.trim())
        .map(([key, value]) => {
          const field = FORM_FIELDS.find(f => f.id === key)
          return {
            fieldId: key,
            fieldLabel: field?.label || key,
            userInput: value
          }
        })

      if (filledFields.length === 0) {
        alert('최소 하나 이상의 항목을 입력해주세요.')
        setIsLoadingDocumentFeedback(false)
        return
      }

      // Gemini API 호출
      const prompt = `당신은 입국 심사관입니다. 다음 입국 신고서 작성 내용을 검토하고 각 항목에 대해 구체적인 피드백과 팁을 제공해주세요.

입력된 항목들:
${filledFields.map(f => `- ${f.fieldLabel} (fieldId: ${f.fieldId}): ${f.userInput}`).join('\n')}

각 항목에 대해 다음을 포함한 구체적인 피드백을 제공해주세요:
1. 정확성 평가: 입력 내용이 올바른지, 형식이 적절한지 평가
2. 개선 사항: 더 나은 작성 방법이나 추가 정보 제안
3. 실용적인 팁: 해당 항목 작성 시 유용한 조언

반드시 다음 JSON 형식으로 응답해주세요. 모든 입력된 항목에 대해 피드백을 제공해야 합니다:
{
  "feedbacks": [
    {
      "fieldId": "name",
      "feedback": "구체적인 피드백 내용 (2-3문장)",
      "tip": "실용적인 팁 내용 (1-2문장)"
    },
    {
      "fieldId": "birthDate",
      "feedback": "구체적인 피드백 내용",
      "tip": "실용적인 팁 내용"
    }
  ]
}

중요: fieldId는 반드시 입력된 항목의 fieldId와 정확히 일치해야 합니다. (name, birthDate, nationality, passportNumber, departure, arrival, purpose, duration, accommodation, contact)`

      // AI 모델 사용
      const models = ['gemini-2.0-flash']
      let response = null
      let lastError = null
      
      for (const model of models) {
        try {
          // API 키를 URL 파라미터로 전달 (표준 방식)
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
          console.log(`시도 중: ${model}`)
          
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }]
            })
          })
          
          if (response.ok) {
            console.log(`성공: ${model}`)
            break
          } else {
            let errorText = ''
            try {
              const errorData = await response.json()
              errorText = JSON.stringify(errorData, null, 2)
              lastError = { 
                model, 
                status: response.status, 
                statusText: response.statusText,
                error: errorData 
              }
            } catch (e) {
              errorText = await response.text()
              lastError = { 
                model, 
                status: response.status, 
                statusText: response.statusText,
                error: errorText 
              }
            }
            console.error(`${model} 실패 (${response.status}):`, errorText)
            response = null
          }
        } catch (err) {
          lastError = { model, error: err.message, stack: err.stack }
          console.error(`${model} 네트워크 오류:`, err)
          response = null
        }
      }
      
      if (!response) {
        const errorMsg = lastError?.error?.message || 
                        lastError?.error?.error?.message ||
                        (typeof lastError?.error === 'string' ? lastError.error : JSON.stringify(lastError?.error)) ||
                        lastError?.statusText ||
                        '알 수 없는 오류'
        throw new Error(`모든 모델 시도 실패.\n\n마지막 시도 모델: ${lastError?.model}\n상태 코드: ${lastError?.status}\n오류: ${errorMsg}`)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API 응답 오류:', response.status, errorData)
        throw new Error(`API 요청 실패 (${response.status}): ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('API 응답 형식이 올바르지 않습니다.')
      }
      
      const responseText = data.candidates[0].content.parts[0].text
      console.log('Gemini API 응답:', responseText)

      // JSON 응답 파싱 시도
      let parsedFeedback
      let feedbackMap = {}
      
      try {
        // JSON 코드 블록 제거
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedFeedback = JSON.parse(jsonMatch[0])
          console.log('파싱된 피드백:', parsedFeedback)
          
          // 피드백을 필드별로 매핑 - 입력된 모든 필드에 대해 피드백 보장
          if (parsedFeedback.feedbacks && Array.isArray(parsedFeedback.feedbacks) && parsedFeedback.feedbacks.length > 0) {
            // 먼저 입력된 모든 필드에 대해 피드백 매핑
            filledFields.forEach(field => {
              // AI 응답에서 해당 fieldId를 가진 피드백 찾기
              const aiFeedback = parsedFeedback.feedbacks.find(fb => fb.fieldId === field.fieldId)
              
              if (aiFeedback) {
                // AI가 제공한 구체적인 피드백 사용
                feedbackMap[field.fieldId] = {
                  feedback: aiFeedback.feedback || '피드백이 제공되지 않았습니다.',
                  tip: aiFeedback.tip || '추가 팁이 없습니다.'
                }
              } else {
                // AI가 해당 필드에 대한 피드백을 제공하지 않은 경우
                // 다른 필드의 피드백을 참고하거나 기본 메시지 제공
                console.warn(`필드 ${field.fieldId}에 대한 피드백이 AI 응답에 없습니다.`)
                feedbackMap[field.fieldId] = {
                  feedback: `${field.fieldLabel}에 대한 구체적인 피드백이 제공되지 않았습니다. 입력 내용을 다시 확인해주세요.`,
                  tip: '입력 형식과 내용이 올바른지 확인하세요.'
                }
              }
            })
          } else {
            // 배열이 없거나 비어있는 경우 전체 응답을 각 필드에 사용
            console.warn('feedbacks 배열이 없거나 비어있음, 전체 응답 사용')
            filledFields.forEach(field => {
              feedbackMap[field.fieldId] = {
                feedback: responseText,
                tip: 'AI 피드백을 확인하세요.'
              }
            })
          }
        } else {
          // JSON 형식이 아닌 경우 전체 텍스트를 피드백으로 사용
          console.warn('JSON 형식이 아님, 전체 텍스트 사용')
          filledFields.forEach(field => {
            feedbackMap[field.fieldId] = {
              feedback: responseText,
              tip: 'AI 피드백을 확인하세요.'
            }
          })
        }
      } catch (parseError) {
        console.warn('JSON 파싱 실패, 전체 텍스트 사용:', parseError)
        // JSON 파싱 실패 시 전체 텍스트를 피드백으로 사용
        filledFields.forEach(field => {
          feedbackMap[field.fieldId] = {
            feedback: responseText,
            tip: 'AI 피드백을 확인하세요.'
          }
        })
      }

      console.log('최종 피드백 맵:', feedbackMap)
      console.log('피드백 맵 키 개수:', Object.keys(feedbackMap).length)
      
      // 피드백 맵이 비어있지 않은 경우에만 상태 업데이트
      if (Object.keys(feedbackMap).length > 0) {
        setDocumentFeedbacks(feedbackMap)
        console.log('피드백 상태 업데이트 완료, documentFeedbacks:', feedbackMap)
      } else {
        console.error('피드백 맵이 비어있습니다!')
        // 빈 피드백 맵이라도 설정하여 로딩 상태 해제
        setDocumentFeedbacks({})
        alert('피드백을 받을 수 없습니다. 입력한 내용을 확인해주세요.')
      }
      
      // 로딩 상태 명시적으로 해제
      setIsLoadingDocumentFeedback(false)
      console.log('로딩 상태 해제 완료')

    } catch (error) {
      console.error('피드백 가져오기 실패:', error)
      const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.'
      
      // 404 오류인 경우 특별한 안내
      if (errorMessage.includes('404') || errorMessage.includes('모든 모델 시도 실패')) {
        alert(`API 요청 실패 (404 오류)\n\n가능한 원인:\n1. API 키가 올바르지 않거나 만료되었습니다.\n2. 모델 이름이 변경되었을 수 있습니다.\n3. API 키에 해당 모델에 대한 접근 권한이 없을 수 있습니다.\n\n확인 사항:\n- .env 파일에 VITE_GEMINI_API_KEY가 올바르게 설정되어 있는지 확인하세요.\n- Google AI Studio에서 API 키가 활성화되어 있는지 확인하세요.\n- 개발 서버를 재시작했는지 확인하세요.\n\n상세 오류:\n${errorMessage}`)
      } else {
        alert(`피드백을 가져오는 중 오류가 발생했습니다.\n\n${errorMessage}`)
      }
    } finally {
      setIsLoadingDocumentFeedback(false)
    }
  }

  return (
    <motion.div 
      className="app-container"
      animate={{
        gap: isExpanded ? '0rem' : '1rem',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div 
        className={`left-panel ${draggedArticle ? 'dragging-over' : ''}`}
        animate={{
          width: showDocumentPractice ? '45%' : (showEnglishPractice || showAIPractice) ? 'calc(100vw - 2rem)' : (isExpanded ? 'calc(100vw - 2rem)' : '45%'),
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{
          flexShrink: 0,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {showEntryRequirements ? (
          <EntryRequirementsDashboard
            country={selectedCountry}
            onClose={() => setShowEntryRequirements(false)}
          />
              ) : showDocumentPractice ? (
                <div className="document-practice-left-panel">
                  <div className="document-form-container">
                    <h2 className="document-form-title">입국 신고서 작성 연습</h2>
                    <div className="document-form-fields">
                      {FORM_FIELDS.map((field) => (
                        <div key={field.id} className="document-form-field">
                          <label htmlFor={field.id} className="document-form-label">
                            {field.label}
                          </label>
                          <input
                            id={field.id}
                            type="text"
                            className="document-form-input"
                            placeholder={field.placeholder}
                            value={documentFormData[field.id] || ''}
                            onChange={(e) => handleDocumentInputChange(field.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      className="document-submit-button"
                      onClick={getDocumentFeedbackFromAI}
                      disabled={isLoadingDocumentFeedback}
                    >
                      {isLoadingDocumentFeedback ? '검토 중...' : '검토받기'}
                    </button>
                  </div>
                </div>
              ) : showLevelTest ? (
            <CEFRTest onClose={() => setShowLevelTest(false)} />
          ) : showEnglishPractice ? (
            <EnglishPractice />
          ) : showAIPractice ? (
            <AIPractice />
          ) : (
          <>
            <button 
              className="expand-button"
              onClick={toggleExpand}
            >
              <img src={expandIcon} alt="Expand" className="expand-icon" />
            </button>
            <div className="rotating-text-wrapper">
              <LayoutTextFlip
                text="Pass"
                words={["Porter", "Easily", "Quickly", "Perfectly"]}
                duration={2000}
              />
            </div>
            <div className="globe-background">
              <Globe className="globe-component relative" />
            </div>
            <div className="get-started-button-wrapper">
              <button
                onClick={() => setShowAuthCard(true)}
                className="get-started-button"
              >
                Get Started
              </button>
              <button
                onClick={() => setShowLevelTest(true)}
                className="level-test-button"
              >
                Level Test
              </button>
            </div>
            
            {/* 드롭된 기사 분석 결과 */}
            {articleAnalysis && (
              <div className="article-analysis-container">
                <div className="article-analysis-header">
                  <h2 className="article-analysis-title">기사 분석</h2>
                  <button
                    className="article-analysis-close"
                    onClick={() => setArticleAnalysis(null)}
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
                <div className="article-analysis-content">
                  <div className="article-analysis-section">
                    <h3 className="article-analysis-section-title">Headline</h3>
                    <p className="article-analysis-headline">{articleAnalysis.headline}</p>
                  </div>
                  
                  <div className="article-analysis-section">
                    <h3 className="article-analysis-section-title">Summary</h3>
                    {articleAnalysis.summary && articleAnalysis.summary.map((item, idx) => (
                      <div key={idx} className="article-analysis-summary-item">
                        <p className="article-analysis-english">{item.english}</p>
                        <p className="article-analysis-korean">{item.korean}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="article-analysis-section">
                    <h3 className="article-analysis-section-title">Keywords</h3>
                    <div className="article-analysis-keywords">
                      {articleAnalysis.keywords && articleAnalysis.keywords.map((keyword, idx) => (
                        <span key={idx} className="article-analysis-keyword">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="article-analysis-section">
                    <h3 className="article-analysis-section-title">Key Expressions</h3>
                    {articleAnalysis.keyExpressions && articleAnalysis.keyExpressions.map((expr, idx) => (
                      <div key={idx} className="article-analysis-expression">
                        <p className="article-analysis-expression-text">
                          <strong>{expr.expression}</strong> - {expr.meaning}
                        </p>
                        <p className="article-analysis-expression-example">예: {expr.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {isAnalyzingArticle && (
              <div className="article-analysis-loading">
                <div className="ai-loading">
                  <span className="ai-loading-dot"></span>
                  <span className="ai-loading-dot"></span>
                  <span className="ai-loading-dot"></span>
                </div>
                <p>기사를 분석하는 중...</p>
              </div>
            )}
          </>
        )}
        <div className="dock-wrapper">
          <Dock 
            items={dockItems} 
            baseItemSize={42}
            panelHeight={58}
            magnification={60}
          />
        </div>
      </motion.div>
      {showDocumentPractice ? (
        <motion.div 
          className="right-panel document-practice-right"
          initial={{ width: '0%', opacity: 0 }}
          animate={{
            width: 'calc(55% - 1rem)',
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            opacity: {
              duration: 0.2,
            },
          }}
          style={{
            overflow: 'auto',
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <div className="document-feedback-container">
            <h2 className="document-feedback-title">AI 피드백</h2>
            {isLoadingDocumentFeedback ? (
              <div className="document-feedback-loading">
                <div className="ai-loading">
                  <span className="ai-loading-dot"></span>
                  <span className="ai-loading-dot"></span>
                  <span className="ai-loading-dot"></span>
                </div>
                <p>AI가 검토 중입니다...</p>
              </div>
            ) : Object.keys(documentFeedbacks).length === 0 ? (
              <div className="document-feedback-empty">
                <p>왼쪽 패널에서 입력한 내용을 검토받으세요.</p>
              </div>
            ) : (
              <div className="document-feedback-list">
                {FORM_FIELDS.map((field) => {
                  if (!documentFeedbacks[field.id]) return null
                  return (
                    <div key={field.id} className="document-feedback-item">
                      <h3 className="document-feedback-item-title">{field.label}</h3>
                      <div className="document-feedback-content">
                        <div className="document-feedback-section">
                          <strong className="document-feedback-label">피드백:</strong>
                          <p className="document-feedback-text">{documentFeedbacks[field.id].feedback}</p>
                        </div>
                        {documentFeedbacks[field.id].tip && (
                          <div className="document-feedback-section">
                            <strong className="document-feedback-label">팁:</strong>
                            <p className="document-feedback-text">{documentFeedbacks[field.id].tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      ) : !showEnglishPractice && !showAIPractice ? (
        <motion.div 
          className="right-panel"
          animate={{
            width: isExpanded ? '0%' : 'calc(55% - 1rem)',
            opacity: isExpanded ? 0 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            opacity: {
              duration: 0.2,
            },
          }}
          style={{
            overflow: isExpanded ? 'hidden' : 'auto',
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <div className="route-selector">
            <input
              type="text"
              placeholder="Departure"
              className="route-input departure-input"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span className="arrow">→</span>
            <input
              type="text"
              placeholder="Arrival"
              className="route-input arrival-input"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="news-wrapper">
            {isLoadingNews ? (
              <div className="news-loading">뉴스를 불러오는 중...</div>
            ) : newsArticles.length > 0 ? (
              <BentoGrid className="news-bento-grid">
                {newsArticles.map((article) => (
                  <div
                    key={article.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, article)}
                    onDragEnd={handleDragEnd}
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <BentoGridItem
                      title={article.title}
                      description=""
                      header={
                        <div className="news-image-container">
                          <img
                            src={getValidImageUrl(article.image)}
                            alt={article.title}
                            className="news-image w-full h-full object-cover"
                            onError={handleImageError}
                            loading="lazy"
                          />
                        </div>
                      }
                      className="news-bento-item cursor-pointer"
                    />
                  </div>
                ))}
              </BentoGrid>
            ) : (
              <div className="news-loading">뉴스를 찾을 수 없습니다.</div>
            )}
          </div>
        </motion.div>
      ) : null}
      
      {/* 인증 카드 모달 */}
      <AnimatePresence>
        {showAuthCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="auth-card-overlay"
            onClick={() => setShowAuthCard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="auth-card-container"
              onClick={(e) => e.stopPropagation()}
            >
              <CardDemo />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App

