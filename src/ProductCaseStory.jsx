import React from 'react';
import AssetImage from './AssetImage';
import LandscapeScene from './LandscapeScene';
import './product-case-story.css';

export const productChapters = [
  {id: 'problem', label: '발견한 문제'},
  {id: 'notifications', label: '알림 설정'},
  {id: 'mobile-flow', label: '모바일 과업'},
  {id: 'platforms', label: '플랫폼 연결'},
  {id: 'reflection', label: '정리와 검증'},
];

// These mappings refer to the retained, editable v11 source scenes. The reader
// view changes their layout, not their claims, evidence, or source material.
const nodeText = (scene, index) => scene.nodes[index]?.text || '';

function StoryHeading({scene, chapter, description}) {
  return <header className="pcs-heading">
    <p className="pcs-kicker">{chapter.label}</p>
    <h2 id={`${chapter.id}-title`}>{scene.title}</h2>
    {description && <p className="pcs-description">{description}</p>}
  </header>;
}

function OriginalSlide({scene}) {
  const source = scene.nodes.find(node => node.type === 'text' && node.text.startsWith('원본 v11'))?.text;
  return <details className="pcs-original">
    <summary>
      <span>원본 장표 보기</span>
      <span className="pcs-original-action" aria-hidden="true">
        <span className="pcs-original-open">열기</span>
        <span className="pcs-original-close">닫기</span>
      </span>
    </summary>
    <div className="pcs-original-view">
      {source && <p className="pcs-original-source">{source}</p>}
      <LandscapeScene scene={scene}/>
    </div>
  </details>;
}

function Problem({scene}) {
  const chapter = productChapters[0];
  const labels = [nodeText(scene, 16), nodeText(scene, 17)];
  return <section id={chapter.id} className="pcs-section" aria-labelledby={`${chapter.id}-title`}>
    <StoryHeading scene={scene} chapter={chapter} description={nodeText(scene, 1)}/>
    <div className="pcs-comparison-head" aria-hidden="true">
      {labels.map(label => <span key={label}>{label}</span>)}
    </div>
    <dl className="pcs-comparisons" aria-label={`${labels[0]}와 ${labels[1]}`}>
      {[[2, 5], [7, 10], [12, 15]].map(([observation, decision]) => <div className="pcs-comparison-row" key={observation}>
        <dt><span className="pcs-mobile-label" aria-hidden="true">{labels[0]}</span>{nodeText(scene, observation)}</dt>
        <dd><span className="pcs-mobile-label" aria-hidden="true">{labels[1]}</span>{nodeText(scene, decision)}</dd>
      </div>)}
    </dl>
    <OriginalSlide scene={scene}/>
  </section>;
}

function NotificationCell({node}) {
  return <div className="pcs-condition">
    {node.children.map((child, index) => index === 0
      ? <strong key={index}>{child.text}</strong>
      : <span key={index}>{child.text}</span>)}
  </div>;
}

function Notifications({scene}) {
  const chapter = productChapters[1];
  const labels = [2, 3, 4].map(index => nodeText(scene, index));
  return <section id={chapter.id} className="pcs-section" aria-labelledby={`${chapter.id}-title`}>
    <StoryHeading scene={scene} chapter={chapter} description={nodeText(scene, 1)}/>
    <table className="pcs-state-table" role="table">
      <caption className="pcs-sr-only">앱 설정과 OS 권한에 따른 상태와 다음 행동</caption>
      <thead role="rowgroup"><tr role="row">
        {labels.map((label, index) => <th key={label} id={`pcs-condition-${index}`} scope="col" role="columnheader">{label}</th>)}
      </tr></thead>
      <tbody role="rowgroup">
        {[[5, 8, 11], [12, 15, 18], [19, 22, 25]].map((row, index) => <tr key={index} role="row">
          {row.map((nodeIndex, column) => <td key={nodeIndex} role="cell" headers={`pcs-condition-${column}`} data-label={labels[column]}>
            <NotificationCell node={scene.nodes[nodeIndex]}/>
          </td>)}
        </tr>)}
      </tbody>
    </table>
    <p className="pcs-boundary-note">{nodeText(scene, 27)}</p>
    <OriginalSlide scene={scene}/>
  </section>;
}

function MobileFlow({scene}) {
  const chapter = productChapters[2];
  return <section id={chapter.id} className="pcs-section" aria-labelledby={`${chapter.id}-title`}>
    <StoryHeading scene={scene} chapter={chapter} description={nodeText(scene, 1)}/>
    <div className="pcs-mobile-gallery">
      {[[2, 3], [4, 5], [6, 7]].map(([imageIndex, captionIndex]) => {
        const image = scene.nodes[imageIndex];
        const caption = nodeText(scene, captionIndex);
        return <figure key={image.path}>
          <a className="pcs-mobile-image" href={image.path} target="_blank" rel="noreferrer" aria-label={`${caption} 원본 이미지 크게 보기`}>
            <AssetImage src={image.path} alt={`WITIM iOS 앱의 ${caption} 화면`} loading="lazy"/>
          </a>
          <figcaption>{caption}</figcaption>
        </figure>;
      })}
    </div>
    <OriginalSlide scene={scene}/>
  </section>;
}

function Platforms({scene}) {
  const chapter = productChapters[3];
  return <section id={chapter.id} className="pcs-section" aria-labelledby={`${chapter.id}-title`}>
    <StoryHeading scene={scene} chapter={chapter} description={nodeText(scene, 1)}/>
    <div className="pcs-platform-gallery">
      {[[2, 3], [4, 5]].map(([imageIndex, captionIndex]) => {
        const image = scene.nodes[imageIndex];
        const caption = nodeText(scene, captionIndex);
        return <figure key={image.path}>
          <a className="pcs-desktop-image" href={image.path} target="_blank" rel="noreferrer" aria-label={`${caption} 원본 이미지 크게 보기`}>
            <AssetImage src={image.path} alt={`WITIM ${caption}, 업무 협업 인터페이스 원본`} loading="lazy"/>
          </a>
          <figcaption>
            <span>{caption}</span>
            <a href={image.path} target="_blank" rel="noreferrer">원본 이미지 보기</a>
          </figcaption>
        </figure>;
      })}
    </div>
    <OriginalSlide scene={scene}/>
  </section>;
}

function Reflection({scene}) {
  const chapter = productChapters[4];
  return <section id={chapter.id} className="pcs-section" aria-labelledby={`${chapter.id}-title`}>
    <StoryHeading scene={scene} chapter={chapter} description={nodeText(scene, 2)}/>
    <dl className="pcs-reflections">
      {[[4, 5], [7, 8], [10, 11]].map(([label, description]) => <div key={label}>
        <dt>{nodeText(scene, label)}</dt>
        <dd>{nodeText(scene, description)}</dd>
      </div>)}
    </dl>
    <OriginalSlide scene={scene}/>
  </section>;
}

export default function ProductCaseStory({chapters = []}) {
  const sceneById = new Map(chapters.map(scene => [scene.id, scene]));
  const sections = [
    ['004', Problem],
    ['005', Notifications],
    ['006', MobileFlow],
    ['007', Platforms],
    ['008', Reflection],
  ];
  return <>{sections.map(([id, Section]) => {
    const scene = sceneById.get(id);
    return scene ? <Section key={id} scene={scene}/> : null;
  })}</>;
}
