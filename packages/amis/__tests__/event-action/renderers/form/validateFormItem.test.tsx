import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('doAction:formItem validate', async () => {
  const notify = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '校验name',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'validateFormItem',
                    componentId: 'name_validate',
                    outputVar: 'form_validate_result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'validate_info',
                    args: {
                      value: '${event.data.form_validate_result|json}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '校验email',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'validateFormItem',
                    componentId: 'email_validate',
                    outputVar: 'form_validate_result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'validate_info',
                    args: {
                      value: '${event.data.form_validate_result|json}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'input-text',
            name: 'validate_info',
            id: 'validate_info',
            label: '验证信息：'
          },
          {
            type: 'input-text',
            name: 'validate_res',
            id: 'validate_res',
            label: '验证结果：'
          },
          {
            type: 'form',
            onEvent: {
              formItemValidateSucc: {
                actions: [
                  {
                    expression: '${event.data.__formName === "name"}',
                    actionType: 'setValue',
                    componentId: 'validate_res',
                    args: {
                      value: 'validate name success'
                    }
                  },
                  {
                    expression: '${event.data.__formName === "email"}',
                    actionType: 'setValue',
                    componentId: 'validate_res',
                    args: {
                      value: 'validate email success'
                    }
                  }
                ]
              },
              formItemValidateError: {
                actions: [
                  {
                    expression: '${event.data.__formName === "name"}',
                    actionType: 'setValue',
                    componentId: 'validate_res',
                    args: {
                      value: 'validate name fail'
                    }
                  },
                  {
                    expression: '${event.data.__formName === "email"}',
                    actionType: 'setValue',
                    componentId: 'validate_res',
                    args: {
                      value: 'validate email fail'
                    }
                  }
                ]
              }
            },
            body: [
              {
                type: 'input-text',
                id: 'name_validate',
                name: 'name',
                label: '姓名：',
                required: true
              },
              {
                name: 'email',
                type: 'input-text',
                id: 'email_validate',
                label: '邮箱：',
                required: true,
                validations: {
                  isEmail: true
                }
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify
      })
    )
  );

  // 校验 name
  await waitFor(() => {
    expect(getByText('校验name')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/校验name/));
  await wait(300);
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(`{  "error": "这是必填项"}`);
  });
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_res"]') as any)?.value
    ).toEqual('validate name fail');
  });

  expect(container).toMatchSnapshot();

  // 校验 email 必填
  await wait(300);
  await waitFor(() => {
    expect(getByText('校验email')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/校验email/));

  await wait(300);
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(`{  "error": "这是必填项"}`);
  });
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_res"]') as any)?.value
    ).toEqual('validate email fail');
  });

  expect(container).toMatchSnapshot();

  // 校验 email 格式
  fireEvent.change(container.querySelector('[name="email"]')!, {
    target: {value: 'invalid_email'}
  });

  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('[name="email"][value="invalid_email"]')
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(getByText('校验email')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/校验email/));

  await wait(300);
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(`{  "error": "Email 格式不正确",  "value": "invalid_email"}`);
  });
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_res"]') as any)?.value
    ).toEqual('validate email fail');
  });

  expect(container).toMatchSnapshot();

  // 填写值
  fireEvent.change(container.querySelector('[name="name"]')!, {
    target: {value: 'amis'}
  });

  await wait(300);
  fireEvent.change(container.querySelector('[name="email"]')!, {
    target: {value: 'amis@baidu.com'}
  });

  await wait(300);
  await waitFor(() => {
    expect(container.querySelector('[value="amis"]')).toBeInTheDocument();
    expect(
      container.querySelector('[value="amis@baidu.com"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  // 清空错误信息
  fireEvent.change(container.querySelector('[name="validate_info"]')!, {
    target: {value: ''}
  });

  await wait(300);
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual('');
  });

  // 重新校验name
  fireEvent.click(getByText(/校验name/));

  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('.is-error .is-required .has-error--isRequired')
    ).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(`{  "error": "",  "value": "amis"}`);
  });
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_res"]') as any)?.value
    ).toEqual('validate name success');
  });

  expect(container).toMatchSnapshot();

  // 重新校验email
  fireEvent.click(getByText(/校验email/));

  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('.is-error .is-required .has-error--isRequired')
    ).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(`{  "error": "",  "value": "amis@baidu.com"}`);
  });
  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_res"]') as any)?.value
    ).toEqual('validate email success');
  });

  expect(container).toMatchSnapshot();
}, 10000);
