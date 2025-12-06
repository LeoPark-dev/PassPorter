import { Carousel, Card } from '@/components/ui/apple-cards-carousel'
import { IconPlane, IconBulb, IconMapPin, IconVolume, IconCopy } from '@tabler/icons-react'
import { useState } from 'react'
import tourismImage from '../../assets/tourism.jpg'
import studyImage from '../../assets/study.jpg'
import businessImage from '../../assets/business.jpg'
import './EnglishPractice.css'

const CATEGORIES = [
  { 
    id: 'tourism', 
    label: 'Tourism', 
    image: tourismImage,
    category: '관광',
    keywords: ['휴가', '호텔체크인', '관광지', '귀국행티켓'],
    tip: {
      title: '입국 심사 핵심 Tip',
      content: "관광객은 '불법 체류 의사가 없음'과 '숙소와 경비가 확실함'을 보여주는 것이 가장 중요합니다.",
      highlights: ['불법 체류 의사가 없음', '숙소와 경비가 확실함']
    },
    immigration: {
      purpose: [
        { en: "I'm here for sightseeing and relaxation.", ko: '관광하고 좀 쉬려고 왔습니다.', vocab: 'Sightseeing: 관광 / Relaxation: 휴식' },
        { en: "I'm on vacation with my family.", ko: '가족들과 휴가차 왔습니다.' }
      ],
      duration: [
        { en: "I'll be staying for 5 days.", ko: '5일 동안 머물 예정입니다.' }
      ],
      accommodation: [
        { en: "I'm staying at the [Hotel Name] in downtown.", ko: '시내에 있는 [호텔이름]에 묵습니다.' }
      ],
      return: [
        { en: "Yes, here is my return ticket.", ko: '네, 여기 제 귀국행 티켓이 있습니다.' }
      ]
    },
    local: {
      directions: [
        { en: "Excuse me, could you tell me the way to the nearest subway station?", ko: '실례합니다만, 가장 가까운 지하철역 가는 길 좀 알려주시겠어요?' }
      ],
      photo: [
        { en: "Could you please take a picture of us?", ko: '저희 사진 좀 찍어주실 수 있나요?' }
      ],
      recommendations: [
        { en: "Do you have any recommendations for local food?", ko: '현지 음식 추천해주실 만한 게 있나요?' }
      ]
    }
  },
  { 
    id: 'study', 
    label: 'Study', 
    image: studyImage,
    category: '유학/어학연수',
    keywords: ['학생 비자', '학교', '기숙사', '입학 허가서', '은행 계좌'],
    tip: {
      title: '입국 심사 핵심 Tip',
      content: "유학생은 '합법적인 비자 서류(I-20 등)'와 '학업 계획'을 명확히 말하는 것이 중요합니다.",
      highlights: ['합법적인 비자 서류', '학업 계획']
    },
    immigration: {
      purpose: [
        { en: "I'm here to study [Major] at [University Name].", ko: '[대학명]에서 [전공]을 공부하러 왔습니다.' },
        { en: "I'm an exchange student for this semester.", ko: '이번 학기 교환학생으로 왔습니다.' }
      ],
      documents: [
        { en: "Here is my passport and I-20 form.", ko: '여기 제 여권과 입학 허가서입니다.' },
        { en: "Here is my admission letter.", ko: '여기 입학 허가서입니다.' }
      ],
      finance: [
        { en: "My parents are supporting me financially.", ko: '부모님이 재정적 지원을 해주십니다.' },
        { en: "I have a scholarship covering my tuition.", ko: '학비를 지원받는 장학금이 있습니다.' }
      ]
    },
    local: {
      registration: [
        { en: "I need help registering for my classes.", ko: '수강 신청하는 것 좀 도와주세요.' }
      ],
      dorm: [
        { en: "Where can I pick up my dorm key?", ko: '기숙사 열쇠는 어디서 받나요?' }
      ],
      bank: [
        { en: "I'd like to open a student bank account.", ko: '학생용 은행 계좌를 개설하고 싶습니다.' }
      ]
    }
  },
  { 
    id: 'business', 
    label: 'Business', 
    image: businessImage,
    category: '출장',
    keywords: ['회의', '컨퍼런스', '미팅', '체류 기간(짧음)', '영수증'],
    tip: {
      title: '입국 심사 핵심 Tip',
      content: "비즈니스 방문객은 '현지 취업(돈을 버는 행위)'이 아니라 '업무 협의/참석'임을 명확히 해야 합니다.",
      highlights: ['업무 협의/참석']
    },
    immigration: {
      purpose: [
        { en: "I'm here to attend a business conference.", ko: '비즈니스 컨퍼런스에 참석하러 왔습니다.' },
        { en: "I have meetings with our branch office partners.", ko: '지사 파트너들과 미팅이 있습니다.' },
        { en: "I'm here for a market research trip.", ko: '시장 조사차 왔습니다.' }
      ],
      duration: [
        { en: "Just for the duration of the conference, which is 4 days.", ko: '컨퍼런스 기간인 4일 동안만 머뭅니다.' }
      ],
      customs: [
        { en: "These are just samples for the exhibition, not for sale.", ko: '이것들은 전시용 샘플이고, 판매용이 아닙니다.' }
      ]
    },
    local: {
      wifi: [
        { en: "Is there a secure Wi-Fi connection available here?", ko: '여기 보안된 와이파이를 쓸 수 있나요?' }
      ],
      receipt: [
        { en: "Could I have a receipt for company reimbursement?", ko: '회사 청구용 영수증을 받을 수 있을까요?' }
      ],
      businessCard: [
        { en: "Here is my business card. It's a pleasure to meet you.", ko: '여기 제 명함입니다. 만나서 반갑습니다.' }
      ]
    }
  },
]

