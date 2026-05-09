import { useState } from 'react';
import styled from 'styled-components';

const faqList = [
  {
    question: '예약은 어떻게 하나요?',
    answer: '숙소 선택 후 예약 가능합니다.',
  },
  {
    question: '환불은 가능한가요?',
    answer: '정책에 따라 환불됩니다.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Wrapper>
      {faqList.map((item, index) => (
        <Item key={index}>
          <Question
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            Q. {item.question}
          </Question>

          {openIndex === index && <Answer>A. {item.answer}</Answer>}
        </Item>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Item = styled.div`
  border-bottom: 1px solid #e5e7eb;
`;

const Question = styled.div`
  padding: 24px 10px;
  font-weight: 600;
  cursor: pointer;
`;

const Answer = styled.div`
  padding: 0 10px 24px;
  color: #666;
  line-height: 1.6;
`;
