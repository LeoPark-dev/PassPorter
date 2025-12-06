import { useState } from 'react'
import { motion } from 'motion/react'
import './DocumentPractice.css'
import customsFormImage from '../../assets/세관신고서.jpeg'

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

export default function DocumentPractice({ onClose }) {
  const [formData, setFormData] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [showFeedbacks, setShowFeedbacks] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    // 피드백이 있으면 초기화
    if (feedbacks[fieldId]) {
      setFeedbacks(prev => {
        const newFeedbacks = { ...prev }
        delete newFeedbacks[fieldId]
        return newFeedbacks
      })
      setShowFeedbacks(prev => {
        const newShowFeedbacks = { ...prev }
        delete newShowFeedbacks[fieldId]
        return newShowFeedbacks
      })
    }
  }

  const toggleFeedback = (fieldId) => {
    setShowFeedbacks(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }))
  }

  const getFeedbackFromAI = async () => {
    setIsLoading(true)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        alert('Gemini API 키가 설정되지 않았습니다.')
        return
      }

      // 사용자가 입력한 모든 필드 데이터를 JSON 형태로 준비
      const filledFields = Object.entries(formData)
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
        setIsLoading(false)
        return
      }

      // Gemini API 호출
      const prompt = `당신은 입국 심사관입니다. 다음 입국 신고서 작성 내용을 검토하고 각 항목에 대해 간단한 피드백과 팁을 제공해주세요. 
각 항목에 대해 다음 형식으로 응답해주세요:
- 정확성: 입력 내용이 올바른지 평가
- 개선 사항: 더 나은 작성 방법 제안
- 팁: 실용적인 조언

입력된 항목들:
${filledFields.map(f => `- ${f.fieldLabel}: ${f.userInput}`).join('\n')}

응답 형식은 JSON으로 해주세요:
{
  "feedbacks": [
    {
      "fieldId": "field_id",
      "feedback": "피드백 내용",
      "tip": "팁 내용"
    }
  ]
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
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
        }
      )

      if (!response.ok) {
        throw new Error('API 요청 실패')
      }

      const data = await response.json()
      const responseText = data.candidates[0].content.parts[0].text

      // JSON 응답 파싱 시도
      let parsedFeedback
      try {
        // JSON 코드 블록 제거
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedFeedback = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('JSON 형식이 아닙니다')
        }
      } catch (parseError) {
        // JSON 파싱 실패 시 전체 텍스트를 피드백으로 사용
        const feedbackMap = {}
        filledFields.forEach(field => {
          feedbackMap[field.fieldId] = {
            feedback: responseText,
            tip: 'AI 피드백을 확인하세요.'
          }
        })
        setFeedbacks(feedbackMap)
        setIsLoading(false)
        return
      }

      // 피드백을 필드별로 매핑
      const feedbackMap = {}
      if (parsedFeedback.feedbacks && Array.isArray(parsedFeedback.feedbacks)) {
        parsedFeedback.feedbacks.forEach(item => {
          feedbackMap[item.fieldId] = {
            feedback: item.feedback || '피드백이 제공되지 않았습니다.',
            tip: item.tip || '추가 팁이 없습니다.'
          }
        })
      } else {
        // 배열이 아닌 경우 전체 응답을 사용
        filledFields.forEach(field => {
          feedbackMap[field.fieldId] = {
            feedback: responseText,
            tip: 'AI 피드백을 확인하세요.'
          }
        })
      }

      setFeedbacks(feedbackMap)
      
      // 입력된 모든 필드에 대해 피드백 표시
      filledFields.forEach(field => {
        if (feedbackMap[field.fieldId]) {
          setShowFeedbacks(prev => ({
            ...prev,
            [field.fieldId]: true
          }))
        }
      })

    } catch (error) {
      console.error('피드백 가져오기 실패:', error)
      alert('피드백을 가져오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="document-practice-left">
        <div 
          className="document-form-background"
          style={{
            backgroundImage: `url(${customsFormImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
      </div>
    </>
  )
}

