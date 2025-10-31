import React from 'react';
import s from './FeatureCards.module.scss';

export interface FeatureCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonType?: 'primary' | 'secondary';
  titleColor?: string; // 제목 색상 추가
}

const FEATURE_CARDS: FeatureCardProps[] = [
  {
    id: '1',
    title: 'THINK DIFFERENT.',
    subtitle: '유명 쇼핑몰이 사용하는 이유',
    description: '혁신적인 디자인과 품질로 차별화된 경험을 제공합니다.',
    image: '/api/placeholder/300/200',
    buttonText: 'More',
    buttonType: 'secondary',
    titleColor: '#1d1d1f'
  },
  {
    id: '2',
    title: '마음껏 누리는 표현의 자유.',
    subtitle: '어떤 일이든 빠르고 간편하게.',
    description: '창의적인 아이디어를 자유롭게 표현하고 실현하세요.',
    image: '/api/placeholder/300/200',
    buttonText: 'More',
    buttonType: 'secondary',
    titleColor: '#1d1d1f'
  },
  {
    id: '3',
    title: '압도적인 디자인',
    subtitle: '혁신적인 캐리어 확인해보세요',
    description: '세련된 디자인과 뛰어난 기능성을 갖춘 프리미엄 캐리어를 만나보세요.',
    image: '/api/placeholder/400/300',
    buttonText: '자세히 보기',
    buttonType: 'primary',
    titleColor: 'white' // 네온 글로우 효과를 위해 흰색 유지
  },
  {
    id: '4',
    title: '루이스폴센 램프',
    subtitle: 'HAND MADE',
    description: '수제로 제작된 정교한 조명으로 공간을 아름답게 연출하세요.',
    image: '/api/placeholder/300/200',
    buttonText: 'More',
    buttonType: 'secondary',
    titleColor: '#1d1d1f'
  },
  {
    id: '5',
    title: 'AirPods Max',
    subtitle: '과감하리만치 독창적인 구조.',
    description: '혁신적인 오디오 기술로 완전히 새로운 음악 경험을 선사합니다.',
    image: '/api/placeholder/300/200',
    buttonText: 'More',
    buttonType: 'secondary',
    titleColor: '#1d1d1f'
  }
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  description,
  image,
  titleColor = '#1d1d1f'
}) => {
  return (
    <div 
      className={s.featureCard}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={s.content}>
        <h3 
          className={s.title}
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p className={s.subtitle}>{subtitle}</p>
        <p className={s.description}>{description}</p>
      </div>
    </div>
  );
};

const FeatureCards: React.FC = () => {
  return (
    <section className={s.featureCards}>
      <div className={s.container}>
        <div className={s.grid}>
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
