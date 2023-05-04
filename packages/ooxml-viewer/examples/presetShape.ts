import {presetShape} from '../src/openxml/drawing/presetShape';
import {shapeToSVG} from '../src/openxml/drawing/svg/shapeToSVG';

const container = document.getElementById('shapes')! as HTMLElement;

for (const shapeName in presetShape) {
  // 临时测试用
  if (shapeName !== 'smileyFace') {
    // continue;
  }
  const shape = presetShape[shapeName];
  console.log('render shape', shapeName);
  const svg = shapeToSVG(shape, [], {}, 100, 100, {
    fillColor: '#4472C4'
  });

  const div = document.createElement('div');
  div.style.display = 'inline-block';
  div.style.margin = '12px 40px';
  div.style.width = '100px';
  div.style.height = '120px';
  div.style.boxSizing = 'border-box';
  div.style.verticalAlign = 'top';
  div.style.textAlign = 'center';

  div.appendChild(svg);
  const p = document.createElement('p');

  p.innerText = shapeName;
  div.appendChild(p);
  container.appendChild(div);
}
