import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';

describe('clearable', () => {
  const initSchema = (action = {} as any) => ({
    type: 'form',
    body: [
      {
        name: 'text',
        type: 'input-text',
        placeholder: 'email',
        resetValue: '',
        clearable: true,
        onEvent: {
          clear: {
            actions: [action]
          }
        }
      }
    ]
  });

  test('should execute the clear event handler while clicking the clear icon', async () => {
    const mockScript = jest.fn();

    const {container} = render(
      amisRender(initSchema({actionType: 'custom', script: mockScript}))
    );

    const inputEl = screen.queryByPlaceholderText('email');
    fireEvent.change(inputEl!, {target: {value: 'baidu'}});

    expect(screen.queryByDisplayValue('baidu')).toBeInTheDocument();

    await waitFor(() => {
      const clearEl = container.querySelector('a.cxd-TextControl-clear');

      expect(clearEl).toBeInTheDocument();
      fireEvent.click(clearEl!);
    });

    await waitFor(() => {
      expect(mockScript).toBeCalledTimes(1);
      expect(screen.queryByDisplayValue('baidu')).not.toBeInTheDocument();
    });
  });

  test('should not modify the value of the input if the property preventDefault of the clear event is true', async () => {
    const mockScript = jest.fn();

    const {container} = render(
      amisRender(
        initSchema({
          actionType: 'custom',
          script: mockScript,
          preventDefault: true
        })
      )
    );

    const inputEl = screen.queryByPlaceholderText('email');
    fireEvent.change(inputEl!, {target: {value: 'baidu'}});

    expect(screen.queryByDisplayValue('baidu')).toBeInTheDocument();

    await waitFor(() => {
      const clearEl = container.querySelector('a.cxd-TextControl-clear');

      expect(clearEl).toBeInTheDocument();
      fireEvent.click(clearEl!);
    });

    await waitFor(() => {
      expect(mockScript).toBeCalledTimes(1);
      expect(screen.queryByDisplayValue('baidu')).toBeInTheDocument();
    });
  });
});
