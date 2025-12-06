export const ENTRY_REQUIREMENTS = {
  '미국': {
    country: '미국 (United States)',
    categories: {
      visa: {
        title: '비자 정보',
        content: {
          basic: '한국인은 관광 목적 90일 이내 체류 시 비자 면제 (ESTA 필요)',
          esta: {
            required: true,
            description: 'ESTA (Electronic System for Travel Authorization) 신청 필요',
            validity: '2년간 유효',
            fee: 'USD $21',
            processingTime: '보통 즉시 승인 (최대 72시간)',
            website: 'https://esta.cbp.dhs.gov'
          },
          visa: {
            required: '90일 이상 체류 또는 비자 면제 대상이 아닌 경우',
            types: [
              'B-1/B-2 비자 (관광/비즈니스)',
              'F-1 비자 (학생)',
              'J-1 비자 (교환 방문자)',
              'H-1B 비자 (전문직)'
            ],
            processingTime: '약 2-4주',
            fee: 'USD $185'
          }
        }
      },
      passport: {
        title: '여권 요건',
        content: {
          validity: '여권 유효기간이 체류 기간 + 6개월 이상 남아있어야 함',
          blankPages: '여권에 빈 페이지 1면 이상 필요',
          machineReadable: '기계 판독 가능한 여권 필요'
        }
      },
      documents: {
        title: '필요 서류',
        content: {
          required: [
            '유효한 여권',
            'ESTA 승인 (비자 면제 프로그램 이용 시)',
            '왕복 항공권 또는 다음 목적지 항공권',
            '숙박 예약 확인서',
            '여행 경비 증명 (은행 잔고 증명서 등)',
            '귀국 의사 증명 (직장 재직증명서, 재학증명서 등)'
          ],
          recommended: [
            '여행 보험 증서',
            '신용카드',
            '여행 일정표'
          ]
        }
      },
      health: {
        title: '백신 요구사항',
        content: {
          covid19: 'COVID-19 백신 접종 증명서 불필요 (2023년 5월부터)',
          other: '특별한 건강 검진 불필요',
          yellowFever: '황열병 예방접종 불필요'
        }
      },
      customs: {
        title: '통과 허가 및 세관 규정',
        content: {
          declaration: 'USD $10,000 이상 현금 반입 시 신고 의무',
          prohibited: [
            '신선한 과일 및 채소',
            '육류 제품',
            '마약류',
            '무기류',
            '위조 상품'
          ],
          restricted: [
            '알코올: 1리터 이하',
            '담배: 200개비 이하',
            '선물: USD $100 이하'
          ]
        }
      },
      tips: {
        title: '유용한 팁',
        content: {
          items: [
            'ESTA는 출발 72시간 전까지 신청 권장',
            '비자 면제 프로그램은 90일 이내 단기 체류만 가능',
            '장기 체류나 취업 목적은 반드시 비자 필요',
            '입국 시 이민국 직원의 질문에 정직하게 답변',
            '여행 목적과 일치하는 서류 준비 필수',
            'ESTA 승인 후에도 입국 거부 가능성 있음',
            '비자 없이 입국 시 취업 금지'
          ]
        }
      },
      embassy: {
        title: '대사관 정보',
        content: {
          seoul: '서울특별시 종로구 세종대로 188',
          phone: '02-397-4114',
          website: 'https://kr.usembassy.gov',
          hours: '월-금 09:00-17:00'
        }
      }
    }
  }
}

