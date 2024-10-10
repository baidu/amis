import React from 'react';
import {Button, ConfirmBox, Controller, Form, InputBox} from 'amis-ui';

export default function ButtonExamples() {
  const [isShow, setIsShow] = React.useState(false);
  const handleClick = React.useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);
  const handleCancel = React.useCallback(() => {
    setIsShow(false);
  }, []);
  // const beforeConfirm = React.useCallback(async () => {
  //   return false;
  // }, []);
  const handleConfirm = React.useCallback((data: any) => {
    console.log('confirmed', data);
    setIsShow(false);
  }, []);

  async function handleValidate() {
    return new Promise<void>((resolve, reject) => {
      // setTimeout(() => reject('error message'), 200);
      setTimeout(() => resolve(), 200);
    });
  }

  return (
    <div className="wrapper">
      <Button onClick={handleClick}>Open</Button>
      <ConfirmBox
        type="drawer"
        size="md"
        position="bottom"
        onConfirm={handleConfirm}
        show={isShow}
        onCancel={handleCancel}
      >
        {({bodyRef}) => (
          <Form ref={bodyRef} onValidate={handleValidate}>
            {({control}) => (
              <>
                <Controller
                  mode="horizontal"
                  label="A"
                  name="a"
                  control={control}
                  rules={{maxLength: 20}}
                  isRequired
                  render={({field, fieldState}) => (
                    <InputBox
                      {...field}
                      hasError={!!fieldState.error}
                      disabled={false}
                    />
                  )}
                />

                <Controller
                  mode="horizontal"
                  label="B"
                  name="b"
                  control={control}
                  rules={{maxLength: 20}}
                  isRequired
                  render={({field, fieldState}) => (
                    <InputBox
                      {...field}
                      hasError={!!fieldState.error}
                      disabled={false}
                    />
                  )}
                />
              </>
            )}
          </Form>
        )}
      </ConfirmBox>
    </div>
  );
}
