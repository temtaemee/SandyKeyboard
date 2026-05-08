import styled from 'styled-components';

const notices = [
  {
    id: 1,
    title: '5월 워케이션 이벤트 안내',
    date: '2026.05.08',
  },
  {
    id: 2,
    title: '서비스 점검 안내',
    date: '2026.05.01',
  },
];

export default function NoticePage() {
  return (
    <Board>
      {notices.map((item) => (
        <Row key={item.id}>
          <Title>{item.title}</Title>
          <Date>{item.date}</Date>
        </Row>
      ))}
    </Board>
  );
}

const Board = styled.div`
  border-top: 2px solid black;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const Title = styled.div`
  font-size: 16px;
`;

const Date = styled.div`
  color: #999;
`;
