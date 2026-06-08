import styled from 'styled-components';

const ACCENT = '#3ec9a7';

const STEPS = [
  { num: 1, label: '기본정보' },
  { num: 2, label: '사진' },
  { num: 3, label: '편의시설' },
];

/**
 * 3단계 진행 표시 스테퍼
 * @param {1|2|3} currentStep
 */
export default function SpaceFormStepper({ currentStep }) {
  return (
    <Wrap>
      {STEPS.map((step, idx) => {
        const isDone = currentStep > step.num;
        const isActive = currentStep === step.num;
        return (
          <StepGroup key={step.num}>
            <StepItem>
              <StepCircle $done={isDone} $active={isActive}>
                {isDone ? '✓' : step.num}
              </StepCircle>
              <StepLabel $active={isActive} $done={isDone}>
                {step.label}
              </StepLabel>
            </StepItem>
            {idx < STEPS.length - 1 && (
              <Connector $filled={currentStep > step.num} />
            )}
          </StepGroup>
        );
      })}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px 0 32px;
`;

const StepGroup = styled.div`
  display: flex;
  align-items: center;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.2s, border-color 0.2s;
  background: ${({ $done, $active }) =>
    $done ? ACCENT : $active ? ACCENT : '#e2e8f0'};
  color: ${({ $done, $active }) => ($done || $active ? 'white' : '#94a3b8')};
  border: 2px solid ${({ $done, $active }) =>
    $done ? ACCENT : $active ? ACCENT : '#e2e8f0'};
`;

const StepLabel = styled.span`
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, $done }) =>
    $active || $done ? '#0d9488' : '#94a3b8'};
  white-space: nowrap;
`;

const Connector = styled.div`
  width: 80px;
  height: 2px;
  background: ${({ $filled }) => ($filled ? ACCENT : '#e2e8f0')};
  margin: 0 4px;
  margin-bottom: 22px;
  transition: background 0.2s;
`;
