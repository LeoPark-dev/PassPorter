import './DocumentPractice.css'
import customsFormImage from '../../assets/세관신고서.jpeg'

export default function DocumentPracticeLeft() {
  return (
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
  )
}

