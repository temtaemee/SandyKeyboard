import styled, { css } from 'styled-components';
import { COLLECTIONS } from '../../data/homeData';
import useReveal from '../../hooks/useReveal';

export default function BentoSection() {
  const { ref, visible } = useReveal();

  return (
    <Wrap ref={ref} $visible={visible}>
      <SectionLabel>큐레이션 컬렉션</SectionLabel>
      <Grid>
        {COLLECTIONS.map((item) => (
          <Item key={item.id} $size={item.size}>
            <ItemImg src={item.image} alt={item.title} />
            {item.desc ? (
              <Overlay>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDesc>{item.desc}</ItemDesc>
              </Overlay>
            ) : (
              <OverlayCenter>
                <CenterTitle>{item.title}</CenterTitle>
              </OverlayCenter>
            )}
          </Item>
        ))}
      </Grid>
    </Wrap>
  );
}

/* ── Styled Components ── */

const Wrap = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: opacity 0.6s ease, transform 0.6s ease;
`;

const SectionLabel = styled.p`
  font-size: 16px;
  color: #3d646c;
  font-weight: 500;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: 600px;
`;

const ITEM_SIZES = {
  large: css`
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  `,
  wide: css`
    grid-column: 3 / span 2;
    grid-row: 1;
  `,
  small: css`
    /* nth-child로 위치 제어 */
  `,
};

const Item = styled.div`
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
  ${({ $size }) => ITEM_SIZES[$size]}

  /* small 아이템 nth-child 위치 지정 */
  &:nth-child(3) {
    grid-column: 3;
    grid-row: 2;
  }
  &:nth-child(4) {
    grid-column: 4;
    grid-row: 2;
  }

  &:hover {
    transform: scale(1.01);
  }
`;

const ItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
`;

const OverlayCenter = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemTitle = styled.p`
  font-size: 16px;
  color: white;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDesc = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const CenterTitle = styled.p`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;
