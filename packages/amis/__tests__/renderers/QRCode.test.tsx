import {render, waitFor, cleanup} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';
import 'jest-canvas-mock';

afterEach(() => {
  cleanup();
});

const setupQRCode = async (qrcodeProps: any = {}) => {
  const result = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'qr-code',
          value: 'amis',
          codeSize: 128,
          ...qrcodeProps
        }
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(result.container.querySelector('.cxd-QrCode')).toBeInTheDocument();
  });

  return {
    ...result,
    qrcode: result.container.querySelector('.cxd-QrCode'),
    svgEl: result.container.querySelector('.cxd-QrCode')?.firstElementChild
  };
};

describe('Renderer:qr-code', () => {
  test('QRCode render with svg', async () => {
    const {container, svgEl} = await setupQRCode();

    expect(svgEl).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  test('QRCode with background/foreground color', async () => {
    const {container, svgEl} = await setupQRCode({
      backgroundColor: '#108cee',
      foregroundColor: 'yellow'
    });

    expect(svgEl?.firstElementChild?.getAttribute('fill')).toBe('#108cee');
    expect(svgEl?.lastElementChild?.getAttribute('fill')).toBe('yellow');
    expect(container).toMatchSnapshot();
  });

  test('QRCode with image', async () => {
    const {container, svgEl} = await setupQRCode({
      imageSettings: {
        src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg',
        width: 50,
        height: 30,
        x: 20,
        y: 30
      }
    });
    const imageEl = svgEl?.lastElementChild;

    expect(imageEl).not.toBeNull();
    expect(imageEl?.getAttribute('xlink:href')).not.toBeUndefined();
    expect(Number(imageEl?.getAttribute('x'))).toBeGreaterThan(0);
    expect(Number(imageEl?.getAttribute('y'))).toBeGreaterThan(0);
    expect(Number(imageEl?.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(imageEl?.getAttribute('height'))).toBeGreaterThan(0);
    expect(container).toMatchSnapshot();
  });
});
