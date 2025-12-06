import { useState, useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'
import RotatingText from '../../components/RotatingText/RotatingText.jsx'

export default function PassRotatingText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [textWidths, setTextWidths] = useState({})
  const passRef = useRef(null)
  const measureRef = useRef(null)
  const rotatingTexts = ['Easily', 'Quickly', 'Perfectly']
  const rotationInterval = 2000

  // 각 텍스트의 너비를 측정
  useEffect(() => {
    if (!measureRef.current) return

    const spans = measureRef.current.querySelectorAll('span')
    const widths = {}
    spans.forEach((span, index) => {
      widths[rotatingTexts[index]] = span.offsetWidth
    })
    setTextWidths(widths)
  }, [])

  // RotatingText의 텍스트 변경을 추적하는 콜백
  const handleTextChange = (newIndex) => {
    setCurrentTextIndex(newIndex)
  }

  // Spring 애니메이션을 위한 x 위치
  const currentText = rotatingTexts[currentTextIndex]
  const currentWidth = textWidths[currentText] || 0
  const maxWidth = Math.max(...Object.values(textWidths), 0)

  const x = useSpring(0, {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  })

  // 텍스트가 변경될 때 x 위치 업데이트 (RotatingText와 동기화)
  useEffect(() => {
    if (maxWidth > 0 && currentWidth > 0) {
      // 각 단어의 길이 차이에 따라 Pass를 조정
      // 단어가 짧을수록 Pass는 오른쪽으로, 길수록 왼쪽으로
      const offset = (maxWidth - currentWidth) / 2
      x.set(-offset)
    }
  }, [currentTextIndex, currentWidth, maxWidth, x])

  return (
    <div className="pass-rotating-text-container">
      <div ref={measureRef} className="measure-container">
        {rotatingTexts.map((text) => (
          <span key={text} className="rotating-text-measure">{text}</span>
        ))}
      </div>
      <motion.span
        ref={passRef}
        className="pass-text"
        style={{
          x: x,
        }}
      >
        Pass
      </motion.span>
      <div className="rotating-text-part">
        <RotatingText
          texts={rotatingTexts}
          mainClassName="text-black overflow-hidden"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={rotationInterval}
          onNext={handleTextChange}
        />
      </div>
    </div>
  )
}

