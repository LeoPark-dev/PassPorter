import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IconMicrophone, IconMicrophoneOff, IconX, IconChevronDown } from '@tabler/icons-react'
import { WavyBackground } from '@/components/ui/wavy-background'
import './AIPractice.css'

export default function AIPractice() {
  const [isStarted, setIsStarted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversation, setConversation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [audioData, setAudioData] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [aiRole, setAiRole] = useState('teacher') // 'teacher' or 'officer'
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const chatInputRef = useRef(null)
  const roleDropdownRef = useRef(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
      }
    }

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showRoleDropdown])

  // 음성 인식 시작/중지 함수
  const startVoiceRecognition = () => {
    if (isListening) {
      // 이미 듣고 있으면 중지
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = async (event) => {
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }

        if (finalTranscript) {
          await handleUserMessage(finalTranscript.trim(), true) // 음성 입력으로 표시
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } else {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.')
    }
  }

  // 오디오 분석기 설정 (음성 인식 중일 때만)
  useEffect(() => {
    if (!isListening) {
      setAudioData(null)
      return
    }

    const setupAudioAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(stream)
        
        analyser.fftSize = 256
        source.connect(analyser)
        
        audioContextRef.current = audioContext
        analyserRef.current = analyser

        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        
        const updateAudioData = () => {
          if (analyserRef.current && isListening) {
            analyserRef.current.getByteFrequencyData(dataArray)
            setAudioData([...dataArray])
            animationFrameRef.current = requestAnimationFrame(updateAudioData)
          } else {
            setAudioData(null)
          }
        }
        
        updateAudioData()
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }

    setupAudioAnalysis()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isListening])

  const handleUserMessage = async (message, isVoiceInput = false) => {
    if (!message.trim()) return

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setConversation(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        alert('Gemini API 키가 설정되지 않았습니다.\n\n.env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.\n\n설정 후 개발 서버를 재시작해야 합니다.')
        setIsLoading(false)
        return
      }

      // API 키 형식 확인
      if (!apiKey.startsWith('AIza')) {
        console.warn('API 키 형식이 예상과 다릅니다. 일반적으로 "AIza"로 시작합니다.')
      }

      console.log('API 키 확인:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4))

      // AI 모델 사용
      const model = 'gemini-2.0-flash'
      let aiResponse = null
      let lastError = null

      // 선택된 역할에 따른 프롬프트 설정
      const rolePrompts = {
        teacher: `You are a friendly English teacher helping travelers learn English expressions for travel situations. 
        - Help the user practice English phrases naturally
        - Provide corrections and suggestions when needed
        - Keep responses encouraging and educational
        - Respond in English, but you can explain in simple terms if needed
        User said: ${message}`,
        officer: `You are an immigration officer conducting an entry interview at an airport.
        - Ask relevant questions about the traveler's purpose of visit, duration, accommodation, etc.
        - Be professional but friendly
        - Respond naturally as if you're having a real conversation
        - Keep responses concise and realistic
        User said: ${message}`
      }

      const prompt = rolePrompts[aiRole] || rolePrompts.teacher

      // v1과 v1beta 둘 다 시도
      const apiVersions = ['v1beta', 'v1']

      for (const version of apiVersions) {
        try {
          const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`
          console.log(`AI 모델 시도: ${version}/${model}`)
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not process that.'
            console.log(`성공: ${version}/${model}`)
            break
          } else {
            let errorText = ''
            try {
              const errorData = await response.json()
              errorText = JSON.stringify(errorData, null, 2)
              lastError = { version, model, status: response.status, error: errorData }
              console.error(`${version}/${model} 실패 (${response.status}):`, errorText.substring(0, 200))
            } catch (e) {
              errorText = await response.text()
              lastError = { version, model, status: response.status, error: errorText }
              console.error(`${version}/${model} 실패 (${response.status}):`, errorText.substring(0, 200))
            }
          }
        } catch (err) {
          lastError = { version, model, error: err.message }
          console.error(`${version}/${model} 네트워크 오류:`, err)
        }
      }
      
      if (!aiResponse) {
        const errorMsg = lastError?.error?.message || 
                        (typeof lastError?.error === 'string' ? lastError.error : JSON.stringify(lastError?.error)) ||
                        '음성 대화 모델 호출 실패'
        console.error('모든 API 버전 실패. 마지막 오류:', lastError)
        throw new Error(`Gemini API 호출 실패: ${errorMsg}`)
      }

      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, aiMessage])
      
      // 음성 입력인 경우에만 AI 응답을 음성으로 재생
      if (isVoiceInput) {
        speakText(aiResponse)
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setConversation(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      
      // SpeechSynthesis는 직접 오디오 스트림을 제공하지 않으므로
      // 대신 시뮬레이션된 파형 데이터 생성
      const simulateAudioWave = () => {
        const dataArray = new Uint8Array(128) // 128개 주파수 밴드
        let frame = 0
        const startTime = Date.now()
        
        const animate = () => {
          if (window.speechSynthesis.speaking) {
            const elapsed = (Date.now() - startTime) / 1000 // 초 단위
            
            // 텍스트 길이에 따른 파형 시뮬레이션
            const textLength = text.length
            const baseFrequency = 2 + (textLength % 5) // 2-6 범위
            
            for (let i = 0; i < dataArray.length; i++) {
              const frequency = i * 0.5
              // 여러 주파수 성분을 결합하여 더 자연스러운 파형 생성
              const wave1 = Math.sin((elapsed * baseFrequency + frequency) * 2) * 50
              const wave2 = Math.sin((elapsed * baseFrequency * 2 + frequency) * 3) * 30
              const wave3 = Math.sin((elapsed * baseFrequency * 3 + frequency) * 4) * 20
              const amplitude = wave1 + wave2 + wave3 + 128
              dataArray[i] = Math.max(0, Math.min(255, amplitude))
            }
            
            setAudioData([...dataArray])
            frame++
            requestAnimationFrame(animate)
          } else {
            setAudioData(null)
          }
        }
        
        animate()
      }
      
      utterance.onstart = simulateAudioWave
      utterance.onend = () => {
        setAudioData(null)
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleStop = () => {
    setIsStarted(false)
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }
    setAudioData(null)
    setChatInput('')
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    
    const message = chatInput.trim()
    setChatInput('')
    await handleUserMessage(message, false) // 텍스트 입력으로 표시 (음성 출력 안 함)
  }

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSubmit(e)
    }
  }

  return (
    <div className="ai-practice-container">
      <WavyBackground
        className="w-full h-full"
        containerClassName="w-full h-full"
        colors={['#1976d2', '#42a5f5', '#90caf9', '#bbdefb', '#e3f2fd']}
        waveWidth={50}
        backgroundFill="transparent"
        blur={10}
        speed="fast"
        waveOpacity={0.5}
        audioData={audioData}
      />
      
      <div className="ai-practice-content">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="ai-start-screen"
            >
              <h1 className="ai-title">Talk with AI assistant</h1>
              <button
                onClick={handleStart}
                className="ai-start-button"
              >
                Get Started
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="ai-conversation-screen"
            >
              <div className="ai-conversation-header">
                <h2 className="ai-conversation-title">
                  {aiRole === 'teacher' ? 'AI 여행 영어 표현 학습' : 'AI와 대화하면서 입국 심사 연습하기'}
                </h2>
                <button
                  onClick={handleStop}
                  className="ai-stop-button"
                  title="Stop Conversation"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="ai-conversation-messages">
                {conversation.length === 0 ? (
                  <div className="ai-empty-state">
                    <p className="ai-empty-text">Start speaking to begin the conversation...</p>
                  </div>
                ) : (
                  conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}
                    >
                      <div className="ai-message-content">{msg.content}</div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="ai-message ai-message-assistant">
                    <div className="ai-message-content ai-loading">
                      <span className="ai-loading-dot"></span>
                      <span className="ai-loading-dot"></span>
                      <span className="ai-loading-dot"></span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ai-chat-input-container">
                <form onSubmit={handleChatSubmit} className="ai-chat-form">
                  <div className="ai-role-selector-wrapper" ref={roleDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="ai-role-selector-button"
                      title="Select AI role"
                    >
                      <span className="ai-role-selector-text">
                        {aiRole === 'teacher' ? '영어 선생님' : '입국 심사관'}
                      </span>
                      <IconChevronDown className={`ai-role-chevron ${showRoleDropdown ? 'ai-role-chevron-open' : ''}`} />
                    </button>
                    {showRoleDropdown && (
                      <div className="ai-role-dropdown">
                        <button
                          type="button"
                          onClick={() => {
                            setAiRole('teacher')
                            setShowRoleDropdown(false)
                            setConversation([]) // 역할 변경 시 대화 초기화
                          }}
                          className={`ai-role-option ${aiRole === 'teacher' ? 'ai-role-option-active' : ''}`}
                        >
                          영어 선생님
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAiRole('officer')
                            setShowRoleDropdown(false)
                            setConversation([]) // 역할 변경 시 대화 초기화
                          }}
                          className={`ai-role-option ${aiRole === 'officer' ? 'ai-role-option-active' : ''}`}
                        >
                          입국 심사관
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    placeholder={aiRole === 'teacher' ? 'Ask about English expressions...' : 'Answer the officer\'s questions...'}
                    className="ai-chat-input"
                  />
                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    className={`ai-microphone-button ${isListening ? 'ai-microphone-active' : ''}`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? (
                      <IconMicrophone className="w-5 h-5" />
                    ) : (
                      <IconMicrophoneOff className="w-5 h-5" />
                    )}
                  </button>
                </form>
                {isListening && (
                  <div className="ai-listening-indicator-small">
                    <span>Listening...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

