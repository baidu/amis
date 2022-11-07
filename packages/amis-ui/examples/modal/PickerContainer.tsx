import React from 'react';
import {PickerContainer, Button, Form, Controller, InputBox} from 'amis-ui';

export default function () {
  const body = React.createRef<any>();
  const beforeConfirm = React.useCallback(() => {
    return body.current?.submit();
  }, []);
  const handleConfirm = React.useCallback((data: any) => {
    console.log('confirmed', data);
  }, []);

  return (
    <div className="wrapper">
      <PickerContainer
        beforeConfirm={beforeConfirm}
        onConfirm={handleConfirm}
        bodyRender={() => (
          <Form ref={body}>
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
      >
        {({isOpened, onClick}) => (
          <Button active={isOpened} onClick={onClick}>
            Open
          </Button>
        )}
      </PickerContainer>
    </div>
  );
}
