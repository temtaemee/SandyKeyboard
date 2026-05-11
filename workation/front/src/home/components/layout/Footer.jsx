import styled from 'styled-components';
import { FOOTER_LINKS } from '../../data/homeData';

export default function Footer() {
  return (
    <FooterWrapper>
      <Inner>
        <Top>
          {/* 브랜드 */}
          <Brand>
            <LogoText>모래묻은 키보드</LogoText>
            <Tagline>
              일하는 장소가 일하는 방식만큼이나 중요하다고 믿는
              현대 전문가들을 위해 디자인되었습니다.
            </Tagline>
            <SocialRow>
              <SocialBtn aria-label="트위터">
                <TwitterIcon />
              </SocialBtn>
              <SocialBtn aria-label="인스타그램">
                <InstagramIcon />
              </SocialBtn>
            </SocialRow>
          </Brand>

          {/* 링크 그룹 */}
          <LinkGrid>
            {Object.entries(FOOTER_LINKS).map(([category, items]) => (
              <LinkCol key={category}>
                <ColTitle>{category}</ColTitle>
                {items.map((item) => (
                  <ColLink key={item} href="#">{item}</ColLink>
                ))}
              </LinkCol>
            ))}
          </LinkGrid>
        </Top>

        <Bottom>
          <CopyText>© 2024 모래묻은 키보드. Effortlessly Productive.</CopyText>
        </Bottom>
      </Inner>
    </FooterWrapper>
  );
}

/* ── Icons ── */
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#475569">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ── Styled Components ── */

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.bgSection};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 96px 32px 32px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 64px;
`;

const Brand = styled.div`
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogoText = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
`;

const Tagline = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 8px;
`;

const SocialBtn = styled.button`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  line-height: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.accentBlue};
    transform: translateY(-2px);
  }
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 64px;
`;

const LinkCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ColTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

const ColLink = styled.a`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Bottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 33px;
  padding-bottom: 32px;
`;

const CopyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;
