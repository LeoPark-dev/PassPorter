/** @jsxRuntime automatic */
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Mic, Check, ArrowRight, Plane, ShieldCheck, Award } from 'lucide-react';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const stampAnim = keyframes`
  0% { opacity: 0; transform: scale(3) rotate(-20deg); }
  50% { opacity: 1; transform: scale(0.8) rotate(-20deg); }
  70% { transform: scale(1.1) rotate(-20deg); }
  100% { transform: scale(1) rotate(-20deg); }
`;

// --- Styled Components ---
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top left, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const GlassCard = styled.div`
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  width: ${props => props.width}%;
  transition: width 0.5s ease;
`;

const QuestionType = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 20px;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionButton = styled.button`
  padding: 16px 20px;
  background: white;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#f1f5f9'};
  border-radius: 16px;
  text-align: left;
  font-size: 1rem;
  color: ${props => props.selected ? '#3b82f6' : '#475569'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f8fafc;
    border-color: ${props => props.selected ? '#3b82f6' : '#cbd5e1'};
    transform: translateY(-2px);
  }
`;

// Speaking Mode Specific
const MicButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
  animation: ${props => props.isListening ? pulse : 'none'} 2s infinite;
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    animation: none;
  }
`;

const RecordingStatus = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.9rem;
`;

// Result Page
const ResultContainer = styled.div`
  text-align: center;
`;

const Stamp = styled.div`
  width: 120px;
  height: 120px;
  border: 4px solid ${props => props.color};
  border-radius: 50%;
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-weight: 900;
  text-transform: uppercase;
  animation: ${stampAnim} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
`;

const LevelTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

const LevelDesc = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  padding: 14px 32px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// --- Main Component ---
const CEFRTest = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Mock Questions
  const questions = [
    {
      type: "Reading (어휘)",
      question: "공항에서 '수하물 찾는 곳'을 의미하는 단어는?",
      options: ["Check-in Counter", "Baggage Claim", "Departure Gate", "Security Check"],
      answer: 1
    },
    {
      type: "Reading (문맥)",
      question: "빈칸에 알맞은 말은? 'Do you have anything to ______?'",
      options: ["declare", "say", "buy", "fly"],
      answer: 0
    },
    {
      type: "Listening (리스닝 시뮬레이션)",
      question: "심사관이 'How long will you be staying?'이라고 물었습니다. 알맞은 대답은?",
      options: ["I'm staying at a hotel.", "For 5 days.", "Yes, I have a ticket.", "I am a tourist."],
      answer: 1
    },
    {
      type: "Speaking (말하기)",
      question: "방문 목적을 한 문장으로 말해보세요.",
      isSpeaking: true
    }
  ];

  const handleOptionClick = (index) => {
    if (index === questions[currentStep].answer) {
      setScore(score + 1);
    }
    nextStep();
  };

  const handleMicClick = () => {
    setIsListening(true);
    // 시뮬레이션: 3초 후 자동 녹음 종료 및 다음 단계
    setTimeout(() => {
      setIsListening(false);
      setScore(score + 1); // 말하기는 무조건 통과 처리 (예시)
      nextStep();
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  // 결과 계산
  const getLevel = () => {
    if (score === 4) return { level: "B2", title: "Smart Explorer", color: "#2563eb", desc: "혼자서도 문제없이 여행하고, 돌발 상황에도 대처할 수 있는 수준입니다!" };
    if (score >= 2) return { level: "A2", title: "Survival Traveler", color: "#16a34a", desc: "기본적인 의사소통은 가능하지만, 복잡한 상황에서는 도움이 필요할 수 있습니다." };
    return { level: "A1", title: "Beginner", color: "#ca8a04", desc: "이제 막 여행 준비를 시작하셨군요! 기초부터 차근차근 다져봐요." };
  };

  if (showResult) {
    const result = getLevel();
    return (
      <Container>
        <GlassCard style={{ textAlign: 'center' }}>
          <Stamp color={result.color}>
            <div style={{ fontSize: '14px' }}>PASSED</div>
            <div style={{ fontSize: '32px' }}>{result.level}</div>
          </Stamp>
          <LevelTitle>{result.title}</LevelTitle>
          <LevelDesc>{result.desc}</LevelDesc>
          <ActionButton onClick={() => {
            if (onClose) onClose();
            alert("맞춤형 커리큘럼으로 이동합니다.");
          }}>
            맞춤 학습 시작하기 <ArrowRight size={18} />
          </ActionButton>
        </GlassCard>
      </Container>
    );
  }

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Container>
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>
          <span>Question {currentStep + 1} of {questions.length}</span>
          <Plane size={16} />
        </div>
        
        <ProgressBarContainer>
          <ProgressBarFill width={progress} />
        </ProgressBarContainer>

        <QuestionType>{currentQ.type}</QuestionType>
        <QuestionText>{currentQ.question}</QuestionText>

        {currentQ.isSpeaking ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <MicButton onClick={handleMicClick} isListening={isListening} disabled={isListening}>
              <Mic size={32} />
            </MicButton>
            <RecordingStatus>
              {isListening ? "듣고 있습니다... (말씀해주세요)" : "버튼을 누르고 답변하세요"}
            </RecordingStatus>
          </div>
        ) : (
          <OptionsGrid>
            {currentQ.options.map((option, index) => (
              <OptionButton key={index} onClick={() => handleOptionClick(index)}>
                {option}
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />
              </OptionButton>
            ))}
          </OptionsGrid>
        )}
      </GlassCard>
    </Container>
  );
};

export default CEFRTest;

