import { useState } from "react";
import styled from "styled-components";

export default function HeroSection() {
  const [search, setSearch] = useState({ location: "", date: "", people: "" });

  const handleChange = (field) => (e) =>
    setSearch((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 검색 API 연동
    console.log("검색 조건:", search);
  };

  return (
    <Section>
      <Overlay />
      <Container>
        <Title>일하면서 즐기는 완벽한 휴식, 워케이션</Title>
        <Subtitle>
          답답한 사무실을 벗어나 영감을 주는 곳에서 당신의 업무 효율을
          높여보세요.
        </Subtitle>

        <SearchBar>
          <SearchForm onSubmit={handleSubmit}>
            <SearchField>
              <FieldLabel>위치</FieldLabel>
              <FieldInput
                type="text"
                placeholder="어디로 떠나시나요?"
                value={search.location}
                onChange={handleChange("location")}
              />
            </SearchField>

            <SearchField>
              <FieldLabel>일정</FieldLabel>
              <FieldInput
                type="text"
                placeholder="날짜 추가"
                value={search.date}
                onChange={handleChange("date")}
              />
            </SearchField>

            <SearchField $noBorder>
              <FieldLabel>인원</FieldLabel>
              <FieldInput
                type="text"
                placeholder="몇 명인가요?"
                value={search.people}
                onChange={handleChange("people")}
              />
            </SearchField>

            <SearchBtn type="submit">
              <SearchIcon />
              검색
            </SearchBtn>
          </SearchForm>
        </SearchBar>
      </Container>
    </Section>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ── Styled Components ── */

const Section = styled.section`
  height: 870px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.gradients.hero};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  width: 100%;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 500;
  color: white;
  text-align: center;
  text-shadow:
    0 4px 1.5px rgba(0, 0, 0, 0.1),
    0 10px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  line-height: 1.5;
  animation: fadeUp 0.7s ease both;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: white;
  text-align: center;
  text-shadow:
    0 2px 1px rgba(0, 0, 0, 0.06),
    0 4px 1.5px rgba(0, 0, 0, 0.07);
  margin-bottom: 48px;
  animation: fadeUp 0.7s 0.15s ease both;
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 896px;
  padding: 6px;
  background: ${({ theme }) => theme.gradients.hero};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadows.searchBar};
  animation: fadeUp 0.7s 0.3s ease both;
`;

const SearchForm = styled.form`
  background: white;
  border-radius: 28px;
  display: flex;
  align-items: center;
  padding: 16px;
`;

const SearchField = styled.div`
  flex: 1;
  padding: 0 24px;
  border-right: ${({ $noBorder, theme }) =>
    $noBorder ? "none" : `1px solid ${theme.colors.borderLight}`};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FieldInput = styled.input`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.base};
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  outline: none;
  background: none;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 16px;
  font-weight: 500;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    background 0.2s,
    transform 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-1px);
  }
`;
