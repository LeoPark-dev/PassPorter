import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ENTRY_REQUIREMENTS } from '../data/entryRequirements'
import './EntryRequirementsDashboard.css'

function EntryRequirementsDashboard({ country, onClose }) {
  if (!country || !ENTRY_REQUIREMENTS[country]) {
    return null
  }

  const requirements = ENTRY_REQUIREMENTS[country]
  const categories = Object.keys(requirements.categories)
  
  // 첫 번째 카테고리를 기본 선택
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || null)

  const currentCategory = selectedCategory ? requirements.categories[selectedCategory] : null

  const renderContent = () => {
    if (!currentCategory) return null

    const { title, content } = currentCategory

    return (
      <div className="dashboard-content">
        <h2 className="dashboard-content-title">{title}</h2>
        <div className="dashboard-content-body">
          {selectedCategory === 'visa' && (
            <div className="content-section">
              <div className="info-box">
                <p className="info-text">{content.basic}</p>
              </div>
              
              {content.esta && (
                <div className="subsection">
                  <h3 className="subsection-title">ESTA (비자 면제 프로그램)</h3>
                  <ul className="info-list">
                    <li><strong>필수 여부:</strong> {content.esta.required ? '필수' : '선택'}</li>
                    <li><strong>유효기간:</strong> {content.esta.validity}</li>
                    <li><strong>수수료:</strong> {content.esta.fee}</li>
                    <li><strong>처리 시간:</strong> {content.esta.processingTime}</li>
                    <li>
                      <strong>신청 사이트:</strong>{' '}
                      <a 
                        href={content.esta.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link"
                      >
                        {content.esta.website}
                      </a>
                    </li>
                  </ul>
                </div>
              )}

              {content.visa && (
                <div className="subsection">
                  <h3 className="subsection-title">비자 신청</h3>
                  <p className="info-text mb-3">{content.visa.required}</p>
                  <p className="info-text mb-2"><strong>비자 종류:</strong></p>
                  <ul className="info-list">
                    {content.visa.types.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                  <p className="info-text mt-3">
                    <strong>처리 시간:</strong> {content.visa.processingTime} | 
                    <strong> 수수료:</strong> {content.visa.fee}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'passport' && (
            <div className="content-section">
              <ul className="info-list">
                <li>{content.validity}</li>
                <li>{content.blankPages}</li>
                {content.machineReadable && <li>{content.machineReadable}</li>}
              </ul>
            </div>
          )}

          {selectedCategory === 'documents' && (
            <div className="content-section">
              <div className="subsection">
                <h3 className="subsection-title">필수 서류</h3>
                <ul className="info-list">
                  {content.required.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
              {content.recommended && (
                <div className="subsection">
                  <h3 className="subsection-title">권장 서류</h3>
                  <ul className="info-list">
                    {content.recommended.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'health' && (
            <div className="content-section">
              <ul className="info-list">
                <li>{content.covid19}</li>
                <li>{content.other}</li>
                {content.yellowFever && <li>{content.yellowFever}</li>}
              </ul>
            </div>
          )}

          {selectedCategory === 'customs' && (
            <div className="content-section">
              <p className="info-text mb-4">{content.declaration}</p>
              
              <div className="subsection">
                <h3 className="subsection-title">금지 품목</h3>
                <ul className="info-list">
                  {content.prohibited.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {content.restricted && (
                <div className="subsection">
                  <h3 className="subsection-title">제한 품목</h3>
                  <ul className="info-list">
                    {content.restricted.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'tips' && (
            <div className="content-section">
              <ul className="info-list">
                {content.items.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedCategory === 'embassy' && (
            <div className="content-section">
              <div className="info-box">
                <p className="info-text"><strong>주소:</strong> {content.seoul}</p>
                <p className="info-text"><strong>전화:</strong> {content.phone}</p>
                <p className="info-text">
                  <strong>웹사이트:</strong>{' '}
                  <a 
                    href={content.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="link"
                  >
                    {content.website}
                  </a>
                </p>
                {content.hours && (
                  <p className="info-text"><strong>운영 시간:</strong> {content.hours}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-container"
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">{requirements.country} 입국 요건</h1>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            {categories.map((categoryKey) => {
              const category = requirements.categories[categoryKey]
              return (
                <button
                  key={categoryKey}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={`dashboard-nav-item ${
                    selectedCategory === categoryKey ? 'active' : ''
                  }`}
                >
                  {category.title}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="dashboard-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default EntryRequirementsDashboard