// 카테고리별 콘텐츠 컴포넌트
const CategoryContent = ({ category }) => {
  const PhraseItem = ({ phrase }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const handleSpeak = () => {
      if ('speechSynthesis' in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel()
          setIsPlaying(false)
        } else {
          const utterance = new SpeechSynthesisUtterance(phrase.en)
          utterance.lang = 'en-US'
          utterance.rate = 0.9
          utterance.onend = () => setIsPlaying(false)
          utterance.onerror = () => setIsPlaying(false)
          window.speechSynthesis.speak(utterance)
          setIsPlaying(true)
        }
      }
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(phrase.en)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('복사 실패:', err)
      }
    }

    return (
      <div className="english-practice-phrase-item">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="english-practice-phrase-en">{phrase.en}</div>
            <div className="english-practice-phrase-ko">{phrase.ko}</div>
            {phrase.vocab && (
              <div className="english-practice-phrase-vocab">{phrase.vocab}</div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
            <button
              onClick={handleSpeak}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
              title="듣기"
              aria-label="듣기"
            >
              <IconVolume className={`w-4 h-4 ${isPlaying ? 'text-blue-600' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
              title="복사"
              aria-label="복사"
            >
              <IconCopy className={`w-4 h-4 ${isCopied ? 'text-blue-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="english-practice-content">
      {/* 상단: 아이콘, 제목, 부제목, 키워드 */}
      <div className="english-practice-section">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <IconPlane className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{category.label}</h2>
            <p className="text-sm text-gray-500">
              {category.id === 'tourism' && '관광객을 위한 필수 표현'}
              {category.id === 'study' && '유학생을 위한 필수 표현'}
              {category.id === 'business' && '출장객을 위한 필수 표현'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {category.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="text-blue-600 text-sm font-medium"
            >
              #{keyword}
            </span>
          ))}
        </div>

        {/* Tip 박스 */}
        <div className="english-practice-info-box">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <IconBulb className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{category.tip.title}</h3>
              <p className="english-practice-info-text">
                {category.tip.content.split(category.tip.highlights[0])[0]}
                <span className="text-blue-600 font-semibold">{category.tip.highlights[0]}</span>
                {category.tip.highlights[1] && (
                  <>
                    {category.tip.content.split(category.tip.highlights[0])[1]?.split(category.tip.highlights[1])[0]}
                    <span className="text-blue-600 font-semibold">{category.tip.highlights[1]}</span>
                    {category.tip.content.split(category.tip.highlights[1])[1]}
                  </>
                )}
                {!category.tip.highlights[1] && category.tip.content.split(category.tip.highlights[0])[1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 입국 심사 섹션 */}
      <div className="english-practice-section">
        <h3 className="english-practice-section-title">
          <IconMapPin className="w-6 h-6 text-blue-600" />
          입국 심사 (Immigration)
        </h3>
        
        {category.immigration.purpose && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">방문 목적 (PURPOSE)</h4>
            {category.immigration.purpose.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.duration && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">체류 기간 (DURATION)</h4>
            {category.immigration.duration.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.accommodation && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">숙소 (ACCOMMODATION)</h4>
            {category.immigration.accommodation.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.return && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">귀국 (RETURN)</h4>
            {category.immigration.return.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.documents && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">서류 제출 (DOCUMENTS)</h4>
            {category.immigration.documents.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.finance && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">재정 증명 (FINANCE)</h4>
            {category.immigration.finance.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.immigration.customs && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">세관 (CUSTOMS)</h4>
            {category.immigration.customs.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}
      </div>

      {/* 현지 필수 섹션 */}
      <div className="english-practice-section">
        <h3 className="english-practice-section-title">
          <IconMapPin className="w-6 h-6 text-blue-600" />
          현지 필수 (Local Survival)
        </h3>
        
        {category.local.directions && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">길 물어보기</h4>
            {category.local.directions.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.photo && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">사진 요청</h4>
            {category.local.photo.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.recommendations && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">추천 요청</h4>
            {category.local.recommendations.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.registration && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">수강 신청</h4>
            {category.local.registration.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.dorm && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">기숙사</h4>
            {category.local.dorm.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.bank && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">계좌 개설</h4>
            {category.local.bank.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.wifi && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">와이파이</h4>
            {category.local.wifi.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.receipt && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">영수증 (중요)</h4>
            {category.local.receipt.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}

        {category.local.businessCard && (
          <div className="english-practice-subsection">
            <h4 className="english-practice-subsection-title">인사</h4>
            {category.local.businessCard.map((phrase, idx) => (
              <PhraseItem key={idx} phrase={phrase} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EnglishPractice() {
  // 카테고리 데이터를 Carousel 형식으로 변환
  const carouselItems = CATEGORIES.map((category) => ({
    title: category.label,
    category: category.category,
    content: <CategoryContent category={category} />,
    src: category.image
  }))

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      <div className="w-full max-w-7xl px-4">
        <Carousel items={carouselItems.map((item, index) => (
          <Card key={index} card={item} index={index} />
        ))} />
      </div>
    </div>
  )
}

